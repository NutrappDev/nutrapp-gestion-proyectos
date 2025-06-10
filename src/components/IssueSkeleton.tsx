import styled from "@emotion/styled";

const SkeletonContainer = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  background: #f0f0f0;
  border-radius: 6px;
`;

const SkeletonLine = styled.div<{ width: string }>`
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 6px;
  width: ${({ width }) => width};
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const IssueSkeleton = () => (
  <SkeletonContainer>
    <SkeletonLine width="70%" />
    <SkeletonLine width="50%" />
    <SkeletonLine width="30%" />
  </SkeletonContainer>
);

