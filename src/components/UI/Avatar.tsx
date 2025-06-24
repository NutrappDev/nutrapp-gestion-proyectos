import { Box, rem } from '@mantine/core';

interface AvatarProps {
  initials: string;
  imageUrl?: string;
  size?: number;
  color?: string;
}


export const Avatar = ({ initials, imageUrl, size = 32, color = '#4e4e4e' }: AvatarProps) => {
  return (
    <Box
      style={{
        width: rem(size),
        height: rem(size),
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: rem(size * 0.4),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
      }}
      aria-label={`Avatar de ${initials}`}
    >
      {!imageUrl && initials}
    </Box>
  );
};