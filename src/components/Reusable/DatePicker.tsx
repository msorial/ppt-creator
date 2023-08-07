import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';

const DatePicker = () => {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <DatePickerInput
      placeholder='Select Date'
      label='Choose a Date to Generate PowerPoint'
      size='sm'
      value={value}
      onChange={setValue}
    />
  );
};

export default DatePicker;
