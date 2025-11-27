import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const InputContainer = styled.div<{ hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${({ hasError }) => (hasError ? theme.colors.error : theme.colors.text.secondary)};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background};
  transition: all ${theme.transitions.default};

  &:focus-within {
    border-color: ${({ hasError }) => (hasError ? theme.colors.error : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ hasError }) => (hasError ? theme.colors.error : theme.colors.primary)}33;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
`;

const ErrorMessage = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.error};
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputContainer hasError={!!error}>
        {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
        <StyledInput {...props} />
        {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input; 