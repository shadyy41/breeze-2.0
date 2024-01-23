import React, { useMemo } from 'react';
import Sidebar from './sidebar';
import { auth } from '@/lib/auth';
import { Providers } from '../providers';
import {
  getCachedPlaylistCount,
  getCachedUploadCount,
  getCachedUserPlaylists,
  getCachedUserUploads,
} from '@/app/actions';
import { PLAYLIST_COUNT_LIMIT, UPLOAD_COUNT_LIMIT } from '@/lib/limits';

const SidebarWrapper = async () => {
  const session = await auth();

  if (!session)
    return (
      <Providers session={session}>
        <Sidebar
          playlists={[]}
          uploads={null}
          upload_count={UPLOAD_COUNT_LIMIT}
          playlist_count={PLAYLIST_COUNT_LIMIT}
        />
      </Providers>
    );

  const uploads = await getCachedUserUploads(session.user.id);
  const playlists = await getCachedUserPlaylists(session.user.id);
  const upload_count = await getCachedUploadCount(session.user.id);
  const playlist_count = await getCachedPlaylistCount(session.user.id);

  const key: string = (() => {
    let total = 0;
    let string_key = ''

    if (uploads) total += uploads.songs.length + 1;
    playlists?.map((p) => {
      total += p.songs.length
      string_key += p.name
    });

    total += playlists.length;

    return total + ' $ ' + string_key;
  })();

  return (
    <Providers session={session}>
      <Sidebar
        playlists={playlists}
        uploads={uploads}
        key={key}
        upload_count={upload_count}
        playlist_count={playlist_count}
      />
    </Providers>
  );
};

export default SidebarWrapper;
