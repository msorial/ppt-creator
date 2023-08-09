import { Button } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant='light'
      leftIcon={<IconChevronLeft size={14} />}
      color='red'
    >
      Back
    </Button>
  );
};

export default BackButton;
