// import { db } from "../db"
import { InferModel, and, eq } from "drizzle-orm"
import { accounts, users, sessions, verificationTokens } from "../schema/auth"
import type { Adapter, AdapterUser } from "next-auth/adapters"
import { MySql2Database } from "drizzle-orm/mysql2"
import { createId } from "@paralleldrive/cuid2"

export function DrizzleAdapter(db: MySql2Database): Adapter {
  return {
    createUser: async (user: Omit<InferModel<typeof users, "insert">, "id">) => {
      const id = createId()

      await db.insert(users).values({ ...user, id })

      return db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => {
          if (!res || !res[0]) throw "created user not found"
          return { ...res[0], pk_id: undefined }
        })
    },
    getUser: (id) => {
      return db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .then((res) =>
          res && res[0] ? { ...res[0], id: String(res[0].id) } : null
        )
    },
    getUserByEmail: (email) => {
      return db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((res) =>
          res && res[0] ? { ...res[0], id: String(res[0].id) } : null
        )
    },
    createSession: async (session) => {
      const [resultSetHeader] = await db
        .insert(sessions)
        .values({ ...session, userId: parseInt(session.userId) })
      return db
        .select()
        .from(sessions)
        .where(eq(sessions.id, resultSetHeader.insertId))
        .then((res) => {
          if (!res || !res[0]) throw "created session not found"
          return { ...res[0], userId: String(res[0].userId) }
        })
    },
    getSessionAndUser: (data) => {
      return db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) =>
          res && res[0]
            ? {
                ...res[0],
                user: {
                  ...res[0].user,
                  id: String(res[0].user.id),
                },
                session: {
                  ...res[0].session,
                  userId: String(res[0].session.userId),
                },
              }
            : null
        )
    },
    updateUser: async (user) => {
      const [resultSetHeader] = await db
        .update(users)
        .set({ ...user, id: parseInt(user.id) })
        .where(eq(users.id, parseInt(user.id)))
      return db
        .select()
        .from(users)
        .where(eq(users.id, resultSetHeader.insertId))
        .then((res) => {
          if (!res || !res[0]) throw "updated user not found"
          return { ...res[0], id: String(res[0].id) }
        })
    },
    updateSession: (data) => {
      return d
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()
    },
    linkAccount: (rawAccount) => {
      const updatedAccount = d
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get()

      const account: ReturnType<Adapter["linkAccount"]> = {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      }

      return account
    },
    getUserByAccount: (account) => {
      return (
        d
          .select({
            id: users.id,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
            name: users.name,
          })
          .from(users)
          .innerJoin(
            accounts,
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider)
            )
          )
          .get() ?? null
      )
    },
    deleteSession: (sessionToken) => {
      return (
        d
          .delete(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .returning()
          .get() ?? null
      )
    },
    createVerificationToken: (token) => {
      return d.insert(verificationTokens).values(token).returning().get()
    },
    useVerificationToken: (token) => {
      try {
        return (
          d
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token)
              )
            )
            .returning()
            .get() ?? null
        )
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: (id) => {
      return d.delete(users).where(eq(users.id, id)).returning().get()
    },
    unlinkAccount: (account) => {
      d.delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run()

      return undefined
    },
  }
}
