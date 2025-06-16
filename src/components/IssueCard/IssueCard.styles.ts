import styled from '@emotion/styled';

export const Card = styled.div`
  min-width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 12px;
  display: flex;
  flex-direction: column; 
  gap: 4px;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
`;

export const AvatarImage = styled.img`
  min-width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
  background-color: #f0f0f0;
`;

export const AvatarFallback = styled.div<{ color: string }>`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
`;

export const Content = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

export const Summary = styled.div`
  display: flex;
  margin-bottom: 4px;
  align-items: center;
  gap: 4px;
`;

export const SummaryContent = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #171818;
  cursor: pointer;
`;

export const HoursBadge = styled.span`
  font-size: 0.8rem;
  color: #9184c6;
  padding: 2px 6px;
  border-radius: 4px;
  align-items: center;
  display: flex;
`;

export const KeyContent = styled.h3`
  font-size: 0.85rem;
  font-weight: 500;
  margin: 4px 0;
  color: #8da6f6;
  background-color: #f3f5ff;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 11px;
  -webkit-line-clamp: 2;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DateBadge = styled.div`
  color: #5E6C84;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CommentContainer = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: #F4F5F7;
  border-radius: 4px;
  font-size: 0.875rem;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: #6B778C;
  font-size: 0.75rem;
`;

export const CommentContent = styled.div`
  color: #172B4D;
  white-space: pre-wrap;
  word-break: break-word;
`;
