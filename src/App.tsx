import {
  AppShell,
  Container,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import RootRouter from './routes/RootRouter';
import { useSearchParams } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import PageHeader from './components/Layout/PageHeader';
import useUi from './store/useUi';
import useDates from './store/useDates';
import { useEffect } from 'react';

function App() {
  const theme = useMantineTheme();
  const { darkMode } = useUi();
  const { setApiDate, apiDate } = useDates();

  const [searchParams] = useSearchParams();
  const dateQueryParam: string | null | undefined = searchParams.get('date');
  // Will be null if no ?date given
  // Will be '' if date given but no YYYY-MM-DD given

  useEffect(() => {
    if (dateQueryParam !== null && dateQueryParam !== '') {
      setApiDate(dateQueryParam);
    } else {
      setApiDate(null);
    }
  }, [dateQueryParam]);

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
