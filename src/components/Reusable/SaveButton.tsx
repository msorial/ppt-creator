import { Button } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import React from 'react';

interface SaveButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      leftIcon={<IconDeviceFloppy size={16} />}
      color='blue'
    >
      Save
    </Button>
  );
};

export default SaveButton;
