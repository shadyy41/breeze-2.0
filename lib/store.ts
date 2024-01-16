import { Playlist, Song } from '@/types/types';
import { create } from 'zustand';

export type CurrentSong = Song & { playlist_id: string };

type PlayerQueue = {
  songs: CurrentSong[];
  playlist: (Playlist & { idx: number }) | null;
  repeat: boolean;
  shuffle: boolean;
};

type State = {
  queue: PlayerQueue;
  current_song: CurrentSong | null;
  playing: boolean;
  audio: HTMLAudioElement | null;
  sidebar_expanded: boolean;
};

type Action = {
  play_song: (song: CurrentSong) => void;
  play_playlist: (playlist: Playlist, idx: number) => void;
  play_from_queue: (song: CurrentSong, idx: number) => void;
  push_song: (song: CurrentSong) => void;
  next: () => void;
  setPlaying: (value: boolean) => void;
  setAudio: (a: HTMLAudioElement) => void;
  toggleRepeat: () => void;
  toggle_sidebar: () => void;
  cascade_song_remove: (song_id: string, playlist_id: string)=>void;
};

const usePlayerStore = create<State & Action>()((set) => ({
  queue: {
    songs: [],
    playlist: null,
    repeat: false,
    shuffle: false,
  },
  playing: false,
  current_song: null,
  audio: null,
  sidebar_expanded: true,
  play_song: (song) =>
    set((state) => ({
      current_song: song,
    })),
  play_playlist: (playlist, idx) =>
    set((state) => ({
      current_song: { ...playlist.songs[idx], playlist_id: playlist.id },
      queue: {
        ...state.queue,
        songs: [],
        playlist: { ...playlist, idx: idx + 1 },
      },
    })),
  push_song: (song) =>
    set((state) => {
      if (!state.current_song) return { current_song: song };
      return { queue: { ...state.queue, songs: [...state.queue.songs, song] } };
    }),
  next: () =>
    set((state) => {
      const { songs, playlist } = state.queue;

      if (songs.length) {
        return {
          current_song: songs[0],
          queue: { ...state.queue, songs: [...songs.slice(1)] },
        };
      }
      if (playlist) {
        return {
          current_song: {
            ...playlist.songs[playlist.idx],
            playlist_id: playlist.id,
          },
          queue: {
            ...state.queue,
            playlist: {
              ...playlist,
              idx: (playlist.idx + 1) % playlist.songs.length,
            },
          },
        };
      }
      return {};
    }),
  setPlaying: (value) => set(() => ({ playing: value })),
  setAudio: (a) => set(() => ({ audio: a })),
  toggleRepeat: () =>
    set((state) => ({
      queue: { ...state.queue, repeat: !state.queue.repeat },
    })),
  play_from_queue: (song, idx) =>
    set((state) => {
      return {
        current_song: song,
        queue: {
          ...state.queue,
          songs: [
            ...state.queue.songs.slice(0, idx),
            ...state.queue.songs.slice(idx + 1),
          ],
        },
      };
    }),
  toggle_sidebar: () =>
    set((state) => ({ sidebar_expanded: !state.sidebar_expanded })),
  cascade_song_remove: (song_id, playlist_id) =>
    set((state)=>{
      if(playlist_id===state.queue.playlist?.id){
        return { queue: {...state.queue, playlist: {...state.queue.playlist, songs: [...state.queue.playlist.songs.filter((song)=>song.id!==song_id)]}, songs: [...state.queue.songs.filter((song)=>song.id!==song_id)]} }
      }
      return { queue: {...state.queue, songs: [...state.queue.songs.filter((song)=>song.id!==song_id)] }}
    })
}));

export default usePlayerStore;
