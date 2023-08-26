import { Flex, Stack, Text, useMantineTheme } from '@mantine/core';
import NextButton from '../components/Reusable/NextButton';
import DatePicker from '../components/Reusable/DatePicker';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDates from '../store/useDates';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';

const Home = () => {
  const { currentCopticDates, apiDate, setCurrentCopticDates } = useDates();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    // Fetches the Date Information on Mount and sets it in Global State
    fetch('https://stmarkapi.com:8080/home')
      .then((response) => response.json())
      .then((data) => {
        setCurrentCopticDates(data);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (apiDate !== undefined) {
      navigate('/vespers');
    } else
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        message: 'Date must be selected to generate powerpoint',
        color: 'red',
        icon: <IconAlertCircle />,
      });
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
            <Text align='right'>{currentCopticDates?.season}</Text>
          </Stack>
        </Flex>
      }
      form={<FormCard content={<DatePicker />} />}
      footer={<NextButton onClick={handleSubmit} />}
    />
  );
};

export default Home;
