import {
  AppShell,
  Container,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import RootRouter from './routes/RootRouter';
import { Notifications } from '@mantine/notifications';
import PageHeader from './components/Layout/PageHeader';

function App() {
  const theme = useMantineTheme();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        sx={{
          backgroundColor: theme.colors.gray[1],
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
