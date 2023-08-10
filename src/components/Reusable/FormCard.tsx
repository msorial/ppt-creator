import { ReactElement } from 'react';
import { Box, Paper, Progress, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface FormCardProps {
  content: ReactElement;
}

const FormCard: React.FC<FormCardProps> = ({ content }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Paper
      shadow='sm'
      p={0}
      withBorder
      sx={{ width: isMobile ? '100%' : '80%' }}
    >
      {/* Hard coded value, change in future */}
      <Progress size='md' value={20} sx={{ margin: '5px' }} />
      <Box sx={{ padding: '24px' }}>{content}</Box>
    </Paper>
  );
};

export default FormCard;
