import { ActionIcon, Tooltip } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

const JumpButton = () => {
  return (
    <Tooltip label='Jump' position='bottom' withArrow>
      <ActionIcon color='blue' variant='light'>
        <IconDotsVertical size={16} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
};

export default JumpButton;
