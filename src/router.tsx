import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { PageLoader } from '@/components/PageLoader';

const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Planning = lazy(() => import('@/pages/Planning').then(m => ({ default: m.Planning })));
const Etudes = lazy(() => import('@/pages/Etudes').then(m => ({ default: m.Etudes })));
const SubjectPage = lazy(() => import('@/pages/SubjectPage').then(m => ({ default: m.SubjectPage })));
const Finances = lazy(() => import('@/pages/Finances').then(m => ({ default: m.Finances })));
const Discipline = lazy(() => import('@/pages/Discipline').then(m => ({ default: m.Discipline })));
const Outils = lazy(() => import('@/pages/Outils').then(m => ({ default: m.Outils })));
const Assistant = lazy(() => import('@/pages/Assistant').then(m => ({ default: m.Assistant })));
const Objectifs = lazy(() => import('@/pages/Objectifs').then(m => ({ default: m.Objectifs })));
const Dev = lazy(() => import('@/pages/Dev').then(m => ({ default: m.Dev })));
const Analytics = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.Analytics })));
const Parametres = lazy(() => import('@/pages/Parametres').then(m => ({ default: m.Parametres })));
const Fichiers = lazy(() => import('@/pages/Fichiers').then(m => ({ default: m.Fichiers })));

function withSuspense(el: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{el}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: 'planning', element: withSuspense(<Planning />) },
      { path: 'etudes', element: withSuspense(<Etudes />) },
      { path: 'etudes/:subjectId', element: withSuspense(<SubjectPage />) },
      { path: 'finances', element: withSuspense(<Finances />) },
      { path: 'discipline', element: withSuspense(<Discipline />) },
      { path: 'outils', element: withSuspense(<Outils />) },
      { path: 'assistant', element: withSuspense(<Assistant />) },
      { path: 'objectifs', element: withSuspense(<Objectifs />) },
      { path: 'dev', element: withSuspense(<Dev />) },
      { path: 'analytics', element: withSuspense(<Analytics />) },
      { path: 'parametres', element: withSuspense(<Parametres />) },
      { path: 'fichiers', element: withSuspense(<Fichiers />) },
    ],
  },
]);
