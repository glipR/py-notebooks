import React from 'react';

import './StyledMarkdown.css'

// Some of these cause errors, either in runtime or compilation
// I love Javascript!!! :sunglasses:
import Markdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypeAccessibleEmojis from 'rehype-accessible-emojis'
import rehypeColorChips from 'rehype-color-chips'
import rehypeVideo from 'rehype-video'
import remarkDirective from 'remark-directive'
// import remarkEmoji from 'remark-emoji'
// import remarkCodeImport from 'remark-code-import'
import remarkCodeFrontmatter from 'remark-code-frontmatter'
// import remarkCodeExtra from 'remark-code-extra'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism'

import {h, Properties} from 'hastscript'
import {visit} from 'unist-util-visit'

function remarkeNotePlugin() {
  return (tree: any) => {
    visit(tree, (node: {attributes: Properties, type: string, name: string, data: any}) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'note') return

        const data = node.data || (node.data = {})
        const tagName = node.type === 'textDirective' ? 'span' : 'div'

        data.hName = tagName
        data.hProperties = h(tagName, {
          ...(node.attributes || {}),
          class: ['note', (node.attributes?.class as string)]
        }).properties
      }
    })
  }
}

interface StyledMarkdownProps {
  content: string;
}

const StyledMarkdown: React.FC<StyledMarkdownProps> = ({ content }) => {
  return (
    <div className={"markdown_container"}>
    <Markdown
      children={content}
      rehypePlugins={[
        rehypeAutolinkHeadings,
        // rehypeAccessibleEmojis,
        rehypeColorChips,
        rehypeVideo,
      ] as any}
      remarkPlugins={[
        remarkDirective,
        // remarkEmoji,
        // remarkCodeImport,
        remarkCodeFrontmatter,
        // remarkCodeExtra,
        remarkeNotePlugin
      ] as any}
      components={{
        code(props) {
          const {children, className, node, ref, ...rest} = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={okaidia}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}
    />
    </div>
  );
};

export default StyledMarkdown;
