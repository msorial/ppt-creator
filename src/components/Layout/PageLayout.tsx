import { ReactElement } from 'react';
import { Flex } from '@mantine/core';

interface PageLayoutProps {
  header: ReactElement;
  form: ReactElement;
  footer?: ReactElement;
}

const PageLayout = ({ header, form, footer }: PageLayoutProps) => {
  return (
    <Flex
      gap='sm'
      justify='center'
      align='center'
      direction='column'
      sx={{ height: '100%' }}
    >
      {header}
      {form}
      {footer}
    </Flex>
  );
};

export default PageLayout;
