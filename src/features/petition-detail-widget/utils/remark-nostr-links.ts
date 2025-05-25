import { visit } from 'unist-util-visit';
import { decode } from 'nostr-tools/nip19';

// Define more specific types for the AST nodes
interface Node {
  type: string;
  [key: string]: any;
}

interface Parent extends Node {
  children: Node[];
}

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface LinkNode extends Node {
  type: 'link';
  url: string;
  children: Node[];
  data?: {
    hProperties?: {
      className?: string;
      [key: string]: any;
    };
  };
}

// The regex pattern for Nostr links
const nostrRegex = /(nostr:n[a-zA-Z0-9]+)/g;

// Interface for decoded nostr data
interface DecodedNostrData {
  type: string;
  id: string;
  kind?: number;
  pubkey?: string;
}

// Function to decode nostr identifier and extract metadata
function decodeNostrId(nostrString: string): DecodedNostrData | null {
  try {
    const nostrId = nostrString.substring(6); // Remove 'nostr:' prefix
    const decoded = decode(nostrId);

    switch (decoded.type) {
      case 'note':
        return {
          type: 'note',
          id: decoded.data as string
        };
      case 'npub':
        return {
          type: 'npub',
          id: decoded.data as string,
          pubkey: decoded.data as string
        };
      case 'nprofile':
        return {
          type: 'nprofile',
          id: (decoded.data as any).pubkey,
          pubkey: (decoded.data as any).pubkey
        };
      case 'nevent':
        return {
          type: 'nevent',
          id: (decoded.data as any).id,
          kind: (decoded.data as any).kind
        };
      case 'naddr':
        return {
          type: 'naddr',
          id: nostrId
        };
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}

// The remark plugin function
export function remarkNostrLinks() {
  return (tree: Node) => {
    visit(tree, 'text', (node: TextNode, index, parent: Parent | undefined) => {
      if (!parent || index === null) return;

      const { value } = node;
      const matches = Array.from(value.matchAll(nostrRegex));

      if (matches.length === 0) return;

      // Create an array to hold the new nodes
      const newNodes: (TextNode | LinkNode)[] = [];
      let lastIndex = 0;

      for (const match of matches) {
        const [fullMatch] = match;
        const startIndex = match.index!;

        // Add text before the match
        if (startIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: value.slice(lastIndex, startIndex)
          } as TextNode);
        }

        // Decode the nostr identifier
        const decodedData = decodeNostrId(fullMatch);

        if (decodedData) {
          // Create enhanced link node with metadata for component override
          const textNode: TextNode = { type: 'text', value: fullMatch };
          const hProperties: { [key: string]: any } = {
            className: `nostr-link nostr-${decodedData.type}`,
            'data-nostr-type': decodedData.type,
            'data-nostr-id': decodedData.id,
            'data-original': fullMatch
          };

          // Add kind for nevents
          if (decodedData.kind !== undefined) {
            hProperties['data-nostr-kind'] = decodedData.kind.toString();
          }

          // Add pubkey for profile types
          if (decodedData.pubkey) {
            hProperties['data-nostr-pubkey'] = decodedData.pubkey;
          }

          newNodes.push({
            type: 'link',
            url: '#', // Placeholder URL, component will handle rendering
            children: [textNode],
            data: { hProperties }
          } as LinkNode);
        } else {
          // If decoding fails, treat as regular text
          newNodes.push({
            type: 'text',
            value: fullMatch
          } as TextNode);
        }

        lastIndex = startIndex + fullMatch.length;
      }

      // Add any remaining text
      if (lastIndex < value.length) {
        newNodes.push({
          type: 'text',
          value: value.slice(lastIndex)
        } as TextNode);
      }

      // Replace the current node with the new nodes
      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
