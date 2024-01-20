'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Song } from '@/types/types';
import { search } from '../actions';
import { toast } from 'react-hot-toast';
import SongCard from '@/components/song-card';

const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchTerm.length || loading) return;
    try {
      setLoading(true);
      const res = await search(searchTerm);
      setResults(res);
    } catch (error) {
      toast.error('An error ocurred while searching');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))]'>
      <div className='flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
        <h2 className='text-2xl font-medium'>Search</h2>
        <div className='flex w-full max-w-xl items-center justify-center gap-2'>
          <Input
            type='string'
            placeholder='type here...'
            className=''
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant={'outline'}
            className={`text-xl ${loading ? 'cursor-wait' : ''}`}
            onClick={handleSearch}
            disabled={loading}
          >
            {' '}
            <PiMagnifyingGlassBold />{' '}
          </Button>
        </div>
        <div className='grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5'>
          {results.map((song, idx) => (
            <SongCard song={song} key={song.id} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Page;
