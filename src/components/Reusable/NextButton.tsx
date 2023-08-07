import { Button } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

const NextButton = () => {
  return (
    <Button rightIcon={<IconChevronRight size={14} />} color='teal'>
      Next
    </Button>
  );
};

export default NextButton;
