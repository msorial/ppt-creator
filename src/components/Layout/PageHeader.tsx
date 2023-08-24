import {
  ActionIcon,
  Burger,
  Flex,
  Group,
  Header,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';

import ThemeToggle from '../Reusable/ThemeToggle';
import RestartButton from '../Reusable/RestartButton';
import { useMediaQuery } from '@mantine/hooks';
import { IconDotsVertical } from '@tabler/icons-react';
import useUi from '../../store/useUi';
import JumpButton from '../Reusable/JumpButton';

const PageHeader = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { darkMode } = useUi();

  return (
    <Header
      height={{ base: 75 }}
      p={!isMobile ? 'lg' : 'xl'}
      sx={{
        backgroundColor: !isMobile
          ? 'transparent'
          : darkMode
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
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
        <JumpButton />

        <Group spacing='xs'>
          <RestartButton />
          <ThemeToggle />
        </Group>
      </Flex>
    </Header>
  );
};

export default PageHeader;
