import { ActionIcon, Burger, Flex, Header } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = () => {
  const navigate = useNavigate();

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

        <ActionIcon
          variant='light'
          color='dark'
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[1],
            color: theme.colors.blue[6],
          })}
          onClick={() => navigate('/')}
        >
          <IconRefresh size={16} stroke={1.5} />
        </ActionIcon>
      </Flex>
    </Header>
  );
};

export default PageHeader;
