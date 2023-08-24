import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React from 'react';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      rightIcon={<IconSend size={14} />}
      color='dark'
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
