import { DateValue } from '@mantine/dates';
import useDates from '../../store/useDates';
import { Text } from '@mantine/core';

const ReadableDate = () => {
  const { apiDate } = useDates();
  const dateObject: DateValue | undefined = apiDate
    ? new Date(`${apiDate} 00:00:00 GMT-0400 (Eastern Daylight Time)`)
    : undefined;
  let formattedDate = '';

  if (dateObject) {
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = String(dateObject.getFullYear());
    formattedDate = `${month}/${day}/${year}`;
  }

  return (
    <Text align='right' fs='italic'>
      {formattedDate}
    </Text>
  );
};

export default ReadableDate;
