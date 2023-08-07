import {
  AppShell,
  Container,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import RootRouter from './routes/RootRouter';

function App() {
  const theme = useMantineTheme();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        sx={{
          backgroundColor: theme.colors.gray[1],
        }}
      >
        <Container size='sm' sx={{ height: '100%' }}>
          <RootRouter />
        </Container>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
