import NextAuth, { DefaultSession } from "next-auth"
import { InferModel } from 'drizzle-orm'
import { users } from '~/lib/db/schema/auth'

declare module "next-auth" {

  type User = InferModel<typeof users, "select"> 

  interface Session {
    user: User
  }
  type SessionUser = User
}