import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
