import { DatePickerInput } from '@mantine/dates';
import { IconCalendarBolt } from '@tabler/icons-react';
import moment from 'moment'; // Import Moment.js
import useDates from '../../store/useDates';
import { useSearchParamsState } from '../../lib/hooks/useSearchParams';

const DatePicker = () => {
  const { apiDate, setApiDate } = useDates();
  const [searchParamState, setSearchParamState] = useSearchParamsState(
    'date',
    ''
  );

  const dateObject = apiDate
    ? moment(`${apiDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
    : undefined;
  const searchDateObject = searchParamState
    ? moment(`${searchParamState} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
    : undefined;

  const handleParamChange = (date: string) => {
    setSearchParamState(date);
  };

  return (
    <DatePickerInput
      icon={<IconCalendarBolt size={18} stroke={1.5} />}
      placeholder='Select Date'
      label='Choose a Date to Generate PowerPoint'
      firstDayOfWeek={0}
      size='sm'
      value={
        searchDateObject ? searchDateObject.toDate() : dateObject?.toDate()
      }
      onChange={(value) => {
        const formattedDate = moment(value).format('YYYY-MM-DD');
        setApiDate(formattedDate);
        handleParamChange(formattedDate);
      }}
    />
  );
};

export default DatePicker;
