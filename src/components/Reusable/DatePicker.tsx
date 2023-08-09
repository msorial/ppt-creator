import { DatePickerInput } from '@mantine/dates';
import useDates from '../../store/useDates';

const DatePicker = () => {
  const { selectedDate, setSelectedDate } = useDates();

  return (
    <DatePickerInput
      placeholder='Select Date'
      label='Choose a Date to Generate PowerPoint'
      firstDayOfWeek={0}
      size='sm'
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
};

export default DatePicker;
