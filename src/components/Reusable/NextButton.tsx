import { Button } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

interface NextButtonProps {
  onClick?: () => void;
}

const NextButton = ({ onClick }: NextButtonProps) => {
  return (
    <Button
      onClick={onClick}
      rightIcon={<IconChevronRight size={14} />}
      color='teal'
    >
      Next
    </Button>
  );
};

export default NextButton;
