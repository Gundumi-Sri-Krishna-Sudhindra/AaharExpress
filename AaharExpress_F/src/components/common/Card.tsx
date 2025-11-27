import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof theme.spacing;
  elevation?: keyof typeof theme.shadows;
  borderRadius?: keyof typeof theme.borderRadius;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled.div<Omit<CardProps, 'children'>>`
  background-color: ${theme.colors.background};
  border-radius: ${({ borderRadius = 'md' }) => theme.borderRadius[borderRadius]};
  box-shadow: ${({ elevation = 'sm' }) => theme.shadows[elevation]};
  padding: ${({ padding = 'md' }) => theme.spacing[padding]};
  transition: all ${theme.transitions.default};

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  `}
`;

const Card: React.FC<CardProps> = ({
  children,
  padding,
  elevation,
  borderRadius,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      padding={padding}
      elevation={elevation}
      borderRadius={borderRadius}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

export default Card; 