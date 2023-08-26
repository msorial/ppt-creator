import useDates from '../../store/useDates';
import { Text } from '@mantine/core';
import moment from 'moment';

const ReadableDate = () => {
  const { apiDate } = useDates();
  const dateObject = apiDate
    ? moment(`${apiDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
    : undefined;
  let formattedDate = '';

  if (dateObject) {
    formattedDate = moment(apiDate).format('MM/DD/YYYY');
  }

  return (
    <Text align='left' fs='italic'>
      {formattedDate}
    </Text>
  );
};

export default ReadableDate;
