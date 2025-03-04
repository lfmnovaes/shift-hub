import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const companies = sqliteTable('companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const shifts = sqliteTable('shifts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyId: integer('company_id')
    .notNull()
    .references(() => companies.id),
  date: text('date').notNull(),
  hour: text('hour').notNull(),
  position: text('position').notNull(),
  serviceDescription: text('service_description').notNull(),
  payment: text('payment').notNull(),
  requirements: text('requirements'),
  benefits: text('benefits'),
  userId: integer('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usersRelations = relations(users, ({ one }) => ({
  currentShift: one(shifts, {
    fields: [users.id],
    references: [shifts.userId],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  shifts: many(shifts),
}));

export const shiftsRelations = relations(shifts, ({ one }) => ({
  company: one(companies, {
    fields: [shifts.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [shifts.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type Shift = typeof shifts.$inferSelect;
export type NewShift = typeof shifts.$inferInsert;
