import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlEnum, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	pk_id: int("id").autoincrement().primaryKey().notNull(),
	id: varchar("id", { length: 24 }).notNull(),
	email: varchar("email", { length: 191 }).notNull(),
	name: varchar("name", { length: 191 }),
	nickname: varchar("nickname", { length: 191 }),
	age: int("age"),
	phone: varchar("phone", { length: 191 }),
	social: varchar("social", { length: 191 }),
	createdAt: datetime("createdAt", { fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	role: mysqlEnum("role", ['customer','admin']).default('customer').notNull(),
	emailVerified: datetime("emailVerified", { fsp: 3 }),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_email_key").on(table.email),
		cuid: uniqueIndex("cuid").on(table.id)
	}
});

export const accounts = mysqlTable("accounts", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: varchar("type", { length: 191 }).notNull(),
	provider: varchar("provider", { length: 191 }).notNull(),
	providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: int("expires_at"),
	tokenType: varchar("token_type", { length: 191 }),
	scope: varchar("scope", { length: 191 }),
	idToken: text("id_token"),
	sessionState: varchar("session_state", { length: 191 }),
},
(table) => {
	return {
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
		userIdFkey: index("Account_userId_fkey").on(table.userId),
	}
});

export const sessions = mysqlTable("sessions", {
	id: int("id").autoincrement().primaryKey().notNull(),
	sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
	userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	expires: datetime("expires", { fsp: 3 }).notNull(),
},
(table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
		userIdFkey: index("Session_userId_fkey").on(table.userId),
	}
});

export const verificationTokens = mysqlTable("verificationTokens", {
	identifier: varchar("identifier", { length: 191 }).notNull(),
	token: varchar("token", { length: 191 }).primaryKey().notNull(),
	expires: datetime("expires", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
	}
});


