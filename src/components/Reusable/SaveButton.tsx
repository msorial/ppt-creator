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
      variant='light'
      disabled={disabled}
      leftIcon={<IconDeviceFloppy size={16} />}
      color='green'
    >
      Save
    </Button>
  );
};

export default SaveButton;
