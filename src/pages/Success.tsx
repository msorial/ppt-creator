import {
  Flex,
  Text,
  Title,
  Button,
  ThemeIcon,
  Group,
  Divider,
} from '@mantine/core';
import { IconCircleCheck, IconHome } from '@tabler/icons-react';
import useDates from '../store/useDates';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const { selectedCopticDates, apiDate } = useDates();
  const dateObject = apiDate
    ? moment(`${apiDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
    : undefined;
  let formattedDate = '';

  if (dateObject) {
    formattedDate = moment(apiDate).format('MM/DD/YYYY');
  }

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

      <Button
        variant='outline'
        leftIcon={<IconHome size={16} stroke={1.5} />}
        color='dark'
        sx={{ padding: '0px 40px', marginTop: '25px' }}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
    </Flex>
  );
};

export default Success;
