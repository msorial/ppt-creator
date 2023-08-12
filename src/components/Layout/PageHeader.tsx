import { Burger, Flex, Group, Header, useMantineTheme } from '@mantine/core';

import ThemeToggle from '../Reusable/ThemeToggle';
import RestartButton from '../Reusable/RestartButton';
import { useMediaQuery } from '@mantine/hooks';

const PageHeader = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Header
      height={{ base: 75 }}
      p={!isMobile ? 'lg' : 'xl'}
      sx={{
        backgroundColor: !isMobile ? 'transparent' : '',
        borderBottom: !isMobile ? 'none' : '',
      }}
    >
      <Flex
        gap='xl'
        justify='space-between'
        align='end'
        direction='row'
        wrap='nowrap'
      >
        {isMobile && <Burger opened={false} size='sm' />}

        <Group>
          <ThemeToggle />
          <RestartButton />
        </Group>
      </Flex>
    </Header>
  );
};

export default PageHeader;
