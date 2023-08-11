import { Burger, Flex, Group, Header } from '@mantine/core';

import ThemeToggle from '../Reusable/ThemeToggle';
import RestartButton from '../Reusable/RestartButton';

const PageHeader = () => {
  return (
    <Header
      height={{ base: 50, md: 70 }}
      p='lg'
      sx={{
        backgroundColor: 'transparent',
        borderBottom: 'none',
      }}
    >
      <Flex
        gap='xl'
        justify='space-between'
        align='end'
        direction='row'
        wrap='nowrap'
      >
        <Burger opened={false} size='sm' />

        <Group>
          <ThemeToggle />
          <RestartButton />
        </Group>
      </Flex>
    </Header>
  );
};

export default PageHeader;
