'use server';
import { auth } from '@/lib/auth';
import sql from '@/lib/db';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { ActionResponse, Playlist, Song } from '@/types/types';
import { redirect } from 'next/navigation';

export async function createSong(song: {
  name: string;
  song_path: string;
  thumb_path: string;
  private: boolean;
}): Promise<boolean> {
  const session = await auth();
  if (!session || (!session.user.admin && session.user.upload_count >= 4))
    return false;

  try {
    await sql.begin(async (sql) => {
      await sql`
      insert into next_auth.songs (song_path, thumb_path, name, private, user_id) values (${song.song_path}, ${song.thumb_path}, ${song.name}, ${song.private}, ${session.user.id})
      `;
      await sql`
      update next_auth.users set upload_count = upload_count + 1 where id = ${session.user.id}
      `;
    });
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Transaction failed:', error);
    await sql`ROLLBACK`;
    return false;
  }
}

export async function createPlaylist(playlistName: string): Promise<boolean> {
  const session = await auth();
  if (!session) return false;

  try {
    await sql`
    insert into next_auth.playlists (user_id, name) values (${session.user.id}, ${playlistName})
    `;
    revalidatePath('/library');
    return true;
  } catch (e) {
    console.log(e, 'ERROR WHILE CREATING PLAYLIST IN PSQL.');
    return false;
  }
}

export async function addToPlaylist(
  playlist_id: string,
  song_id: string
): Promise<boolean> {
  try {
    await sql`
    INSERT INTO next_auth.playlist_songs (playlist_id, song_id)
    VALUES
      (${playlist_id}, ${song_id});
    `;

    revalidatePath('/');
    return true;
  } catch (error) {
    console.log(error, 'ERROR ADDING SONG TO PLAYLIST');
    return false;
  }
}

export async function deleteSong(songId: string): Promise<boolean> {
  try {
    const session = await auth();

    if (!session) return false;

    const { supabaseAccessToken } = session;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        },
      }
    );

    await sql.begin(async (sql) => {
      const data = await sql`
      select song_path, thumb_path from next_auth.songs where id = ${songId}
      `;

      await sql`
      DELETE FROM next_auth.songs
      WHERE id = ${songId};
      `;
      await sql`
      update next_auth.users set upload_count = upload_count - 1 where id = ${session.user.id}
      `;

      await supabase.storage
        .from('songs')
        .remove([data[0].song_path, data[0].thumb_path]);
    });

    revalidatePath('/');
    return true;
  } catch (error) {
    console.log(error, 'ERROR DELETING SONG');
    await sql`ROLLBACK`;
    return false;
  }
}

export async function removeSong(playlist_id: string, song_id: string) {
  try {
    const session = await auth();

    if (!session) return false;

    await sql`
      DELETE FROM next_auth.playlist_songs
      WHERE playlist_id = ${playlist_id} and song_id=${song_id};
      `;

    revalidatePath('/');
    return true;
  } catch (error) {
    console.log(error, 'ERROR DELETING SONG');
    return false;
  }
}

export async function deletePlaylist(id: string) {
  try {
    const session = await auth();

    if (!session) return false;

    await sql`
      DELETE FROM next_auth.playlists
      WHERE id = ${id};
      `;

    revalidatePath('/');
    return true;
  } catch (error) {
    console.log(error, 'ERROR DELETING SONG');
    return false;
  }
}

export async function getUserPlaylists(): Promise<Playlist[]> {
  const session = await auth();
  if (!session) return [];

  const { supabaseAccessToken } = session;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

  try {
    const data = await sql`
    SELECT
        playlists.id,
        playlists.name,
        ARRAY_AGG(
            jsonb_build_object(
                'id', songs.id,
                'name', songs.name,
                'thumb_path', songs.thumb_path,
                'song_path', songs.song_path
            )
        ) AS songs
    FROM
        next_auth.playlists playlists
    LEFT JOIN
        next_auth.playlist_songs playlist_songs ON playlists.id = playlist_songs.playlist_id
    LEFT JOIN
        next_auth.songs songs ON playlist_songs.song_id = songs.id
    WHERE
        playlists.user_id = ${session.user.id}
    GROUP BY
        playlists.id, playlists.name;
    `;

    const res: Playlist[] = [];

    for (const p of data) {
      const playlist: {
        name: string;
        id: string;
        songs: Song[];
      } = { name: p.name, id: p.id, songs: [] };

      for (const s of p.songs) {
        const { signedSongUrl, signedThumbUrl } = await generateSignedUrls(
          s.song_path,
          s.thumb_path,
          supabase
        );

        const { data: thumb_data, error: thumb_error } = signedThumbUrl;
        const { data: song_data, error: song_error } = signedSongUrl;

        if (thumb_data && song_data) {
          playlist.songs.push({
            ...s,
            date_added: formatDate(s.date_added),
            song_path: song_data.signedUrl,
            thumb_path: thumb_data.signedUrl,
          });
        }
      }

      res.push({ ...playlist });
    }

    return res;
  } catch (e) {
    console.log(e, 'Error fetching playlist data');
    return [];
  }
}

export async function getUploadedSongs(): Promise<ActionResponse<Playlist>> {
  try {
    const session = await auth();

    if (!session) return null;

    const { supabaseAccessToken } = session;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        },
      }
    );

    const data = await sql`
      SELECT id, name, song_path, thumb_path, created_at
      FROM next_auth.songs
      WHERE user_id = ${session.user.id}
    `;

    const songs: Song[] = [];

    for (const s of data) {
      const { signedSongUrl, signedThumbUrl } = await generateSignedUrls(
        s.song_path,
        s.thumb_path,
        supabase
      );

      const { data: thumb_data, error: thumb_error } = signedThumbUrl;
      const { data: song_data, error: song_error } = signedSongUrl;

      if (thumb_data && song_data) {
        songs.push({
          id: s.id,
          created_at: formatDate(s.created_at),
          name: s.name,
          song_path: song_data.signedUrl,
          thumb_path: thumb_data.signedUrl,
          private: true,
        });
      }
    }

    return { songs: songs, id: 'uploaded_songs', name: 'Uploaded Songs' };
  } catch (error) {
    console.error('Error fetching songs:', error);
    return null;
  }
}

export async function getPlaylist(
  id: string
): Promise<ActionResponse<Playlist>> {
  const session = await auth();

  if (!session) return null;

  const { supabaseAccessToken } = session;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

  try {
    const data = await sql`
    SELECT
      p.id AS id,
      p.name AS name,
      p.user_id AS user_id,
      ARRAY_AGG(
        json_build_object(
          'id', s.id,
          'name', s.name,
          'thumb_path', s.thumb_path,
          'song_path', s.song_path,
          'date_added', ps.date_added
        )
      ) AS songs
    FROM
      next_auth.playlists p
    LEFT JOIN
      next_auth.playlist_songs ps ON p.id = ps.playlist_id
    LEFT JOIN
      next_auth.songs s ON ps.song_id = s.id
    WHERE
      p.id = ${id}
    GROUP BY
      p.id;
    `;

    if (!data.length || data[0].user_id !== session.user.id) return null;

    const songs: Song[] = [];

    for (const s of data[0].songs) {
      const { signedSongUrl, signedThumbUrl } = await generateSignedUrls(
        s.song_path,
        s.thumb_path,
        supabase
      );

      const { data: thumb_data, error: thumb_error } = signedThumbUrl;
      const { data: song_data, error: song_error } = signedSongUrl;

      if (thumb_data && song_data) {
        songs.push({
          id: s.id,
          created_at: s.created_at,
          date_added: formatDate(s.date_added),
          name: s.name,
          song_path: song_data.signedUrl,
          thumb_path: thumb_data.signedUrl,
          private: true,
        });
      }
    }

    const res: Playlist = { id: data[0].id, name: data[0].name, songs: songs };
    return res;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return null;
  }
}

async function generateSignedUrls(
  songPath: string,
  thumbPath: string,
  supabase: SupabaseClient
) {
  const signedSongUrl = await supabase.storage
    .from('songs')
    .createSignedUrl(songPath, 360000);

  const signedThumbUrl = await supabase.storage
    .from('songs')
    .createSignedUrl(thumbPath, 360000);

  return { signedSongUrl, signedThumbUrl };
}

function formatDate(timestampString: string): string {
  const timestamp: Date = new Date(timestampString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return timestamp.toLocaleDateString('en-GB', options);
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
