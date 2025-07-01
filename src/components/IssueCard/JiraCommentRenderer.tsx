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