import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("customer"), // customer, admin
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
  imageUrl: text("image_url"),
  sizes: text("sizes").array(),
  colors: text("colors").array(),
  isActive: boolean("is_active").default(true),
});

export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designData: text("design_data").notNull(), // JSON string of design elements
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id),
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
