/**
 * Database Schema Definition
 * 
 * Defines the complete database structure for Strongwill Sports platform using Drizzle ORM.
 * Includes tables for e-commerce, group ordering, sponsorship marketplace, and user management.
 * 
 * Key Features:
 * - Complete e-commerce functionality (products, orders, cart)
 * - Group ordering system with member management
 * - Sponsorship marketplace connecting teams and sponsors
 * - User authentication and role-based access
 * - Design tool integration for custom apparel
 * - Internationalization support
 * 
 * @see server/db.ts for database connection configuration
 * @see server/storage.ts for data access layer implementation
 */
import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("customer"), // customer, admin, seeker, sponsor
  createdAt: timestamp("created_at").defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => productCategories.id),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  isOnSale: boolean("is_on_sale").default(false),
  imageUrl: text("image_url"),
  sizes: text("sizes").array(),
  colors: text("colors").array(),
  isActive: boolean("is_active").default(true),
});

export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  uniqueId: text("unique_id").notNull().unique(), // For guest access
  name: text("name").notNull(),
  designData: text("design_data").notNull(), // JSON string of design elements
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id), // null for guest designs
  guestEmail: text("guest_email"), // For guest designs
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  designId: integer("design_id").references(() => designs.id),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
  customizations: text("customizations"), // JSON string
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  customerEmail: text("customer_email").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0.00"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"), // card, paypal, etc.
  billingAddress: text("billing_address"), // JSON string with address details
  shippingAddress: text("shipping_address"), // JSON string with address details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  designId: integer("design_id").references(() => designs.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  size: text("size"),
  color: text("color"),
  customizations: text("customizations"),
});

export const groupOrders = pgTable("group_orders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizerUserId: integer("organizer_user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  designId: integer("design_id").references(() => designs.id),
  deadline: timestamp("deadline").notNull(),
  minimumQuantity: integer("minimum_quantity").default(10),
  currentQuantity: integer("current_quantity").default(0),
  status: text("status").default("active"), // active, closed, completed
  orderType: text("order_type").default("product"), // "product" or "custom"
  description: text("description"),
  paymentMode: text("payment_mode").default("individual"), // "organizer" or "individual"
  totalEstimate: decimal("total_estimate", { precision: 10, scale: 2 }).default("0.00"),
  organizerEmail: text("organizer_email"),
  shareableLink: text("shareable_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupOrderItems = pgTable("group_order_items", {
  id: serial("id").primaryKey(),
  groupOrderId: integer("group_order_id").references(() => groupOrders.id),
  userId: integer("user_id").references(() => users.id),
  quantity: integer("quantity").notNull(),
  size: text("size"),
  color: text("color"),
  participantName: text("participant_name").notNull(),
  participantEmail: text("participant_email").notNull(),
  nickname: text("nickname"), // Optional nickname for team member identification
});

export const refunds = pgTable("refunds", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  refundAmount: text("refund_amount").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, processed, failed
  refundMethod: text("refund_method"), // original_payment, bank_transfer, store_credit
  stripeRefundId: text("stripe_refund_id"),
  adminNotes: text("admin_notes"),
  processedBy: integer("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Sponsorship Platform Tables
export const seekerProfiles = pgTable("seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type").notNull(), // school, club, team
  sportType: text("sport_type").notNull(),
  location: text("location"),
  country: text("country"),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone"),
  description: text("description"),
  fundingGoal: decimal("funding_goal", { precision: 10, scale: 2 }),
  website: text("website"),
  logoUrl: text("logo_url"),
  socialMedia: json("social_media"), // { facebook, instagram, twitter }
  isAnonymous: boolean("is_anonymous").default(false),
  shareableToken: text("shareable_token").unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorProfiles = pgTable("sponsor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone"),
  description: text("description"),
  sponsorshipBudget: decimal("sponsorship_budget", { precision: 10, scale: 2 }),
  targetAudience: text("target_audience"),
  logoUrl: text("logo_url"),
  website: text("website"),
  location: text("location"),
  country: text("country"),
  socialMedia: json("social_media"), // { facebook, instagram, twitter }
  preferredSports: text("preferred_sports").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorshipAgreements = pgTable("sponsorship_agreements", {
  id: serial("id").primaryKey(),
  seekerId: integer("seeker_id").references(() => seekerProfiles.id).notNull(),
  sponsorId: integer("sponsor_id").references(() => sponsorProfiles.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // months
  logoUsageRights: text("logo_usage_rights").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, accepted, rejected, active, completed
  proposedBy: text("proposed_by").notNull(), // seeker or sponsor
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sponsorshipCredits = pgTable("sponsorship_credits", {
  id: serial("id").primaryKey(),
  seekerId: integer("seeker_id").references(() => seekerProfiles.id).notNull(),
  agreementId: integer("agreement_id").references(() => sponsorshipAgreements.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorshipMessages = pgTable("sponsorship_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  agreementId: integer("agreement_id").references(() => sponsorshipAgreements.id),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productRecommendations = pgTable("product_recommendations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  recommendedProductId: integer("recommended_product_id").references(() => products.id).notNull(),
  priority: integer("priority").default(1), // Higher number = higher priority
  reason: text("reason"), // "frequently_bought_together", "color_matching", "size_variant", etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").default("website"), // popup, footer, checkout, etc.
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProductCategorySchema = createInsertSchema(productCategories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertDesignSchema = createInsertSchema(designs).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertGroupOrderSchema = createInsertSchema(groupOrders).omit({ id: true, createdAt: true });
export const insertGroupOrderItemSchema = createInsertSchema(groupOrderItems).omit({ id: true });
export const insertRefundSchema = createInsertSchema(refunds).omit({ id: true, createdAt: true, processedAt: true });
export const insertSeekerProfileSchema = createInsertSchema(seekerProfiles).omit({ id: true, createdAt: true });
export const insertSponsorProfileSchema = createInsertSchema(sponsorProfiles).omit({ id: true, createdAt: true });
export const insertSponsorshipAgreementSchema = createInsertSchema(sponsorshipAgreements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSponsorshipCreditSchema = createInsertSchema(sponsorshipCredits).omit({ id: true, createdAt: true });
export const insertSponsorshipMessageSchema = createInsertSchema(sponsorshipMessages).omit({ id: true, createdAt: true });
export const insertProductRecommendationSchema = createInsertSchema(productRecommendations).omit({ id: true, createdAt: true });
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({ id: true, subscribedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Design = typeof designs.$inferSelect;
export type InsertDesign = z.infer<typeof insertDesignSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type GroupOrder = typeof groupOrders.$inferSelect;
export type InsertGroupOrder = z.infer<typeof insertGroupOrderSchema>;
export type GroupOrderItem = typeof groupOrderItems.$inferSelect;
export type InsertGroupOrderItem = z.infer<typeof insertGroupOrderItemSchema>;
export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type SeekerProfile = typeof seekerProfiles.$inferSelect;
export type InsertSeekerProfile = z.infer<typeof insertSeekerProfileSchema>;
export type SponsorProfile = typeof sponsorProfiles.$inferSelect;
export type InsertSponsorProfile = z.infer<typeof insertSponsorProfileSchema>;
export type SponsorshipAgreement = typeof sponsorshipAgreements.$inferSelect;
export type InsertSponsorshipAgreement = z.infer<typeof insertSponsorshipAgreementSchema>;
export type SponsorshipCredit = typeof sponsorshipCredits.$inferSelect;
export type InsertSponsorshipCredit = z.infer<typeof insertSponsorshipCreditSchema>;
export type SponsorshipMessage = typeof sponsorshipMessages.$inferSelect;
export type InsertSponsorshipMessage = z.infer<typeof insertSponsorshipMessageSchema>;
export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type InsertProductRecommendation = z.infer<typeof insertProductRecommendationSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

// CMS & Admin Tables
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  tags: text("tags").array(),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  productType: text("product_type").notNull(),
  quantity: integer("quantity").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"), // pending, reviewed, quoted, rejected
  adminNotes: text("admin_notes"),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for CMS
export const insertPageSchema = createInsertSchema(pages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({ id: true, updatedAt: true });
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({ id: true, createdAt: true, updatedAt: true });

// A/B Testing Tables
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  testType: text("test_type").notNull(), // homepage_hero, product_page, checkout_flow, pricing
  status: text("status").notNull().default("draft"), // draft, active, paused, completed
  trafficSplit: integer("traffic_split").notNull().default(50), // percentage for variant A
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  goalMetric: text("goal_metric").notNull(), // conversion_rate, click_through_rate, revenue, signup_rate
  variantA: json("variant_a").notNull(), // configuration for control
  variantB: json("variant_b").notNull(), // configuration for test variant
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const abTestParticipants = pgTable("ab_test_participants", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => abTests.id),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // for anonymous users
  variant: text("variant").notNull(), // A or B
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const abTestEvents = pgTable("ab_test_events", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => abTests.id),
  participantId: integer("participant_id").references(() => abTestParticipants.id),
  eventType: text("event_type").notNull(), // view, click, conversion, purchase, signup
  eventValue: decimal("event_value", { precision: 10, scale: 2 }), // revenue or other numeric value
  metadata: json("metadata"), // additional event data
  createdAt: timestamp("created_at").defaultNow(),
});

// A/B Testing Schemas
export const insertAbTestSchema = createInsertSchema(abTests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAbTestParticipantSchema = createInsertSchema(abTestParticipants).omit({ id: true, assignedAt: true });
export const insertAbTestEventSchema = createInsertSchema(abTestEvents).omit({ id: true, createdAt: true });

// CMS Types
export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;

// A/B Testing Types
export type AbTest = typeof abTests.$inferSelect;
export type InsertAbTest = z.infer<typeof insertAbTestSchema>;
export type AbTestParticipant = typeof abTestParticipants.$inferSelect;
export type InsertAbTestParticipant = z.infer<typeof insertAbTestParticipantSchema>;
export type AbTestEvent = typeof abTestEvents.$inferSelect;
export type InsertAbTestEvent = z.infer<typeof insertAbTestEventSchema>;
