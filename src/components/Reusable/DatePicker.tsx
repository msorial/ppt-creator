import { DatePickerInput } from '@mantine/dates';
import useDates from '../../store/useDates';
import { IconCalendarBolt } from '@tabler/icons-react';

const DatePicker = () => {
  const { selectedDate, setSelectedDate, setApiDate } = useDates();

  return (
    <DatePickerInput
      icon={<IconCalendarBolt size={18} stroke={1.5} />}
      placeholder='Select Date'
      label='Choose a Date to Generate PowerPoint'
      firstDayOfWeek={0}
      size='sm'
      value={selectedDate}
      onChange={(value) => {
        setSelectedDate(value);
        if (value) {
          setApiDate(value.toLocaleDateString('en-CA'));
        }
      }}
    />
  );
};

export default DatePicker;
