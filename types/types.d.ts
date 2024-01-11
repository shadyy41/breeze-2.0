export type Song = {
  id: string;
  created_at: string;
  song_path: string;
  thumb_path: string;
  name: string;
  private: boolean;
  date_added?: string;
};

export type Playlist = {
  id: string;
  name: string;
  songs: Song[];
};

export type ActionResponse<T> = T | null;
