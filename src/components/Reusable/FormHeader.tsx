import { Text, Flex, useMantineTheme, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ReadableDate from './ReadableDate';
import useDates from '../../store/useDates';

const FormHeader = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { selectedCopticDates } = useDates();

  return (
    <Flex
      gap='xl'
      justify='space-between'
      align='end'
      direction='row'
      wrap='nowrap'
      sx={{ width: isMobile ? '100%' : '80%' }}
    >
      <Stack justify='flex-end' spacing={5}>
        <Text align='left' fw={500}>
          Selected Date
        </Text>
        <ReadableDate />
      </Stack>

      <Stack justify='flex-end' spacing={5}>
        <Text align='right'>
          {selectedCopticDates?.ocassion !== ''
            ? selectedCopticDates?.ocassion
            : selectedCopticDates?.season}
        </Text>

        <Text align='right'>{selectedCopticDates?.copticDate}</Text>
      </Stack>
    </Flex>
  );
};

export default FormHeader;
