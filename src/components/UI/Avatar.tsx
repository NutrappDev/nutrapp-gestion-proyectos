import styled from '@emotion/styled';

interface AvatarProps {
  initials: string;
  imageUrl?: string;
  size?: number;
  color?: string;
}

const AvatarContainer = styled.div<{ size: number; color: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${({ size }) => size * 0.4}px;
  background-size: cover;
  background-position: center;
`;

export const Avatar = ({ initials, imageUrl, size = 32, color = '#4e4e4e' }: AvatarProps) => {
  return (
    <AvatarContainer
      size={size}
      color={color}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
      aria-label={`Avatar de ${initials}`}
    >
      {!imageUrl && initials}
    </AvatarContainer>
  );
};