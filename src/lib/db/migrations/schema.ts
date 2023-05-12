import { mysqlTable, mysqlSchema, AnyMySqlColumn, uniqueIndex, index, foreignKey, varchar, int, text, double, json, datetime, mysqlEnum, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const account = mysqlTable("Account", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	userId: int("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
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

export const file = mysqlTable("File", {
	id: int("id").autoincrement().primaryKey().notNull(),
	path: varchar("path", { length: 191 }).notNull(),
});

export const order = mysqlTable("Order", {
	id: int("id").autoincrement().primaryKey().notNull(),
	price: double("price").notNull(),
	userId: int("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	paymentData: json("paymentData").notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	status: mysqlEnum("status", ['unpaid','pending','return_requested','returned','complete','used','cancelled']).default('UNPAID').notNull(),
	fileId: int("fileId").references(() => file.id, { onDelete: "set null", onUpdate: "cascade" } ),
	venueId: int("venueId").references(() => venue.id, { onDelete: "set null", onUpdate: "cascade" } ),
	ticketCount: int("ticketCount").notNull(),
	isGoodness: tinyint("isGoodness").default(0).notNull(),
	comment: varchar("comment", { length: 1000 }).default('').notNull(),
	notes: varchar("notes", { length: 1000 }).default('').notNull(),
},
(table) => {
	return {
		fileIdKey: uniqueIndex("Order_fileId_key").on(table.fileId),
		userIdFkey: index("Order_userId_fkey").on(table.userId),
		venueIdFkey: index("Order_venueId_fkey").on(table.venueId),
	}
});

export const password = mysqlTable("Password", {
	id: int("id").autoincrement().primaryKey().notNull(),
	userId: int("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	hash: varchar("hash", { length: 191 }).notNull(),
	createdAt: datetime("created_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
},
(table) => {
	return {
		hashKey: uniqueIndex("Password_hash_key").on(table.hash),
		userIdFkey: index("Password_userId_fkey").on(table.userId),
	}
});

export const priceRange = mysqlTable("PriceRange", {
	id: int("id").autoincrement().primaryKey().notNull(),
	price: double("price").notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	venueId: int("venueId").references(() => venue.id, { onDelete: "set null", onUpdate: "cascade" } ),
	color: varchar("color", { length: 191 }),
},
(table) => {
	return {
		venueIdFkey: index("PriceRange_venueId_fkey").on(table.venueId),
	}
});

export const sentTicket = mysqlTable("SentTicket", {
	id: int("id").autoincrement().primaryKey().notNull(),
	sentAt: datetime("sentAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	orderId: int("orderId").notNull().references(() => order.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => {
	return {
		orderIdFkey: index("SentTicket_orderId_fkey").on(table.orderId),
	}
});

export const session = mysqlTable("Session", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
	userId: int("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	expires: datetime("expires", { mode: 'string', fsp: 3 }).notNull(),
},
(table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
		userIdFkey: index("Session_userId_fkey").on(table.userId),
	}
});

export const ticket = mysqlTable("Ticket", {
	id: int("id").autoincrement().primaryKey().notNull(),
	number: varchar("number", { length: 191 }).notNull(),
	orderId: int("orderId").references(() => order.id, { onDelete: "set null", onUpdate: "cascade" } ),
	priceRangeId: int("priceRangeId").references(() => priceRange.id, { onDelete: "set null", onUpdate: "cascade" } ),
	reserved: tinyint("reserved").default(0).notNull(),
	sortNumber: int("sortNumber").default(0).notNull(),
	rowNumber: varchar("rowNumber", { length: 191 }),
	sortRowNumber: int("sortRowNumber").default(0),
	venueId: int("venueId").notNull().references(() => venue.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => {
	return {
		orderIdFkey: index("Ticket_orderId_fkey").on(table.orderId),
		priceRangeIdFkey: index("Ticket_priceRangeId_fkey").on(table.priceRangeId),
		venueIdFkey: index("Ticket_venueId_fkey").on(table.venueId),
	}
});

export const user = mysqlTable("User", {
	id: int("id").autoincrement().primaryKey().notNull(),
	email: varchar("email", { length: 191 }).notNull(),
	name: varchar("name", { length: 191 }),
	nickname: varchar("nickname", { length: 191 }),
	age: int("age"),
	phone: varchar("phone", { length: 191 }),
	social: varchar("social", { length: 191 }),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	role: mysqlEnum("role", ['customer','admin']).default('CUSTOMER').notNull(),
	emailVerified: datetime("emailVerified", { mode: 'string', fsp: 3 }),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_email_key").on(table.email),
	}
});

export const venue = mysqlTable("Venue", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	active: tinyint("active").default(0).notNull(),
	address: varchar("address", { length: 191 }).default('').notNull(),
	start: datetime("start", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	description: varchar("description", { length: 191 }).default('').notNull(),
	ticketCount: int("ticketCount").notNull(),
	noSeats: tinyint("noSeats").default(0).notNull(),
	availableTickets: int("availableTickets").notNull(),
});

export const verificationToken = mysqlTable("VerificationToken", {
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

export const prismaMigrations = mysqlTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: datetime("finished_at", { mode: 'string', fsp: 3 }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: datetime("rolled_back_at", { mode: 'string', fsp: 3 }),
	startedAt: datetime("started_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	appliedStepsCount: int("applied_steps_count").default(0).notNull(),
});