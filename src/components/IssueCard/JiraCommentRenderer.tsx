import React from 'react';
import { Box, Text } from '@mantine/core';
import type { JiraComment, JiraDocContent } from '@/types/jira';

interface JiraCommentRendererProps {
  comment: JiraComment;
}

export const JiraCommentRenderer: React.FC<JiraCommentRendererProps> = ({ comment }) => {
  if (!comment || comment.type !== 'doc' || !comment.content) {
    return null;
  }

  const renderContent = (content: JiraDocContent[]) => {
    return content.map((node, index) => {
      switch (node.type) {
        case 'paragraph':
          return (
            <Text key={index} size="sm" mb={4} style={{ display: 'block' }}>
              {node.content && renderContent(node.content)}
            </Text>
          );
        case 'text':
          return <React.Fragment key={index}>{node.text || ''}</React.Fragment>;
        case 'mediaSingle':
          return (
            <Box key={index} my={8}>
              {node.content && renderContent(node.content)}
            </Box>
          );

        case "media":
          return null

        case 'inlineCard':
          return (
            <Text
              key={index}
              component="a"
              href={node.attrs?.url}
              target="_blank"
              rel="noopener noreferrer"
              c="blue"
              style={{ textDecoration: 'underline' }}
            >
              {node.attrs?.url}
            </Text>
          );

        case 'hardBreak':
          return <br key={index} />;

        case 'orderedList':
          return (
            <ol key={index} style={{ paddingLeft: 20, marginTop: 4, marginBottom: 4 }}>
              {node.content && renderContent(node.content)}
            </ol>
          );

        case 'listItem':
          return (
            <li key={index}>
              {node.content && renderContent(node.content)}
            </li>
          );

        case 'rule':
          return <hr key={index} style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #ccc' }} />;

        case "blockCard":
          return (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "8px 12px",
                borderRadius: "6px",
                margin: "6px 0",
                background: "#fafafa",
              }}
            >
              <a
                href={node.attrs?.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: "bold",
                  color: "#0052cc",
                  textDecoration: "none",
                }}
              >
                {node.attrs?.url}
              </a>
            </div>
          );

        case 'heading': {
          const rawLevel = node.attrs?.level ?? 1;
          const level = Math.min(Math.max(Number(rawLevel) || 1, 1), 6); // asegura 1..6
          const tagName = `h${level}` as React.ElementType;

          const headingEl = React.createElement(
            tagName,
            { style: { margin: '6px 0' } as React.CSSProperties },
            node.content && renderContent(node.content)
          );

          return <React.Fragment key={index}>{headingEl}</React.Fragment>;
        }

        case 'mediaGroup':
          return (
            <div key={index} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {node.content && renderContent(node.content)}
            </div>
          );

        case 'codeBlock':
          return (
            <pre
              key={index}
              style={{
                background: '#f4f5f7',
                padding: '8px',
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: '0.9em',
                overflowX: 'auto',
              }}
            >
              {node.content && renderContent(node.content)}
            </pre>
          );

        case 'bulletList':
          return (
            <ul key={index} style={{ paddingLeft: 20, marginTop: 4, marginBottom: 4 }}>
              {node.content && renderContent(node.content)}
            </ul>
          );

        case 'mention':
          return (
            <Text
              key={index}
              span
              c="#0052cc"
              bg="#e6fcff"
              px={4}
              py={2}
              style={{ borderRadius: 3, fontWeight: 500 }}
            >
              {node.attrs?.text || `@user-${node.attrs?.id || 'unknown'}`}
            </Text>
          );
        default:
          console.warn(`Tipo de nodo de comentario de Jira no manejado: ${node.type}`);
          return null;
      }
    });
  };

  return <Box>{renderContent(comment.content)}</Box>;
}; 