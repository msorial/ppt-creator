import { DatePickerInput, DateValue } from '@mantine/dates';
import useDates from '../../store/useDates';
import { IconCalendarBolt } from '@tabler/icons-react';
import { useSearchParamsState } from '../../lib/hooks/useSearchParams';

const DatePicker = () => {
  const { apiDate, setApiDate } = useDates();
  const [searchParamState, setSearchParamState] = useSearchParamsState(
    'date',
    ''
  );

  const dateObject: DateValue | undefined = apiDate
    ? new Date(`${apiDate} 00:00:00 GMT-0400 (Eastern Daylight Time)`)
    : undefined;
  const searchDateObject: DateValue | undefined = searchParamState
    ? new Date(`${searchParamState} 00:00:00 GMT-0400 (Eastern Daylight Time)`)
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
      value={searchDateObject ? searchDateObject : dateObject}
      onChange={(value: Date) => {
        const year = value.getUTCFullYear();
        const month = String(value.getUTCMonth() + 1).padStart(2, '0');
        const day = String(value.getUTCDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        setApiDate(formattedDate);
        handleParamChange(formattedDate);
      }}
    />
  );
};

export default DatePicker;
