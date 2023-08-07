import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));
const Vespers = lazy(() => import('../pages/Vespers'));
const Matins = lazy(() => import('../pages/Matins'));
const Offering = lazy(() => import('../pages/Offering'));
const WordLiturgy = lazy(() => import('../pages/WordLiturgy'));
const FaithfulLityrgy = lazy(() => import('../pages/FaithfulLiturgy'));
const Communion = lazy(() => import('../pages/Communion'));

const RootRouter = () => {
  const Loading = (
    <Center sx={{ height: '100%', width: '100%' }}>
      <Loader color='blue' variant='oval' />
    </Center>
  );

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={Loading}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path='vespers'
        element={
          <Suspense fallback={Loading}>
            <Vespers />
          </Suspense>
        }
      />
      <Route
        path='matins'
        element={
          <Suspense fallback={Loading}>
            <Matins />
          </Suspense>
        }
      />
      <Route
        path='offering'
        element={
          <Suspense fallback={Loading}>
            <Offering />
          </Suspense>
        }
      />
      <Route
        path='liturgyofWord'
        element={
          <Suspense fallback={Loading}>
            <WordLiturgy />
          </Suspense>
        }
      />
      <Route
        path='liturgyofFaithful'
        element={
          <Suspense fallback={Loading}>
            <FaithfulLityrgy />
          </Suspense>
        }
      />
      <Route
        path='communion'
        element={
          <Suspense fallback={Loading}>
            <Communion />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default RootRouter;
