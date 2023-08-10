import { Stack, Text } from '@mantine/core';
import { ReactElement } from 'react';

interface FormFieldProps {
  title: string;
  options: ReactElement;
}

const FormField: React.FC<FormFieldProps> = ({ title, options }) => {
  return (
    <Stack align='flex-start' spacing={5}>
      <Text fz='md' fw={500}>
        {title}
      </Text>

      {options}
    </Stack>
  );
};

export default FormField;
