import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remarkNostrLinks } from '../utils/remark-nostr-links';
import { NostrLink } from './nostr-link';

interface MDXContentProps {
  content: string;
}

export const MDXContent = memo(({ content }: MDXContentProps) => {
  return (
    <div className="mdx-content prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkNostrLinks]}
        components={{
          a: NostrLink,
          // すべてのpタグをdivに置き換えてDOM検証エラーを回避
          p: ({ children, ...props }) => (
            <div className="mb-4 leading-relaxed" {...props}>
              {children}
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MDXContent.displayName = 'MDXContent';
