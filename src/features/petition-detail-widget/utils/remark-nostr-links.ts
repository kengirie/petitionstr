import { visit } from 'unist-util-visit';

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
    };
  };
}

// The regex pattern for Nostr links
  const nostrRegex = /(nostr:n[a-zA-Z0-9]+)/g;

// Function to determine the appropriate URL for a Nostr link
function getNostrLinkUrl(fullId: string, type: string): string {
  switch (type) {
    case 'note':
      return `/note/${fullId}`;
    case 'npub':
    case 'nprofile':
      return `/profile/${fullId}`;
    case 'nevent':
      return `/petition/${fullId}`;
    case 'naddr':
      return `/address/${fullId}`;
    default:
      return `#${fullId}`;
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
        const [fullMatch, fullId, type] = match;
        const startIndex = match.index!;

        // Add text before the match
        if (startIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: value.slice(lastIndex, startIndex)
          } as TextNode);
        }

        // Add the link node with proper typing
        const textNode: TextNode = { type: 'text', value: fullMatch };
        newNodes.push({
          type: 'link',
          url: getNostrLinkUrl(fullId, type),
          children: [textNode],
          data: { hProperties: { className: 'nostr-link' } }
        } as LinkNode);

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
