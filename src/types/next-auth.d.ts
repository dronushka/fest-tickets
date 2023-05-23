import NextAuth, { DefaultSession } from "next-auth"
import { InferModel } from 'drizzle-orm'
import { users } from '~/lib/db/schema/auth'

declare module "next-auth" {

  // type User = Omit<InferModel<typeof users, "select">, pk_id>

  // type AdapterUser = Omit<AdapterUser, id> & {
  //   id: number
  // }
  
  interface Session {
    user: User
  }
  type SessionUser = User
}