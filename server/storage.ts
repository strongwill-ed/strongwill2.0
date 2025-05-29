import { users, productCategories, products, designs, cartItems, orders, orderItems, groupOrders, groupOrderItems, refunds, seekerProfiles, sponsorProfiles, sponsorshipAgreements, sponsorshipCredits, sponsorshipMessages, pages, blogPosts, quoteRequests, adminSettings, productRecommendations, type User, type ProductCategory, type Product, type Design, type CartItem, type Order, type OrderItem, type GroupOrder, type GroupOrderItem, type Refund, type SeekerProfile, type SponsorProfile, type SponsorshipAgreement, type SponsorshipCredit, type SponsorshipMessage, type Page, type InsertPage, type BlogPost, type InsertBlogPost, type QuoteRequest, type InsertQuoteRequest, type AdminSetting, type InsertAdminSetting, type ProductRecommendation, type InsertProductRecommendation, type InsertUser, type InsertProductCategory, type InsertProduct, type InsertDesign, type InsertCartItem, type InsertOrder, type InsertOrderItem, type InsertGroupOrder, type InsertGroupOrderItem, type InsertRefund, type InsertSeekerProfile, type InsertSponsorProfile, type InsertSponsorshipAgreement, type InsertSponsorshipCredit, type InsertSponsorshipMessage } from "@shared/schema";
import { db } from "./db";
import { eq, count, sum, and } from "drizzle-orm";

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

  // Refunds
  getRefunds(): Promise<Refund[]>;
  getRefund(id: number): Promise<Refund | undefined>;
  getRefundsByOrder(orderId: number): Promise<Refund[]>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefund(id: number, updates: Partial<InsertRefund>): Promise<Refund | undefined>;

  // Group Orders
  getGroupOrders(): Promise<GroupOrder[]>;
  getActiveGroupOrders(): Promise<GroupOrder[]>;
  getGroupOrdersByUser(userId: number): Promise<GroupOrder[]>;
  getActiveGroupOrdersByUser(userId: number): Promise<GroupOrder[]>;
  getGroupOrder(id: number): Promise<GroupOrder | undefined>;
  createGroupOrder(groupOrder: InsertGroupOrder): Promise<GroupOrder>;
  updateGroupOrder(id: number, updates: Partial<InsertGroupOrder>): Promise<GroupOrder | undefined>;
  getGroupOrderItems(groupOrderId: number): Promise<GroupOrderItem[]>;
  addGroupOrderItem(item: InsertGroupOrderItem): Promise<GroupOrderItem>;
  updateGroupOrderItem(itemId: number, updates: Partial<InsertGroupOrderItem>): Promise<GroupOrderItem | undefined>;
  removeGroupOrderItem(itemId: number): Promise<boolean>;

  // Sponsorship Platform
  // Seeker Profiles
  getSeekerProfiles(): Promise<SeekerProfile[]>;
  getSeekerProfile(id: number): Promise<SeekerProfile | undefined>;
  getSeekerProfileByUserId(userId: number): Promise<SeekerProfile | undefined>;
  createSeekerProfile(profile: InsertSeekerProfile): Promise<SeekerProfile>;
  updateSeekerProfile(id: number, updates: Partial<InsertSeekerProfile>): Promise<SeekerProfile | undefined>;
  deleteSeekerProfile(id: number): Promise<boolean>;

  // Sponsor Profiles
  getSponsorProfiles(): Promise<SponsorProfile[]>;
  getSponsorProfile(id: number): Promise<SponsorProfile | undefined>;
  getSponsorProfileByUserId(userId: number): Promise<SponsorProfile | undefined>;
  createSponsorProfile(profile: InsertSponsorProfile): Promise<SponsorProfile>;
  updateSponsorProfile(id: number, updates: Partial<InsertSponsorProfile>): Promise<SponsorProfile | undefined>;
  deleteSponsorProfile(id: number): Promise<boolean>;

  // Sponsorship Agreements
  getSponsorshipAgreements(): Promise<SponsorshipAgreement[]>;
  getSponsorshipAgreement(id: number): Promise<SponsorshipAgreement | undefined>;
  getAgreementsBySeeker(seekerId: number): Promise<SponsorshipAgreement[]>;
  getAgreementsBySponsor(sponsorId: number): Promise<SponsorshipAgreement[]>;
  createSponsorshipAgreement(agreement: InsertSponsorshipAgreement): Promise<SponsorshipAgreement>;
  updateSponsorshipAgreement(id: number, updates: Partial<InsertSponsorshipAgreement>): Promise<SponsorshipAgreement | undefined>;

  // Sponsorship Credits
  getSponsorshipCredits(seekerId: number): Promise<SponsorshipCredit[]>;
  createSponsorshipCredit(credit: InsertSponsorshipCredit): Promise<SponsorshipCredit>;
  updateCreditBalance(id: number, remainingAmount: string): Promise<SponsorshipCredit | undefined>;

  // Sponsorship Messages
  getMessages(userId: number): Promise<SponsorshipMessage[]>;
  getConversation(userId1: number, userId2: number): Promise<SponsorshipMessage[]>;
  sendMessage(message: InsertSponsorshipMessage): Promise<SponsorshipMessage>;
  markMessageAsRead(messageId: number): Promise<void>;

  // CMS & Admin
  // Pages
  getPages(): Promise<Page[]>;
  getPublishedPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, updates: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Quote Requests
  getQuoteRequests(): Promise<QuoteRequest[]>;
  getQuoteRequest(id: number): Promise<QuoteRequest | undefined>;
  createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest>;
  updateQuoteRequest(id: number, updates: Partial<InsertQuoteRequest>): Promise<QuoteRequest | undefined>;
  deleteQuoteRequest(id: number): Promise<boolean>;

  // Admin Settings
  getAdminSettings(): Promise<AdminSetting[]>;
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  createAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
  updateAdminSetting(key: string, value: string): Promise<AdminSetting | undefined>;

  // Admin Analytics
  getAdminStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: string;
    activeSponsorships: number;
  }>;

  // User Management
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, role: string): Promise<User | undefined>;

  // Product Recommendations
  getProductRecommendations(productId: number): Promise<ProductRecommendation[]>;
  createProductRecommendation(recommendation: InsertProductRecommendation): Promise<ProductRecommendation>;
  updateProductRecommendation(id: number, updates: Partial<InsertProductRecommendation>): Promise<ProductRecommendation | undefined>;
  deleteProductRecommendation(id: number): Promise<boolean>;
  getRecommendationsForCartItems(cartItemIds: number[]): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  private initialized = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    
    try {
      // Check if we already have data
      const existingCategories = await db.select().from(productCategories);
      const existingProducts = await db.select().from(products);
      
      // Force reseed if we have fewer than 20 products (our new expanded catalog)
      // or if products don't have updated image URLs
      const needsUpdate = existingProducts.length < 20 || 
        existingProducts.some(p => !p.imageUrl || p.imageUrl.includes('placeholder'));
      
      if (existingCategories.length === 0 || needsUpdate) {
        // Clear existing data before reseeding (handle foreign key constraints)
        if (existingProducts.length > 0) {
          // First delete dependent records
          await db.delete(groupOrderItems);
          await db.delete(groupOrders);
          await db.delete(orderItems);
          await db.delete(cartItems);
          await db.delete(designs);
          await db.delete(products);
        }
        if (existingCategories.length > 0) {
          await db.delete(productCategories);
        }
        await this.seedData();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async seedData() {
    // Seed categories - focused on key sports with optimized imagery
    const [rugbyCategory, soccerCategory, basketballCategory, varsityCategory, tennisCategory, accessoriesCategory] = await db
      .insert(productCategories)
      .values([
        { name: "Rugby Gear", description: "Built tough for rugby's demands - jerseys, shorts, and protective gear", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format" },
        { name: "Soccer Uniforms", description: "Complete soccer kits and training apparel for clubs and teams", imageUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop&auto=format" },
        { name: "Basketball Apparel", description: "Performance basketball uniforms and practice gear", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&auto=format" },
        { name: "High School Varsity", description: "Classic varsity jackets, letterman gear, and school spirit wear", imageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&h=400&fit=crop&auto=format" },
        { name: "Tennis Wear", description: "Professional tennis apparel for court performance", imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&auto=format" },
        { name: "Sports Accessories", description: "Essential gear and accessories for all sports", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=400&fit=crop&auto=format" }
      ])
      .returning();

    // Seed products - sport-specific lineup with optimized imagery
    await db
      .insert(products)
      .values([
        // RUGBY GEAR
        {
          name: "Pro Rugby Jersey",
          description: "Built for the intensity of rugby with reinforced seams, moisture-wicking fabric, and ergonomic fit. Features tear-resistant construction and traditional collar design.",
          basePrice: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&auto=format",
          categoryId: rugbyCategory.id,
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: ["Navy", "Forest Green", "Maroon", "Black", "White"],
          isActive: true,
        },
        {
          name: "Rugby Training Shorts",
          description: "Durable rugby shorts with reinforced stitching and stretch panels for maximum mobility during scrums and tackles. Quick-dry fabric with secure pocket design.",
          basePrice: "54.99",
          imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop&auto=format",
          categoryId: rugbyCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Navy", "Gray"],
          isActive: true,
        },

        // SOCCER UNIFORMS
        {
          name: "Elite Soccer Jersey",
          description: "Professional-grade soccer jersey with advanced moisture-wicking technology and lightweight design. Features club-quality construction and authentic styling.",
          basePrice: "74.99",
          imageUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=600&fit=crop&auto=format",
          categoryId: soccerCategory.id,
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: ["Royal Blue", "Red", "White", "Black", "Forest Green"],
          isActive: true,
        },
        {
          name: "Soccer Training Shorts",
          description: "Lightweight soccer shorts with stretch fabric and secure fit. Designed for optimal ball control and field performance.",
          basePrice: "39.99",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format",
          categoryId: soccerCategory.id,
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Navy", "White", "Royal Blue"],
          isActive: true,
        },

        // BASKETBALL APPAREL
        {
          name: "Pro Basketball Jersey",
          description: "Authentic basketball jersey with premium mesh construction and moisture management technology. Built for peak court performance.",
          basePrice: "79.99",
          imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop&auto=format",
          categoryId: basketballCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["White", "Navy", "Red", "Black", "Gold"],
          isActive: true,
        },
        {
          name: "Basketball Shorts",
          description: "Performance basketball shorts with side panels and secure waistband. Features quick-dry fabric and professional styling.",
          basePrice: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop&auto=format",
          categoryId: basketballCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Navy", "White", "Red"],
          isActive: true,
        },

        // HIGH SCHOOL VARSITY
        {
          name: "Classic Varsity Jacket",
          description: "Traditional letterman jacket with wool body and leather sleeves. Features embroidered school letters and premium construction.",
          basePrice: "149.99",
          imageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&h=600&fit=crop&auto=format",
          categoryId: varsityCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Navy/White", "Black/Gold", "Maroon/Gray", "Green/White"],
          isActive: true,
        },
        {
          name: "School Spirit Hoodie",
          description: "Premium school spirit hoodie with soft fleece lining and custom embroidery options. Perfect for showing team pride.",
          basePrice: "64.99",
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a9fbc5c9d09?w=600&h=600&fit=crop&auto=format",
          categoryId: varsityCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Navy", "Gray", "Black", "Maroon"],
          isActive: true,
        },

        // TENNIS WEAR
        {
          name: "Tennis Performance Polo",
          description: "Professional tennis polo with UV protection and moisture-wicking technology. Classic collar design with modern performance features.",
          basePrice: "69.99",
          imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=600&fit=crop&auto=format",
          categoryId: tennisCategory.id,
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["White", "Navy", "Black", "Light Blue"],
          isActive: true,
        },
        {
          name: "Tennis Court Shorts",
          description: "Lightweight tennis shorts with built-in compression and ball pocket design. Engineered for court agility and comfort.",
          basePrice: "44.99",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format",
          categoryId: tennisCategory.id,
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["White", "Navy", "Black"],
          isActive: true,
        },

        // SPORTS ACCESSORIES
        {
          name: "Sport Water Bottle",
          description: "Insulated stainless steel water bottle with team logo customization. Keeps drinks cold for 24 hours or hot for 12 hours.",
          basePrice: "24.99",
          imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop&auto=format",
          categoryId: accessoriesCategory.id,
          sizes: ["One Size"],
          colors: ["Black", "Navy", "White", "Red"],
          isActive: true,
        },
        {
          name: "Athletic Headband",
          description: "Moisture-wicking headband with non-slip grip. Perfect for all sports and training activities.",
          basePrice: "12.99",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format",
          categoryId: accessoriesCategory.id,
          sizes: ["One Size"],
          colors: ["Black", "White", "Navy", "Red"],
          isActive: true,
        },
        {
          name: "Team Duffle Bag",
          description: "Spacious team duffle bag with multiple compartments and custom embroidery options. Perfect for travel and equipment storage.",
          basePrice: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format",
          categoryId: accessoriesCategory.id,
          sizes: ["One Size"],
          colors: ["Black", "Navy", "Red", "Gray"],
          isActive: true,
        },
        {
          name: "Performance Socks Pack",
          description: "3-pack of athletic socks with cushioned sole and arch support. Moisture-wicking fabric keeps feet dry during intense activity.",
          basePrice: "19.99",
          imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop&auto=format",
          categoryId: accessoriesCategory.id,
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Navy", "Black", "White", "Red"],
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

  // Refunds
  async getRefunds(): Promise<Refund[]> {
    await this.ensureInitialized();
    return await db.select().from(refunds);
  }

  async getRefund(id: number): Promise<Refund | undefined> {
    await this.ensureInitialized();
    const [refund] = await db.select().from(refunds).where(eq(refunds.id, id));
    return refund || undefined;
  }

  async getRefundsByOrder(orderId: number): Promise<Refund[]> {
    await this.ensureInitialized();
    return await db.select().from(refunds).where(eq(refunds.orderId, orderId));
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    await this.ensureInitialized();
    const [newRefund] = await db
      .insert(refunds)
      .values(refund)
      .returning();
    return newRefund;
  }

  async updateRefund(id: number, updates: Partial<InsertRefund>): Promise<Refund | undefined> {
    await this.ensureInitialized();
    const [updatedRefund] = await db
      .update(refunds)
      .set(updates)
      .where(eq(refunds.id, id))
      .returning();
    return updatedRefund || undefined;
  }

  async getGroupOrders(): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders);
  }

  async getActiveGroupOrders(): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders).where(eq(groupOrders.status, "active"));
  }

  async getGroupOrdersByUser(userId: number): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders).where(eq(groupOrders.organizerUserId, userId));
  }

  async getActiveGroupOrdersByUser(userId: number): Promise<GroupOrder[]> {
    await this.ensureInitialized();
    return await db.select().from(groupOrders).where(
      and(eq(groupOrders.organizerUserId, userId), eq(groupOrders.status, "active"))
    );
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

  async updateGroupOrderItem(itemId: number, updates: Partial<InsertGroupOrderItem>): Promise<GroupOrderItem | undefined> {
    await this.ensureInitialized();
    const [updatedItem] = await db
      .update(groupOrderItems)
      .set(updates)
      .where(eq(groupOrderItems.id, itemId))
      .returning();
    return updatedItem || undefined;
  }

  async removeGroupOrderItem(itemId: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db
      .delete(groupOrderItems)
      .where(eq(groupOrderItems.id, itemId));
    return (result.rowCount || 0) > 0;
  }

  // Sponsorship Platform Implementation
  // Seeker Profiles
  async getSeekerProfiles(): Promise<SeekerProfile[]> {
    await this.ensureInitialized();
    return await db.select().from(seekerProfiles).where(eq(seekerProfiles.isActive, true));
  }

  async getSeekerProfile(id: number): Promise<SeekerProfile | undefined> {
    await this.ensureInitialized();
    const [profile] = await db.select().from(seekerProfiles).where(eq(seekerProfiles.id, id));
    return profile || undefined;
  }

  async getSeekerProfileByUserId(userId: number): Promise<SeekerProfile | undefined> {
    await this.ensureInitialized();
    const [profile] = await db.select().from(seekerProfiles).where(eq(seekerProfiles.userId, userId));
    return profile || undefined;
  }

  async getSeekerProfileByToken(token: string): Promise<SeekerProfile | undefined> {
    await this.ensureInitialized();
    const [profile] = await db.select().from(seekerProfiles).where(eq(seekerProfiles.shareableToken, token));
    return profile || undefined;
  }

  async createSeekerProfile(profile: InsertSeekerProfile): Promise<SeekerProfile> {
    await this.ensureInitialized();
    const [newProfile] = await db
      .insert(seekerProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateSeekerProfile(id: number, updates: Partial<InsertSeekerProfile>): Promise<SeekerProfile | undefined> {
    await this.ensureInitialized();
    const [updatedProfile] = await db
      .update(seekerProfiles)
      .set(updates)
      .where(eq(seekerProfiles.id, id))
      .returning();
    return updatedProfile || undefined;
  }

  async deleteSeekerProfile(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db
      .delete(seekerProfiles)
      .where(eq(seekerProfiles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Sponsor Profiles
  async getSponsorProfiles(): Promise<SponsorProfile[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.isActive, true));
  }

  async getSponsorProfile(id: number): Promise<SponsorProfile | undefined> {
    await this.ensureInitialized();
    const [profile] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.id, id));
    return profile || undefined;
  }

  async getSponsorProfileByUserId(userId: number): Promise<SponsorProfile | undefined> {
    await this.ensureInitialized();
    const [profile] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, userId));
    return profile || undefined;
  }

  async createSponsorProfile(profile: InsertSponsorProfile): Promise<SponsorProfile> {
    await this.ensureInitialized();
    const [newProfile] = await db
      .insert(sponsorProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateSponsorProfile(id: number, updates: Partial<InsertSponsorProfile>): Promise<SponsorProfile | undefined> {
    await this.ensureInitialized();
    const [updatedProfile] = await db
      .update(sponsorProfiles)
      .set(updates)
      .where(eq(sponsorProfiles.id, id))
      .returning();
    return updatedProfile || undefined;
  }

  async deleteSponsorProfile(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db
      .delete(sponsorProfiles)
      .where(eq(sponsorProfiles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Sponsorship Agreements
  async getSponsorshipAgreements(): Promise<SponsorshipAgreement[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipAgreements);
  }

  async getSponsorshipAgreement(id: number): Promise<SponsorshipAgreement | undefined> {
    await this.ensureInitialized();
    const [agreement] = await db.select().from(sponsorshipAgreements).where(eq(sponsorshipAgreements.id, id));
    return agreement || undefined;
  }

  async getAgreementsBySeeker(seekerId: number): Promise<SponsorshipAgreement[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipAgreements).where(eq(sponsorshipAgreements.seekerId, seekerId));
  }

  async getAgreementsBySponsor(sponsorId: number): Promise<SponsorshipAgreement[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipAgreements).where(eq(sponsorshipAgreements.sponsorId, sponsorId));
  }

  async createSponsorshipAgreement(agreement: InsertSponsorshipAgreement): Promise<SponsorshipAgreement> {
    await this.ensureInitialized();
    const [newAgreement] = await db
      .insert(sponsorshipAgreements)
      .values(agreement)
      .returning();
    return newAgreement;
  }

  async updateSponsorshipAgreement(id: number, updates: Partial<InsertSponsorshipAgreement>): Promise<SponsorshipAgreement | undefined> {
    await this.ensureInitialized();
    const [updatedAgreement] = await db
      .update(sponsorshipAgreements)
      .set(updates)
      .where(eq(sponsorshipAgreements.id, id))
      .returning();
    return updatedAgreement || undefined;
  }

  // Sponsorship Credits
  async getSponsorshipCredits(seekerId: number): Promise<SponsorshipCredit[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipCredits).where(eq(sponsorshipCredits.seekerId, seekerId));
  }

  async createSponsorshipCredit(credit: InsertSponsorshipCredit): Promise<SponsorshipCredit> {
    await this.ensureInitialized();
    const [newCredit] = await db
      .insert(sponsorshipCredits)
      .values(credit)
      .returning();
    return newCredit;
  }

  async updateCreditBalance(id: number, remainingAmount: string): Promise<SponsorshipCredit | undefined> {
    await this.ensureInitialized();
    const [updatedCredit] = await db
      .update(sponsorshipCredits)
      .set({ remainingAmount })
      .where(eq(sponsorshipCredits.id, id))
      .returning();
    return updatedCredit || undefined;
  }

  // Sponsorship Messages
  async getMessages(userId: number): Promise<SponsorshipMessage[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipMessages)
      .where(eq(sponsorshipMessages.receiverId, userId));
  }

  async getConversation(userId1: number, userId2: number): Promise<SponsorshipMessage[]> {
    await this.ensureInitialized();
    return await db.select().from(sponsorshipMessages)
      .where(
        eq(sponsorshipMessages.senderId, userId1) && eq(sponsorshipMessages.receiverId, userId2) ||
        eq(sponsorshipMessages.senderId, userId2) && eq(sponsorshipMessages.receiverId, userId1)
      );
  }

  async sendMessage(message: InsertSponsorshipMessage): Promise<SponsorshipMessage> {
    await this.ensureInitialized();
    const [newMessage] = await db
      .insert(sponsorshipMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await this.ensureInitialized();
    await db
      .update(sponsorshipMessages)
      .set({ isRead: true })
      .where(eq(sponsorshipMessages.id, messageId));
  }

  // CMS & Admin Methods
  // Pages
  async getPages(): Promise<Page[]> {
    await this.ensureInitialized();
    return await db.select().from(pages);
  }

  async getPublishedPages(): Promise<Page[]> {
    await this.ensureInitialized();
    return await db.select().from(pages).where(eq(pages.isPublished, true));
  }

  async getPage(id: number): Promise<Page | undefined> {
    await this.ensureInitialized();
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    await this.ensureInitialized();
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page || undefined;
  }

  async createPage(page: InsertPage): Promise<Page> {
    await this.ensureInitialized();
    const [newPage] = await db
      .insert(pages)
      .values(page)
      .returning();
    return newPage;
  }

  async updatePage(id: number, updates: Partial<InsertPage>): Promise<Page | undefined> {
    await this.ensureInitialized();
    const [updatedPage] = await db
      .update(pages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage || undefined;
  }

  async deletePage(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(pages).where(eq(pages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    await this.ensureInitialized();
    return await db.select().from(blogPosts);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    await this.ensureInitialized();
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    await this.ensureInitialized();
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    await this.ensureInitialized();
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    await this.ensureInitialized();
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    await this.ensureInitialized();
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Quote Requests
  async getQuoteRequests(): Promise<QuoteRequest[]> {
    await this.ensureInitialized();
    return await db.select().from(quoteRequests);
  }

  async getQuoteRequest(id: number): Promise<QuoteRequest | undefined> {
    await this.ensureInitialized();
    const [quote] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id));
    return quote || undefined;
  }

  async createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest> {
    await this.ensureInitialized();
    const [newQuote] = await db
      .insert(quoteRequests)
      .values(quote)
      .returning();
    return newQuote;
  }

  async updateQuoteRequest(id: number, updates: Partial<InsertQuoteRequest>): Promise<QuoteRequest | undefined> {
    await this.ensureInitialized();
    const [updatedQuote] = await db
      .update(quoteRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(quoteRequests.id, id))
      .returning();
    return updatedQuote || undefined;
  }

  async deleteQuoteRequest(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Admin Settings
  async getAdminSettings(): Promise<AdminSetting[]> {
    await this.ensureInitialized();
    return await db.select().from(adminSettings);
  }

  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    await this.ensureInitialized();
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting || undefined;
  }

  async createAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    await this.ensureInitialized();
    const [newSetting] = await db
      .insert(adminSettings)
      .values(setting)
      .returning();
    return newSetting;
  }

  async updateAdminSetting(key: string, value: string): Promise<AdminSetting | undefined> {
    await this.ensureInitialized();
    const [updatedSetting] = await db
      .update(adminSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(adminSettings.key, key))
      .returning();
    return updatedSetting || undefined;
  }

  // Admin Analytics
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: string;
    activeSponsorships: number;
  }> {
    await this.ensureInitialized();
    
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [ordersCount] = await db.select({ count: count() }).from(orders);
    const [revenueResult] = await db.select({ 
      total: sum(orders.totalAmount) 
    }).from(orders).where(eq(orders.status, 'completed'));
    const [sponsorshipsCount] = await db.select({ count: count() }).from(sponsorshipAgreements)
      .where(eq(sponsorshipAgreements.status, 'active'));

    return {
      totalUsers: usersCount.count,
      totalOrders: ordersCount.count,
      totalRevenue: revenueResult.total || '0',
      activeSponsorships: sponsorshipsCount.count
    };
  }

  // User Management
  async getAllUsers(): Promise<User[]> {
    await this.ensureInitialized();
    return await db.select().from(users);
  }

  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  // Product Recommendations
  async getProductRecommendations(productId: number): Promise<ProductRecommendation[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(productRecommendations)
      .where(and(
        eq(productRecommendations.productId, productId),
        eq(productRecommendations.isActive, true)
      ));
  }

  async createProductRecommendation(recommendation: InsertProductRecommendation): Promise<ProductRecommendation> {
    await this.ensureInitialized();
    const [newRecommendation] = await db
      .insert(productRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async updateProductRecommendation(id: number, updates: Partial<InsertProductRecommendation>): Promise<ProductRecommendation | undefined> {
    await this.ensureInitialized();
    const [updatedRecommendation] = await db
      .update(productRecommendations)
      .set(updates)
      .where(eq(productRecommendations.id, id))
      .returning();
    return updatedRecommendation || undefined;
  }

  async deleteProductRecommendation(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(productRecommendations).where(eq(productRecommendations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRecommendationsForCartItems(cartItemIds: number[]): Promise<Product[]> {
    await this.ensureInitialized();
    if (cartItemIds.length === 0) return [];
    
    // Get cart items to find their product IDs
    const cartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, cartItemIds[0])); // Use first cart item for now
    
    if (cartItems.length === 0) return [];
    
    const productId = cartItems[0].productId;
    
    // Get recommended products for this product
    const recommendations = await db
      .select({
        product: products
      })
      .from(productRecommendations)
      .innerJoin(products, eq(productRecommendations.recommendedProductId, products.id))
      .where(and(
        eq(productRecommendations.productId, productId),
        eq(productRecommendations.isActive, true)
      ))
      .orderBy(productRecommendations.priority);
    
    return recommendations.map(r => r.product);
  }
}

export const storage = new DatabaseStorage();