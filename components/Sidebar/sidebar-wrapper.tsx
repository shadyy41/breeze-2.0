import React, { useMemo } from 'react';
import Sidebar from './sidebar';
import { auth } from '@/lib/auth';
import { Providers } from '../providers';
import { getCachedUserPlaylists, getCachedUserUploads } from '@/app/actions';

const SidebarWrapper = async () => {
  const session = await auth();

  if (!session)
    return (
      <Providers session={session}>
        <Sidebar playlists={[]} uploads={null} />
      </Providers>
    );

  const uploads = await getCachedUserUploads(session.user.id);
  const playlists = await getCachedUserPlaylists(session.user.id);

  const key: number = (() => {
    let total = 0;

    if (uploads) total += uploads.songs.length + 1;
    playlists?.map((p) => (total += p.songs.length));
    total += playlists.length;

    return total;
  })();

  return (
    <Providers session={session}>
      <Sidebar playlists={playlists} uploads={uploads} key={key} />
    </Providers>
  );
};

export default SidebarWrapper;
