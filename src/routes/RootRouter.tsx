import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import useDates from '../store/useDates';
import DelayedRender from './DelayedRender';

const Home = lazy(() => import('../pages/Home'));
const Vespers = lazy(() => import('../pages/Vespers'));
const Matins = lazy(() => import('../pages/Matins'));
const Offering = lazy(() => import('../pages/Offering'));
const WordLiturgy = lazy(() => import('../pages/WordLiturgy'));
const FaithfulLiturgy = lazy(() => import('../pages/FaithfulLiturgy'));
const Communion = lazy(() => import('../pages/Communion'));

const RootRouter = () => {
  const { apiDate } = useDates();

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
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <Vespers />
            </Suspense>
          </DelayedRender>
        }
      />
      <Route
        path='matins'
        element={
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <Matins />
            </Suspense>
          </DelayedRender>
        }
      />
      <Route
        path='offering'
        element={
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <Offering />
            </Suspense>
          </DelayedRender>
        }
      />
      <Route
        path='liturgyofWord'
        element={
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <WordLiturgy />
            </Suspense>
          </DelayedRender>
        }
      />
      <Route
        path='liturgyofFaithful'
        element={
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <FaithfulLiturgy />
            </Suspense>
          </DelayedRender>
        }
      />
      <Route
        path='communion'
        element={
          <DelayedRender condition={apiDate === undefined}>
            <Suspense fallback={Loading}>
              <Communion />
            </Suspense>
          </DelayedRender>
        }
      />
    </Routes>
  );
};

export default RootRouter;
