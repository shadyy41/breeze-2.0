'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

export const GreetingSkeleton = () => {
  return <Skeleton className='h-8 w-1/2' />;
};

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <GreetingSkeleton />;
  }

  return <h2 className='text-2xl font-medium'>{greeting}</h2>;
};

export default Greeting;
