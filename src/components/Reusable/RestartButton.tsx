import { ActionIcon, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import useUi from '../../store/useUi';
import { useNavigate } from 'react-router-dom';
import useDates from '../../store/useDates';

const RestartButton: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useUi();
  const { setApiDate } = useDates();

  return (
    <Tooltip label='Restart' position='bottom' withArrow>
      <ActionIcon
        variant='light'
        color='dark'
        sx={(theme) => ({
          backgroundColor: darkMode
            ? theme.colors.gray[3]
            : theme.colors.dark[4],
          color: darkMode ? theme.colors.dark[4] : theme.colors.gray[3],
          '&:hover': {
            backgroundColor: darkMode
              ? theme.colors.gray[0]
              : theme.colors.dark[3],
          },
        })}
        onClick={() => {
          navigate('/');
          setApiDate(undefined);
        }}
      >
        <IconRefresh size={16} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
};

export default RestartButton;
