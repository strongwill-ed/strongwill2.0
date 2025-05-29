import { users, productCategories, products, designs, cartItems, orders, orderItems, groupOrders, groupOrderItems, seekerProfiles, sponsorProfiles, sponsorshipAgreements, sponsorshipCredits, sponsorshipMessages, type User, type ProductCategory, type Product, type Design, type CartItem, type Order, type OrderItem, type GroupOrder, type GroupOrderItem, type SeekerProfile, type SponsorProfile, type SponsorshipAgreement, type SponsorshipCredit, type SponsorshipMessage, type InsertUser, type InsertProductCategory, type InsertProduct, type InsertDesign, type InsertCartItem, type InsertOrder, type InsertOrderItem, type InsertGroupOrder, type InsertGroupOrderItem, type InsertSeekerProfile, type InsertSponsorProfile, type InsertSponsorshipAgreement, type InsertSponsorshipCredit, type InsertSponsorshipMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product Categories
  getProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;

  // Designs
  getDesigns(): Promise<Design[]>;
  getDesignsByUser(userId: number): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design | undefined>;

  // Cart
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, updates: Partial<InsertCartItem>): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<void>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Group Orders
  getGroupOrders(): Promise<GroupOrder[]>;
  getActiveGroupOrders(): Promise<GroupOrder[]>;
  getGroupOrder(id: number): Promise<GroupOrder | undefined>;
  createGroupOrder(groupOrder: InsertGroupOrder): Promise<GroupOrder>;
  updateGroupOrder(id: number, updates: Partial<InsertGroupOrder>): Promise<GroupOrder | undefined>;
  getGroupOrderItems(groupOrderId: number): Promise<GroupOrderItem[]>;
  addGroupOrderItem(item: InsertGroupOrderItem): Promise<GroupOrderItem>;
}

export class DatabaseStorage implements IStorage {
  private initialized = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    
    try {
      // Check if we already have data
      const existingCategories = await db.select().from(productCategories);
      if (existingCategories.length === 0) {
        await this.seedData();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async seedData() {
    // Seed categories
    const [singletCategory, uniformCategory] = await db
      .insert(productCategories)
      .values([
        { name: "Singlets", description: "Professional wrestling singlets", imageUrl: null },
        { name: "Team Uniforms", description: "Complete team uniform sets", imageUrl: null }
      ])
      .returning();

    // Seed products
    await db
      .insert(products)
      .values([
        {
          name: "Classic Wrestling Singlet",
          description: "High-performance wrestling singlet with moisture-wicking fabric",
          basePrice: "89.99",
          imageUrl: null,
          categoryId: singletCategory.id,
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Navy", "Red", "Royal Blue"],
          isActive: true,
        },
        {
          name: "Team Basketball Uniform",
          description: "Complete basketball uniform set with jersey and shorts",
          basePrice: "129.99",
          imageUrl: null,
          categoryId: uniformCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black/White", "Navy/Gold", "Red/White"],
          isActive: true,
        }
      ]);

    console.log('Database seeded successfully');
  }

  async getUser(id: number): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    await this.ensureInitialized();
    return await db.select().from(productCategories);
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    await this.ensureInitialized();
    const [category] = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return category || undefined;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    await this.ensureInitialized();
    const [newCategory] = await db
      .insert(productCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    return await db.select().from(products);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    await this.ensureInitialized();
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    await this.ensureInitialized();
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    await this.ensureInitialized();
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    await this.ensureInitialized();
    const [updatedProduct] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async getDesigns(): Promise<Design[]> {
    await this.ensureInitialized();
    return await db.select().from(designs);
  }

  async getDesignsByUser(userId: number): Promise<Design[]> {
    await this.ensureInitialized();
    return await db.select().from(designs).where(eq(designs.userId, userId));
  }

  async getDesign(id: number): Promise<Design | undefined> {
    await this.ensureInitialized();
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    return design || undefined;
  }

  async createDesign(design: InsertDesign): Promise<Design> {
    await this.ensureInitialized();
    const [newDesign] = await db
      .insert(designs)
      .values(design)
      .returning();
    return newDesign;
  }

  async updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design | undefined> {
    await this.ensureInitialized();
    const [updatedDesign] = await db
      .update(designs)
      .set(updates)
      .where(eq(designs.id, id))
      .returning();
    return updatedDesign || undefined;
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    await this.ensureInitialized();
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    await this.ensureInitialized();
    const [newItem] = await db
      .insert(cartItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateCartItem(id: number, updates: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    await this.ensureInitialized();
    const [updatedItem] = await db
      .update(cartItems)
      .set(updates)
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  async clearCart(userId: number): Promise<void> {
    await this.ensureInitialized();
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async getOrders(): Promise<Order[]> {
    await this.ensureInitialized();
    return await db.select().from(orders);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    await this.ensureInitialized();
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    await this.ensureInitialized();
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    await this.ensureInitialized();
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    await this.ensureInitialized();
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    await this.ensureInitialized();
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    await this.ensureInitialized();
    const [newItem] = await db
      .insert(orderItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getGroupOrders(): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders);
  }

  async getActiveGroupOrders(): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders).where(eq(groupOrders.status, "active"));
  }

  async getGroupOrder(id: number): Promise<GroupOrder | undefined> {
    await this.ensureInitialized();
    const [groupOrder] = await db.select().from(groupOrders).where(eq(groupOrders.id, id));
    return groupOrder || undefined;
  }

  async createGroupOrder(groupOrder: InsertGroupOrder): Promise<GroupOrder> {
    await this.ensureInitialized();
    const [newGroupOrder] = await db
      .insert(groupOrders)
      .values(groupOrder)
      .returning();
    return newGroupOrder;
  }

  async updateGroupOrder(id: number, updates: Partial<InsertGroupOrder>): Promise<GroupOrder | undefined> {
    await this.ensureInitialized();
    const [updatedGroupOrder] = await db
      .update(groupOrders)
      .set(updates)
      .where(eq(groupOrders.id, id))
      .returning();
    return updatedGroupOrder || undefined;
  }

  async getGroupOrderItems(groupOrderId: number): Promise<GroupOrderItem[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrderItems).where(eq(groupOrderItems.groupOrderId, groupOrderId));
  }

  async addGroupOrderItem(item: InsertGroupOrderItem): Promise<GroupOrderItem> {
    await this.ensureInitialized();
    const [newItem] = await db
      .insert(groupOrderItems)
      .values(item)
      .returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();