import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import jwt from 'jsonwebtoken';

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  providers: [GoogleProvider],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: 'authenticated',
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      session.user.id = user.id;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
