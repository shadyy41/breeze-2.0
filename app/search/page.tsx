'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Song } from '@/types/types';
import { search } from '../actions';
import { toast } from 'react-hot-toast';
import SongCard, { SongCardSkeleton } from '@/components/song-card';

const Page = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await search(query);
        setResults(res);
      } catch (error) {
        toast.error('An error ocurred while searching');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (query.trim() !== '') {
        fetchResults();
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setLoading(false);
  };

  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))]'>
      <div className='flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
        <h2 className='text-2xl font-medium'>Search</h2>
        <label className='flex w-full max-w-xl items-center gap-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 px-4 text-xl text-zinc-400 ring-offset-zinc-950 transition-colors focus-within:text-zinc-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-zinc-200'>
          <PiMagnifyingGlassBold />
          <Input
            type='string'
            placeholder='type to search...'
            className='rounded-none border-0 focus-visible:ring-0'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className='grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5'>
          {results?.map((song, idx) => <SongCard song={song} key={song.id} />)}
          {results?.length === 0 && loading && (
            <>
              <SongCardSkeleton />
              <SongCardSkeleton />
              <SongCardSkeleton />
            </>
          )}
          {results?.length === 0 && !loading && (
            <>
              <h2 className='text-xl font-medium text-zinc-400'>
                No results found
              </h2>
            </>
          )}
        </div>
        {
          <button
            className={`text-base text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 ${
              results?.length ? 'visible' : 'invisible'
            } w-fit`}
            onClick={handleClear}
          >
            clear results
          </button>
        }
      </div>
    </ScrollArea>
  );
};

export default Page;
