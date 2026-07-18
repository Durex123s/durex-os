import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { AppAvatar } from '@/components/avatar/AppAvatar';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { getAvatarContext } from '@/components/avatar/avatarContextConfig';

export function MainLayout() {
  const location = useLocation();
  const avatarContext = getAvatarContext(location.pathname);

  return (
    <div className="flex min-h-screen">
      <OfflineIndicator />

      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center justify-end gap-2 mb-2">
          <GlobalSearch />
          <AppAvatar context={avatarContext} />
        </div>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
