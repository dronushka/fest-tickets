import { drizzle } from "drizzle-orm/mysql2"
import NextAuth, { AuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { db } from "~/lib/db/db"
import { DrizzleAdapter } from "~/lib/db/next-auth-drizzle-adapter"
import { sendVerificationRequest } from "~/lib/mail"

export const authOptions: AuthOptions = {
  session: {
    strategy: "database",
  },
  adapter: DrizzleAdapter(db),
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      sendVerificationRequest,
    }),
    //   GithubProvider({
    //     clientId: process.env.GITHUB_ID,
    //     clientSecret: process.env.GITHUB_SECRET,
    //   }),
    // ...add more providers here
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
