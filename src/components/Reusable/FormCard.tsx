import { ReactElement } from 'react';
import { Box, Paper, Progress, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useLocation } from 'react-router-dom';

interface FormCardProps {
  content: ReactElement;
}

interface KeyValueProps {
  [key: string]: number;
}

const FormCard: React.FC<FormCardProps> = ({ content }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  let location = useLocation();

  const progressValues: KeyValueProps = {
    vespers: 16.667,
    matins: 33.334,
    offering: 50,
    liturgyofWord: 66.668,
    liturgyofFaithful: 83.335,
    communion: 100,
  };

  return (
    <Paper
      shadow='sm'
      p={0}
      withBorder
      sx={{ width: isMobile ? '100%' : '80%' }}
    >
      <Progress
        size='md'
        value={progressValues[location.pathname.substring(1)]}
        sx={{ margin: '5px' }}
      />
      <Box sx={{ padding: '24px' }}>{content}</Box>
    </Paper>
  );
};

export default FormCard;
