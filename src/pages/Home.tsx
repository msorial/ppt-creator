import { Flex, Group, Stack, Text } from '@mantine/core';
import BackButton from '../components/Reusable/BackButton';
import NextButton from '../components/Reusable/NextButton';
import DatePicker from '../components/Reusable/DatePicker';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [copticData, setCopticData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the API data when the component mounts
    fetchApiData();
  }, []);

  const fetchApiData = () => {
    // Make an API call to get the data (replace 'http://example.com/api' with your API endpoint)
    fetch('http://192.81.219.24:8080/home')
      .then((response) => response.json())
      .then((data) => {
        setCopticData(data);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (startDate !== null) {
      const formattedDate = startDate.toLocaleDateString('en-CA');
      const formattedDateString = startDate.toLocaleDateString('en-US', {
        weekday: 'long', // Full name of the day (e.g., "Friday")
        month: 'long', // Full name of the month (e.g., "March")
        day: 'numeric', // Day of the month (e.g., "3")
        year: 'numeric', // Four-digit year (e.g., "2023")
      });
      console.log('Selected date:', formattedDate);
      // Handle form submission logic here
      axios
        .post('http://192.81.219.24:8080/date?date=' + formattedDate)
        .then((response) => {
          console.log('API response:', response.data);
          // Redirect to another page after successful submission
          navigate('/vespers', { state: { formattedDateString } }); // Change "/another-page" to the desired URL
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
          // Handle any error or show a message to the user
        });
    }
  };

  return (
    <PageLayout
      header={
        <Flex
          gap='md'
          justify='space-between'
          align='center'
          direction='row'
          wrap='nowrap'
          sx={{ width: '70%' }}
        >
          <Text>{copticData.copticDate}</Text>
          <Text>{copticData.sunday}</Text>
        </Flex>
      }
      form={<FormCard content={<DatePicker />} />}
      footer={
        <Group>
          <NextButton />
        </Group>
      }
    />
  );
};

export default Home;

// <Group>
//   <BackButton />
//   <NextButton />
//   <DatePicker />
//   <FormCard content={<div>test</div>} />
// </Group>
