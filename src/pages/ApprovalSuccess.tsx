import { Flex, Title, Button, ThemeIcon } from '@mantine/core';
import { IconCircleCheck, IconRefresh } from '@tabler/icons-react';
import useDates from '../store/useDates';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import useUi from '../store/useUi';

const ApprovalSuccess = () => {
  const navigate = useNavigate();
  const { darkMode } = useUi();
  const { apiDate } = useDates();
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
      <ThemeIcon radius='xl' size='xl' color='blue'>
        <IconCircleCheck />
      </ThemeIcon>
      <Title
        order={2}
        variant='gradient'
        gradient={{ from: '#21a5fd', to: '#0276c4', deg: 45 }}
      >
        Prefrences Saved & Submitted
      </Title>

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

export default ApprovalSuccess;
