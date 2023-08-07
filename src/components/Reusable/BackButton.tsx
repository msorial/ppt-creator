import { Button } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';

const BackButton = () => {
  return (
    <Button
      variant='light'
      leftIcon={<IconChevronLeft size={14} />}
      color='red'
    >
      Back
    </Button>
  );
};

export default BackButton;
