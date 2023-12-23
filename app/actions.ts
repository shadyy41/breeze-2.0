'use server';
import { auth } from '@/lib/auth';
import sql from '@/lib/db';
import { SongData } from '@/components/Sidebar/UploadButton';

export async function createSong(songData: SongData): Promise<boolean> {
  const session = await auth();
  try {
    const res = await sql`
    insert into next_auth.songs (song_path, name, user_id, thumb_path) values (${songData.songPath}, ${songData.name}, ${session?.user.id}, ${songData.imagePath})
    `;
    return true;
  } catch (e) {
    console.log(e, 'ERROR WHILE SAVING SONG IN PSQL.');
    return false;
  }
}
