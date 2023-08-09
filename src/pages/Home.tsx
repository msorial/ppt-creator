import { Flex, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import NextButton from '../components/Reusable/NextButton';
import DatePicker from '../components/Reusable/DatePicker';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDates from '../store/useDates';
import { useMediaQuery } from '@mantine/hooks';

const Home = () => {
  const { currentCopticDates, selectedDate, setCurrentCopticDates } =
    useDates();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    // Fetches the Date Information on Mount and sets it in Global State
    fetch('http://192.81.219.24:8080/home')
      .then((response) => response.json())
      .then((data) => {
        setCurrentCopticDates(data);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (selectedDate !== null) {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      const formattedDateString = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      axios
        .post('http://192.81.219.24:8080/date?date=' + formattedDate)
        .then((response) => {
          navigate('/vespers', { state: { formattedDateString } });
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
        });
    }
  };

  return (
    <PageLayout
      header={
        <Flex
          gap='xl'
          justify='space-between'
          align='end'
          direction='row'
          wrap='nowrap'
          sx={{ width: isMobile ? '100%' : '80%' }}
        >
          <Stack justify='flex-end' spacing='xs'>
            <Text align='left'>{currentCopticDates?.copticDate}</Text>
            {currentCopticDates?.sunday !== 'WEEKDAY' && (
              <Text align='left'>{currentCopticDates?.sunday}</Text>
            )}
          </Stack>

          <Stack justify='flex-end' spacing='xs'>
            {/* <Text align='right'>{currentCopticDates.ocassion}</Text> */}
            <Text align='right'>{currentCopticDates?.season}</Text>
          </Stack>
        </Flex>
      }
      form={<FormCard content={<DatePicker />} />}
      footer={
        <Group>
          <NextButton onClick={handleSubmit} />
        </Group>
      }
    />
  );
};

export default Home;
