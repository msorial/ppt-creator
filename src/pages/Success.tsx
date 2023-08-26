import {
  Flex,
  Text,
  Title,
  Button,
  ThemeIcon,
  Group,
  Divider,
  Code,
  Kbd,
} from '@mantine/core';
import { IconCircleCheck, IconRefresh } from '@tabler/icons-react';
import useDates from '../store/useDates';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import useUi from '../store/useUi';
import { useEffect, useState } from 'react';

const Success = () => {
  const navigate = useNavigate();
  const { darkMode } = useUi();
  const { selectedCopticDates, apiDate } = useDates();
  const [pptLoc, setPptLoc] = useState<string>('');
  const dateObject = apiDate
    ? moment(`${apiDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
    : undefined;
  let formattedDate = '';

  if (dateObject) {
    formattedDate = moment(apiDate).format('MM/DD/YYYY');
  }

  useEffect(() => {
    if (apiDate !== undefined) {
      fetch('https://stmarkapi.com:8080/pptname?date=' + apiDate)
        .then((response) => response.json())
        .then((data) => {
          setPptLoc(data.pptName);
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
        });
    }
  }, [apiDate]);

  return (
    <Flex
      gap='xs'
      justify='center'
      align='center'
      direction='column'
      wrap='nowrap'
      sx={{ height: '100%', textAlign: 'center' }}
    >
      <ThemeIcon radius='xl' size='xl' color='green'>
        <IconCircleCheck />
      </ThemeIcon>
      <Title
        order={2}
        variant='gradient'
        gradient={{ from: '#58b580', to: '#099773', deg: 45 }}
      >
        Powerpoint Created
      </Title>

      <Group position='apart'>
        <Text>{formattedDate}</Text>
        {selectedCopticDates?.copticDate && (
          <>
            <Divider orientation='vertical' />
            <Text>{selectedCopticDates?.copticDate}</Text>
          </>
        )}
      </Group>

      <Kbd sx={{ marginTop: '15px' }}>{pptLoc}</Kbd>

      <Button
        variant='outline'
        leftIcon={<IconRefresh size={16} stroke={1.5} />}
        color={darkMode ? 'gray' : 'dark'}
        sx={{ padding: '0px 40px', marginTop: '15px' }}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
    </Flex>
  );
};

export default Success;
