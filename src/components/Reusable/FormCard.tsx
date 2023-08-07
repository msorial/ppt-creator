import { ReactElement } from 'react';
import { Paper } from '@mantine/core';

interface FormCardProps {
  content: ReactElement;
}

const FormCard = ({ content }: FormCardProps) => {
  return (
    <Paper shadow='md' p='xl' withBorder sx={{ width: '70%' }}>
      {content}
    </Paper>
  );
};

export default FormCard;
