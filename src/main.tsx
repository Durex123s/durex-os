import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Capacitor } from '@capacitor/core';
import { router } from './router';
import { ThemeProvider } from './components/ThemeProvider';
import { AppLockGate } from './components/security/AppLockGate';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Onboarding } from './components/Onboarding';
import { PageLoader } from './components/PageLoader';
import './index.css';

const GlobalInteractions = lazy(() =>
  import('./components/GlobalInteractions').then(m => ({
    default: m.GlobalInteractions,
  }))
);

const UpdateBanner = lazy(() =>
  import('./components/UpdateBanner').then(m => ({
    default: m.UpdateBanner,
  }))
);

if (!Capacitor.isNativePlatform()) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    import('./hooks/useAppUpdate').then(({ useAppUpdate }) => {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          useAppUpdate
            .getState()
            .setUpdateAvailable(() => updateSW(true));
        },
      });
    });
  });
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });

  if ('caches' in window) {
    caches.keys().then((keys) =>
      keys.forEach((key) => caches.delete(key))
    );
  }
}

import('./services/notifications').then(({ initNotifications, resyncAllReminders }) => {
  initNotifications();
  resyncAllReminders();
});

import('./services/updateCheck').then(({ checkForUpdate }) => {
  checkForUpdate();
});

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoader />}>
          <GlobalInteractions />
          <UpdateBanner />

          <AppLockGate>
            <WelcomeScreen>
              <Onboarding>
                <RouterProvider router={router} />
              </Onboarding>
            </WelcomeScreen>
          </AppLockGate>

        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
