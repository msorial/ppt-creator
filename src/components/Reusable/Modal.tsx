import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React from 'react';
import useUi from '../../store/useUi';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const Modal: React.FC<SubmitButtonProps> = ({ onClick, disabled }) => {
  const { darkMode } = useUi();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      rightIcon={<IconSend size={14} />}
      color={darkMode ? 'gray' : 'dark'}
    >
      Submit
    </Button>
  );
};

export default Modal;
