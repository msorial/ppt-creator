import { ActionIcon } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import useUi from '../../store/useUi';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useUi();

  return (
    <ActionIcon
      title='Toggle Theme'
      onClick={toggleTheme}
      sx={(theme) => ({
        backgroundColor: darkMode ? theme.colors.dark[6] : theme.colors.gray[0],
        color: darkMode ? theme.colors.yellow[4] : theme.colors.blue[6],
      })}
    >
      {darkMode ? (
        <IconSun size={16} stroke={1.5} />
      ) : (
        <IconMoonStars size={16} stroke={1.5} />
      )}
    </ActionIcon>
  );
};

export default ThemeToggle;
