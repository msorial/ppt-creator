import { Button } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      rightIcon={<IconChevronRight size={14} />}
      color='teal'
    >
      Next
    </Button>
  );
};

export default NextButton;
