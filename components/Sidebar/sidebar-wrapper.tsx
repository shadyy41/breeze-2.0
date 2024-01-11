import React from 'react';
import Sidebar from './sidebar';
import { auth } from '@/lib/auth';
import { Providers } from '../providers';
import { getUploadedSongs, getUserPlaylists } from '@/app/actions';

const SidebarWrapper = async () => {
  const session = await auth();

  const uploads = await getUploadedSongs();
  const playlists = await getUserPlaylists();

  return (
    <Providers session={session}>
      <Sidebar playlists={playlists} uploads={uploads} key={playlists.length} />
    </Providers>
  );
};

export default SidebarWrapper;
