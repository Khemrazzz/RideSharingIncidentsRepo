import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Incidents = lazy(() => import('../pages/Incidents'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },

    {
        path: '/Home',
        element: <Index />,
        layout: 'default',
    },

    {
        path: '/Incidents',
        element: <Incidents />,
    },

];

export { routes };
