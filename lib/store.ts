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
  prev: () => void;
  setPlaying: (value: boolean) => void;
  setAudio: (a: HTMLAudioElement) => void;
  toggleRepeat: () => void;
  toggle_sidebar: () => void;
  cascade_song_remove: (song_id: string, playlist_id: string) => void;
  cascade_song_add: (song: Song, playlist_id: string) => void;
  cascade_song_delete: (song_id: string) => void;
  cascade_playlist_delete: (playlist_id: string) => void;
  toggleShuffle: () => void;
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
        if (state.queue.shuffle) {
          const song_count = playlist.songs.length;
          const prev_idx = (playlist.idx - 1 + song_count) % song_count;
          let random_idx: number;

          do {
            random_idx = Math.floor(Math.random() * song_count);
          } while (random_idx === prev_idx);

          return {
            current_song: {
              ...playlist.songs[random_idx],
              playlist_id: playlist.id,
            },
            queue: {
              ...state.queue,
              playlist: {
                ...playlist,
                idx: (random_idx + 1) % playlist.songs.length,
              },
            },
          };
        }
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
    /* if the song removed has an index<playlist.idx, idx-1 else idx = idx */
    set((state) => {
      if (playlist_id === state.queue.playlist?.id) {
        let d = 0;
        const { playlist } = state.queue;
        const playlist_songs = [
          ...playlist.songs.filter((song, i) => {
            if (song.id === song_id) {
              if (i < playlist.idx) d = 1;
              return false;
            }
            return true;
          }),
        ];
        return {
          queue: {
            ...state.queue,
            playlist: {
              ...playlist,
              idx: playlist.idx - d,
              songs: playlist_songs,
            },
            songs: [...state.queue.songs.filter((song) => song.id !== song_id)],
          },
        };
      }
      return {
        queue: {
          ...state.queue,
          songs: [...state.queue.songs.filter((song) => song.id !== song_id)],
        },
      };
    }),
  cascade_song_add: (song, playlist_id) =>
    set((state) => {
      if (playlist_id === state.queue.playlist?.id) {
        return {
          queue: {
            ...state.queue,
            playlist: {
              ...state.queue.playlist,
              songs: [...state.queue.playlist.songs, song],
            },
          },
        };
      }
      return {};
    }),
  cascade_song_delete: (song_id) =>
    set((state) => {
      let d = 0;
      const { playlist } = state.queue;
      const playlist_songs = playlist
        ? [
            ...playlist.songs.filter((song, i) => {
              if (song.id === song_id) {
                if (i < playlist.idx) d = 1;
                return false;
              }
              return true;
            }),
          ]
        : [];

      const new_playlist = playlist
        ? { ...playlist, idx: playlist.idx - d, songs: playlist_songs }
        : null;
      const new_queue_songs = [
        ...state.queue.songs.filter((song) => song.id !== song_id),
      ];

      return {
        queue: {
          ...state.queue,
          songs: new_queue_songs,
          playlist: new_playlist,
        },
      };
    }),
  cascade_playlist_delete: (playlist_id) =>
    set((state) => {
      if (playlist_id === state.queue.playlist?.id) {
        return { queue: { ...state.queue, playlist: null } };
      }
      return {};
    }),
  prev: () =>
    set((state) => {
      if (state.queue.playlist) {
        const { playlist } = state.queue;
        const prev_idx =
          (playlist.idx - 1 - 1 + playlist.songs.length) %
          playlist.songs.length;
        const new_idx =
          (playlist.idx - 1 + playlist.songs.length) % playlist.songs.length;

        return {
          current_song: {
            ...playlist.songs[prev_idx],
            playlist_id: playlist.id,
          },
          queue: { ...state.queue, playlist: { ...playlist, idx: new_idx } },
        };
      } else return {};
    }),
  toggleShuffle: () =>
    set((state) => ({
      queue: { ...state.queue, shuffle: !state.queue.shuffle },
    })),
}));

export default usePlayerStore;
