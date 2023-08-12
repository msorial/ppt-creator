import {
  AppShell,
  Container,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import RootRouter from './routes/RootRouter';
import { Notifications } from '@mantine/notifications';
import PageHeader from './components/Layout/PageHeader';
import useUi from './store/useUi';
import { useSearchParamsState } from './lib/hooks/useSearchParams';
import useDates from './store/useDates';
import { useEffect } from 'react';

function App() {
  const theme = useMantineTheme();
  const { darkMode } = useUi();

  const { setApiDate, apiDate } = useDates();
  const [searchParamState, setSearchParamState] = useSearchParamsState(
    'date',
    ''
  );

  useEffect(() => {
    if (apiDate !== undefined && searchParamState === '') {
      setSearchParamState(apiDate);
    } else if (apiDate === undefined && searchParamState !== '') {
      setApiDate(searchParamState);
    }
  }, [searchParamState]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: darkMode ? 'dark' : 'light',
      }}
    >
      <AppShell
        sx={{
          main: {
            backgroundColor: darkMode
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
          },
        }}
        header={<PageHeader />}
      >
        <Container size='sm' sx={{ height: '100%' }}>
          <RootRouter />
          <Notifications position='bottom-center' limit={1} />
        </Container>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
