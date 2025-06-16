import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import type { JiraComment, JiraDocContent } from '@/types/jira';

const Paragraph = styled.p`
  margin-bottom: 8px; 
  &:last-child {
    margin-bottom: 0;
  }
`;

const Mention = styled.span`
  color: #0052cc;
  background-color: #e6fcff;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
`;

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
          return <Paragraph key={index}>{node.content && renderContent(node.content)}</Paragraph>;
        case 'text':
          return <React.Fragment key={index}>{node.text || ''}</React.Fragment>;
        case 'mention':
          return (
            <Mention key={index}>
              {node.attrs?.text || `@user-${node.attrs?.id || 'unknown'}`}
            </Mention>
          );
        default:
          console.warn(`Tipo de nodo de comentario de Jira no manejado: ${node.type}`);
          return null;
      }
    });
  };

  return <Box>{renderContent(comment.content)}</Box>;
};