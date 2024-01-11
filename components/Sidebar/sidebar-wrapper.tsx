import React from 'react';
import Sidebar from './sidebar';
import { auth } from '@/lib/auth';
import { Providers } from '../providers';

const SidebarWrapper = async () => {
  const session = await auth();

  return (
    <Providers session={session}>
      <Sidebar />
    </Providers>
  );
};

export default SidebarWrapper;
