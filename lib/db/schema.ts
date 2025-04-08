import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  pgEnum,
  uuid, 
  primaryKey,
  json,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define TypeScript enums first as the source of truth
export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  BOUNCED = 'bounced',
  FAILED = 'failed'
}

export enum SubscriberStatus {
  ACTIVE = 'active',
  UNSUBSCRIBED = 'unsubscribed',
  BOUNCED = 'bounced'
}

export enum FormType {
  INLINE = 'inline',
  POPUP = 'popup',
  LANDING_PAGE = 'landing_page',
  EMBEDDED = 'embedded'
}

// Create database enums from TypeScript enums
export const emailStatusEnum = pgEnum('email_status', Object.values(EmailStatus) as [string, ...string[]]);
export const subscriberStatusEnum = pgEnum('subscriber_status', Object.values(SubscriberStatus) as [string, ...string[]]);
export const formTypeEnum = pgEnum('form_type', Object.values(FormType) as [string, ...string[]]);

// Form field type definition
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'checkbox';
  required: boolean;
}

// Email metadata type definition
export type EmailMetadata = {
  opens: number;
  clicks: number;
  lastOpenedAt?: Date;
  lastClickedAt?: Date;
  userAgent?: string;
}

// Subscribers table - stores contact information
export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  status: subscriberStatusEnum('status').notNull().default('active'),
  source: varchar('source', { length: 100 }),
  formId: uuid('form_id').references(() => forms.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Email templates
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  content: text('content').notNull(),
  reactComponentName: varchar('react_component_name', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Forms for collecting emails
export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: formTypeEnum('type').notNull(),
  settings: json('settings').$type<{
    fields: FormField[];
    redirectUrl?: string;
    successMessage?: string;
    buttonText: string;
    downloadUrl?: string; // For lead magnet functionality
  }>(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  templateId: uuid('template_id').references(() => templates.id),
});

// Campaigns for sending emails
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  previewText: varchar('preview_text', { length: 255 }),
  fromName: varchar('from_name', { length: 100 }),
  fromEmail: varchar('from_email', { length: 255 }),
  templateId: uuid('template_id').references(() => templates.id),
  content: text('content'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, scheduled, sending, sent
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Email logs for tracking
export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscriberId: uuid('subscriber_id').references(() => subscribers.id, { onDelete: 'set null' }),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
  status: emailStatusEnum('status').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow(),
  messageId: varchar('message_id', { length: 255 }),
  error: text('error'),
  metadata: json('metadata').$type<EmailMetadata>().default({ opens: 0, clicks: 0 }),
});

// Tags table (simplified)
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Junction table for subscribers and tags - fixed deprecated syntax
export const subscribersTags = pgTable('subscribers_tags', {
  subscriberId: uuid('subscriber_id').notNull().references(() => subscribers.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.subscriberId, t.tagId] })
]);

// Relations
export const subscribersRelations = relations(subscribers, ({ many, one }) => ({
  subscribersTags: many(subscribersTags),
  form: one(forms, {
    fields: [subscribers.formId],
    references: [forms.id],
  }),
  emailLogs: many(emailLogs),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  subscribersTags: many(subscribersTags),
}));

export const subscribersTagsRelations = relations(subscribersTags, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [subscribersTags.subscriberId],
    references: [subscribers.id],
  }),
  tag: one(tags, {
    fields: [subscribersTags.tagId],
    references: [tags.id],
  }),
}));

export const formsRelations = relations(forms, ({ many, one }) => ({
  subscribers: many(subscribers),
  template: one(templates, {
    fields: [forms.templateId],
    references: [templates.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  template: one(templates, {
    fields: [campaigns.templateId],
    references: [templates.id],
  }),
  emailLogs: many(emailLogs),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [emailLogs.subscriberId],
    references: [subscribers.id],
  }),
  campaign: one(campaigns, {
    fields: [emailLogs.campaignId],
    references: [campaigns.id],
  }),
}));