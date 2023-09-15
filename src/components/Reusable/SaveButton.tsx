import { Button } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import React from 'react';
import useUi from '../../store/useUi';

interface SaveButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled }) => {
  const { darkMode } = useUi();

  return (
    <Button
      onClick={onClick}
      variant='outline'
      disabled={disabled}
      leftIcon={<IconDeviceFloppy size={22} />}
      color={darkMode ? 'gray' : 'lime.7'}
    >
      Save
    </Button>
  );
};

export default SaveButton;
