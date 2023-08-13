import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React from 'react';

interface SubmitButtonProps {
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} rightIcon={<IconSend size={14} />} color='dark'>
      Submit
    </Button>
  );
};

export default SubmitButton;
