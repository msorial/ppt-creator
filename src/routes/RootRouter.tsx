import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { Navigate, Route, Routes } from 'react-router-dom';
import useDates from '../store/useDates';

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
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <Vespers />
            </Suspense>
          )
        }
      />
      <Route
        path='matins'
        element={
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <Matins />
            </Suspense>
          )
        }
      />
      <Route
        path='offering'
        element={
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <Offering />
            </Suspense>
          )
        }
      />
      <Route
        path='liturgyofWord'
        element={
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <WordLiturgy />
            </Suspense>
          )
        }
      />
      <Route
        path='liturgyofFaithful'
        element={
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <FaithfulLiturgy />
            </Suspense>
          )
        }
      />
      <Route
        path='communion'
        element={
          apiDate === null || '' ? (
            <Navigate to='/' />
          ) : (
            <Suspense fallback={Loading}>
              <Communion />
            </Suspense>
          )
        }
      />
    </Routes>
  );
};

export default RootRouter;
