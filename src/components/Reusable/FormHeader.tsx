import { Text, Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ReadableDate from './ReadableDate';

const FormHeader = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Flex
      gap='xl'
      justify='space-between'
      align='end'
      direction='row'
      wrap='nowrap'
      sx={{ width: isMobile ? '100%' : '80%' }}
    >
      <Text align='left' fw={500}>
        Selected Date
      </Text>
      <ReadableDate />
    </Flex>
  );
};

export default FormHeader;
