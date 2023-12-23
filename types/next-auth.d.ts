import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      name: string;
      image: string;
      id: string;
    } & DefaultSession['user'];
  }
}
