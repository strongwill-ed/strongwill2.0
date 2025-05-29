import { 
  users, products, productCategories, designs, cartItems, orders, orderItems, groupOrders, groupOrderItems,
  type User, type InsertUser, type Product, type InsertProduct, type ProductCategory, type InsertProductCategory,
  type Design, type InsertDesign, type CartItem, type InsertCartItem, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem, type GroupOrder, type InsertGroupOrder, type GroupOrderItem, type InsertGroupOrderItem
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private productCategories: Map<number, ProductCategory> = new Map();
  private products: Map<number, Product> = new Map();
  private designs: Map<number, Design> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  private groupOrders: Map<number, GroupOrder> = new Map();
  private groupOrderItems: Map<number, GroupOrderItem> = new Map();
  
  private currentId = {
    users: 1,
    categories: 1,
    products: 1,
    designs: 1,
    cartItems: 1,
    orders: 1,
    orderItems: 1,
    groupOrders: 1,
    groupOrderItems: 1,
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { name: "Singlets", description: "Professional wrestling and track singlets", imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d" },
      { name: "Hoodies", description: "Custom team hoodies and warmups", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
      { name: "Shorts", description: "Performance shorts and athletic wear", imageUrl: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf" },
      { name: "Jerseys", description: "Custom team jerseys and uniforms", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518" },
    ];

    categories.forEach(category => {
      const id = this.currentId.categories++;
      this.productCategories.set(id, { id, ...category });
    });

    // Seed products
    const products = [
      { name: "Classic Wrestling Singlet", description: "Professional grade wrestling singlet", categoryId: 1, basePrice: "45.00", imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d", sizes: ["XS", "S", "M", "L", "XL", "XXL"], colors: ["Red", "Blue", "Black", "White", "Navy"], isActive: true },
      { name: "Team Hoodie", description: "Premium custom team hoodie", categoryId: 2, basePrice: "65.00", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Navy", "Gray", "White", "Red"], isActive: true },
      { name: "Athletic Shorts", description: "Performance athletic shorts", categoryId: 3, basePrice: "35.00", imageUrl: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf", sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Red", "Blue"], isActive: true },
      { name: "Team Jersey", description: "Custom team jersey", categoryId: 4, basePrice: "55.00", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", sizes: ["XS", "S", "M", "L", "XL"], colors: ["White", "Red", "Blue", "Black"], isActive: true },
    ];

    products.forEach(product => {
      const id = this.currentId.products++;
      this.products.set(id, { id, ...product });
    });

    // Seed admin user
    const adminUser = {
      username: "admin",
      password: "admin123",
      email: "admin@strongwillsports.com",
      role: "admin",
      createdAt: new Date(),
    };
    const adminId = this.currentId.users++;
    this.users.set(adminId, { id: adminId, ...adminUser });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Product Categories
  async getProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategories.values());
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategories.get(id);
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = this.currentId.categories++;
    const newCategory: ProductCategory = { id, ...category };
    this.productCategories.set(id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId && p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const newProduct: Product = { id, ...product };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Designs
  async getDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values());
  }

  async getDesignsByUser(userId: number): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(d => d.userId === userId);
  }

  async getDesign(id: number): Promise<Design | undefined> {
    return this.designs.get(id);
  }

  async createDesign(design: InsertDesign): Promise<Design> {
    const id = this.currentId.designs++;
    const newDesign: Design = { 
      ...design, 
      id,
      createdAt: new Date(),
    };
    this.designs.set(id, newDesign);
    return newDesign;
  }

  async updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design | undefined> {
    const design = this.designs.get(id);
    if (!design) return undefined;
    
    const updatedDesign = { ...design, ...updates };
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }

  // Cart
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentId.cartItems++;
    const newItem: CartItem = { id, ...item };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, updates: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<void> {
    const userItems = await this.getCartItems(userId);
    userItems.forEach(item => this.cartItems.delete(item.id));
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const newOrder: Order = { 
      ...order, 
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentId.orderItems++;
    const newItem: OrderItem = { id, ...item };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Group Orders
  async getGroupOrders(): Promise<GroupOrder[]> {
    return Array.from(this.groupOrders.values());
  }

  async getActiveGroupOrders(): Promise<GroupOrder[]> {
    return Array.from(this.groupOrders.values()).filter(go => go.status === 'active');
  }

  async getGroupOrder(id: number): Promise<GroupOrder | undefined> {
    return this.groupOrders.get(id);
  }

  async createGroupOrder(groupOrder: InsertGroupOrder): Promise<GroupOrder> {
    const id = this.currentId.groupOrders++;
    const newGroupOrder: GroupOrder = { 
      ...groupOrder, 
      id,
      createdAt: new Date(),
    };
    this.groupOrders.set(id, newGroupOrder);
    return newGroupOrder;
  }

  async updateGroupOrder(id: number, updates: Partial<InsertGroupOrder>): Promise<GroupOrder | undefined> {
    const groupOrder = this.groupOrders.get(id);
    if (!groupOrder) return undefined;
    
    const updatedGroupOrder = { ...groupOrder, ...updates };
    this.groupOrders.set(id, updatedGroupOrder);
    return updatedGroupOrder;
  }

  async getGroupOrderItems(groupOrderId: number): Promise<GroupOrderItem[]> {
    return Array.from(this.groupOrderItems.values()).filter(item => item.groupOrderId === groupOrderId);
  }

  async addGroupOrderItem(item: InsertGroupOrderItem): Promise<GroupOrderItem> {
    const id = this.currentId.groupOrderItems++;
    const newItem: GroupOrderItem = { id, ...item };
    this.groupOrderItems.set(id, newItem);
    return newItem;
  }
}

import { users, productCategories, products, designs, cartItems, orders, orderItems, groupOrders, groupOrderItems, type User, type ProductCategory, type Product, type Design, type CartItem, type Order, type OrderItem, type GroupOrder, type GroupOrderItem, type InsertUser, type InsertProductCategory, type InsertProduct, type InsertDesign, type InsertCartItem, type InsertOrder, type InsertOrderItem, type InsertGroupOrder, type InsertGroupOrderItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories);
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return category || undefined;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [newCategory] = await db
      .insert(productCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async getDesigns(): Promise<Design[]> {
    return await db.select().from(designs);
  }

  async getDesignsByUser(userId: number): Promise<Design[]> {
    return await db.select().from(designs).where(eq(designs.userId, userId));
  }

  async getDesign(id: number): Promise<Design | undefined> {
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    return design || undefined;
  }

  async createDesign(design: InsertDesign): Promise<Design> {
    const [newDesign] = await db
      .insert(designs)
      .values(design)
      .returning();
    return newDesign;
  }

  async updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design | undefined> {
    const [updatedDesign] = await db
      .update(designs)
      .set(updates)
      .where(eq(designs.id, id))
      .returning();
    return updatedDesign || undefined;
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [newItem] = await db
      .insert(cartItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateCartItem(id: number, updates: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set(updates)
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db
      .insert(orderItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getGroupOrders(): Promise<GroupOrder[]> {
    return await db.select().from(groupOrders);
  }

  async getActiveGroupOrders(): Promise<GroupOrder[]> {
    return await db.select().from(groupOrders).where(eq(groupOrders.status, "active"));
  }

  async getGroupOrder(id: number): Promise<GroupOrder | undefined> {
    const [groupOrder] = await db.select().from(groupOrders).where(eq(groupOrders.id, id));
    return groupOrder || undefined;
  }

  async createGroupOrder(groupOrder: InsertGroupOrder): Promise<GroupOrder> {
    const [newGroupOrder] = await db
      .insert(groupOrders)
      .values(groupOrder)
      .returning();
    return newGroupOrder;
  }

  async updateGroupOrder(id: number, updates: Partial<InsertGroupOrder>): Promise<GroupOrder | undefined> {
    const [updatedGroupOrder] = await db
      .update(groupOrders)
      .set(updates)
      .where(eq(groupOrders.id, id))
      .returning();
    return updatedGroupOrder || undefined;
  }

  async getGroupOrderItems(groupOrderId: number): Promise<GroupOrderItem[]> {
    return await db.select().from(groupOrderItems).where(eq(groupOrderItems.groupOrderId, groupOrderId));
  }

  async addGroupOrderItem(item: InsertGroupOrderItem): Promise<GroupOrderItem> {
    const [newItem] = await db
      .insert(groupOrderItems)
      .values(item)
      .returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
