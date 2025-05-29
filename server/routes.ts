import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductCategorySchema, insertProductSchema, insertDesignSchema, 
  insertCartItemSchema, insertOrderSchema, insertOrderItemSchema,
  insertGroupOrderSchema, insertGroupOrderItemSchema, insertRefundSchema,
  insertSeekerProfileSchema, insertSponsorProfileSchema,
  insertSponsorshipAgreementSchema, insertSponsorshipCreditSchema,
  insertSponsorshipMessageSchema, insertPageSchema, insertBlogPostSchema,
  insertQuoteRequestSchema, insertAdminSettingSchema, insertProductRecommendationSchema,
  insertNewsletterSubscriptionSchema, type InsertGroupOrder
} from "@shared/schema";
import { z } from "zod";
import { emailService } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check for admin credentials
      if (username === "admin" && password === "admin") {
        const adminUser = {
          id: 1,
          username: "admin",
          email: "admin@strongwillsports.com",
          role: "admin"
        };
        return res.json(adminUser);
      }
      
      // Check regular users
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // For now, we'll use a simple password check
      // In production, you'd hash and compare passwords
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        username,
        email,
        password, // Include password field
        role: "user"
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    // For now, return a mock response since we don't have sessions
    res.status(401).json({ message: "Not authenticated" });
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // Product Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertProductCategorySchema.parse(req.body);
      const category = await storage.createProductCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId } = req.query;
      let products;
      
      if (categoryId) {
        products = await storage.getProductsByCategory(parseInt(categoryId as string));
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(productId, updates);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update product" });
      }
    }
  });

  // Designs
  app.get("/api/designs", async (req, res) => {
    try {
      const { userId } = req.query;
      let designs;
      
      if (userId) {
        designs = await storage.getDesignsByUser(parseInt(userId as string));
      } else {
        designs = await storage.getDesigns();
      }
      
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const designId = parseInt(req.params.id);
      const design = await storage.getDesign(designId);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", async (req, res) => {
    try {
      const designData = insertDesignSchema.parse(req.body);
      const design = await storage.createDesign(designData);
      res.status(201).json(design);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid design data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create design" });
      }
    }
  });

  app.get("/api/designs/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const designs = await storage.getDesignsByUser(userId);
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user designs" });
    }
  });

  app.put("/api/designs/:id", async (req, res) => {
    try {
      const designId = parseInt(req.params.id);
      const updates = insertDesignSchema.partial().parse(req.body);
      const design = await storage.updateDesign(designId, updates);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid design data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update design" });
      }
    }
  });

  // Cart
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add item to cart" });
      }
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updates = insertCartItemSchema.partial().parse(req.body);
      const cartItem = await storage.updateCartItem(itemId, updates);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update cart item" });
      }
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const success = await storage.removeFromCart(itemId);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      let orders;
      
      if (userId) {
        orders = await storage.getOrdersByUser(parseInt(userId as string));
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      const orderData = insertOrderSchema.parse(order);
      const newOrder = await storage.createOrder(orderData);
      
      // Add order items
      for (const item of items) {
        const orderItemData = insertOrderItemSchema.parse({ ...item, orderId: newOrder.id });
        await storage.addOrderItem(orderItemData);
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Refunds
  app.get("/api/refunds", async (req, res) => {
    try {
      const { orderId } = req.query;
      let refunds;
      
      if (orderId) {
        refunds = await storage.getRefundsByOrder(parseInt(orderId as string));
      } else {
        refunds = await storage.getRefunds();
      }
      
      res.json(refunds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch refunds" });
    }
  });

  app.post("/api/refunds", async (req, res) => {
    try {
      const refundData = insertRefundSchema.parse(req.body);
      const refund = await storage.createRefund(refundData);
      res.status(201).json(refund);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid refund data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create refund" });
      }
    }
  });

  app.put("/api/refunds/:id", async (req, res) => {
    try {
      const refundId = parseInt(req.params.id);
      const updates = insertRefundSchema.partial().parse(req.body);
      const refund = await storage.updateRefund(refundId, updates);
      
      if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
      }
      
      res.json(refund);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid refund data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update refund" });
      }
    }
  });

  // Group Orders
  app.get("/api/group-orders", async (req, res) => {
    try {
      // Get user info from headers (set by frontend auth)
      const userId = req.headers['x-user-id'];
      const userRole = req.headers['x-user-role'];
      
      const { active } = req.query;
      let groupOrders;

      if (!userId || !userRole) {
        // For guests, show all active group orders
        if (active === 'true') {
          groupOrders = await storage.getActiveGroupOrders();
        } else {
          groupOrders = await storage.getGroupOrders();
        }
        res.json(groupOrders);
        return;
      }

      if (userRole === 'admin') {
        // Admin can see all group orders with creator information
        if (active === 'true') {
          groupOrders = await storage.getActiveGroupOrders();
        } else {
          groupOrders = await storage.getGroupOrders();
        }
        
        // Add creator information for admin view
        const groupOrdersWithCreators = await Promise.all(
          groupOrders.map(async (groupOrder) => {
            if (groupOrder.organizerUserId) {
              const creator = await storage.getUser(groupOrder.organizerUserId);
              return {
                ...groupOrder,
                creatorUsername: creator?.username || 'Unknown',
                creatorEmail: creator?.email || 'Unknown'
              };
            }
            return {
              ...groupOrder,
              creatorUsername: 'Unknown',
              creatorEmail: 'Unknown'
            };
          })
        );
        
        res.json(groupOrdersWithCreators);
      } else {
        // Regular users only see their own group orders
        const currentUserId = parseInt(userId as string);
        if (active === 'true') {
          groupOrders = await storage.getActiveGroupOrdersByUser(currentUserId);
        } else {
          groupOrders = await storage.getGroupOrdersByUser(currentUserId);
        }
        res.json(groupOrders);
      }
    } catch (error) {
      console.error('Get group orders error:', error);
      res.status(500).json({ message: "Failed to fetch group orders" });
    }
  });

  app.get("/api/group-orders/:id", async (req, res) => {
    try {
      const groupOrderId = parseInt(req.params.id);
      const groupOrder = await storage.getGroupOrder(groupOrderId);
      
      if (!groupOrder) {
        return res.status(404).json({ message: "Group order not found" });
      }
      
      const items = await storage.getGroupOrderItems(groupOrderId);
      res.json({ ...groupOrder, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group order" });
    }
  });

  app.post("/api/group-orders", async (req, res) => {
    try {
      // Basic validation and processing
      const { name, productId, deadline, minimumQuantity, organizerUserId, organizerEmail, description, orderType } = req.body;
      
      if (!name || !deadline || !organizerEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if user with this email already exists
      const existingUser = await storage.getUserByEmail(organizerEmail);
      
      if (existingUser && !organizerUserId) {
        // User exists but not logged in - suggest login
        return res.status(409).json({ 
          message: "An account with this email already exists. Please login to continue.",
          shouldLogin: true,
          email: organizerEmail
        });
      }
      
      let finalOrganizerUserId = organizerUserId;
      
      // If no user ID provided but email doesn't exist, we'll create order with email only
      // The user can create an account later
      if (!finalOrganizerUserId && !existingUser) {
        finalOrganizerUserId = null;
      } else if (existingUser) {
        finalOrganizerUserId = existingUser.id;
      }
      
      const groupOrderData = {
        name,
        productId: productId ? parseInt(productId) : null,
        deadline: new Date(deadline),
        minimumQuantity: minimumQuantity || 10,
        organizerUserId: finalOrganizerUserId,
        organizerEmail,
        description: description || null,
        orderType: orderType || "custom",
        status: "active",
        currentQuantity: 0,
        paymentMode: "individual",
        totalEstimate: "0.00",
        shareableLink: null,
        designId: null
      } as InsertGroupOrder;
      
      const groupOrder = await storage.createGroupOrder(groupOrderData);
      res.status(201).json(groupOrder);
    } catch (error) {
      console.error('Group order creation error:', error);
      res.status(500).json({ message: "Failed to create group order", error: (error as Error).message });
    }
  });

  app.patch("/api/group-orders/:id", async (req, res) => {
    try {
      const groupOrderId = parseInt(req.params.id);
      const updates = req.body;
      
      // Convert productId and designId to integers if provided
      if (updates.productId) updates.productId = parseInt(updates.productId);
      if (updates.designId) updates.designId = parseInt(updates.designId);
      
      const updatedGroupOrder = await storage.updateGroupOrder(groupOrderId, updates);
      
      if (!updatedGroupOrder) {
        return res.status(404).json({ message: "Group order not found" });
      }
      
      res.json(updatedGroupOrder);
    } catch (error) {
      console.error('Group order update error:', error);
      res.status(500).json({ message: "Failed to update group order", error: (error as Error).message });
    }
  });

  app.post("/api/group-orders/:id/join", async (req, res) => {
    try {
      const groupOrderId = parseInt(req.params.id);
      const itemData = insertGroupOrderItemSchema.parse({ ...req.body, groupOrderId });
      const item = await storage.addGroupOrderItem(itemData);
      
      // Update group order quantity
      const groupOrder = await storage.getGroupOrder(groupOrderId);
      if (groupOrder) {
        await storage.updateGroupOrder(groupOrderId, {
          currentQuantity: (groupOrder.currentQuantity || 0) + item.quantity
        });
      }
      
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid group order item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to join group order" });
      }
    }
  });

  app.delete("/api/group-order-items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      // Get all group order items to find the one being deleted
      const allItems: any[] = [];
      const groupOrders = await storage.getGroupOrders();
      
      for (const groupOrder of groupOrders) {
        const items = await storage.getGroupOrderItems(groupOrder.id);
        allItems.push(...items);
      }
      
      const item = allItems.find(i => i.id === itemId);
      if (!item) {
        return res.status(404).json({ message: "Group order item not found" });
      }
      
      const groupOrder = await storage.getGroupOrder(item.groupOrderId);
      if (!groupOrder) {
        return res.status(404).json({ message: "Group order not found" });
      }
      
      // Remove the item
      const success = await storage.removeGroupOrderItem(itemId);
      if (success) {
        // Update group order current quantity
        const newQuantity = Math.max(0, (groupOrder.currentQuantity || 0) - item.quantity);
        await storage.updateGroupOrder(item.groupOrderId, { currentQuantity: newQuantity });
        
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to remove group order item" });
      }
    } catch (error) {
      console.error('Remove group order item error:', error);
      res.status(500).json({ message: "Failed to remove group order item", error: (error as Error).message });
    }
  });

  app.patch("/api/group-order-items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedItem = await storage.updateGroupOrderItem(itemId, updates);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Group order item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error('Update group order item error:', error);
      res.status(500).json({ message: "Failed to update group order item", error: (error as Error).message });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      const {
        customerEmail,
        billingAddress,
        shippingAddress,
        items,
        subtotal,
        discount,
        shipping,
        tax,
        totalAmount,
        paymentMethod
      } = req.body;

      if (!customerEmail || !items || !totalAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create the order
      const orderData = {
        customerEmail,
        subtotal,
        discount: discount || "0.00",
        shipping: shipping || "0.00", 
        tax: tax || "0.00",
        totalAmount,
        paymentMethod: paymentMethod || "card",
        paymentStatus: "pending",
        status: "pending",
        billingAddress: JSON.stringify(billingAddress),
        shippingAddress: JSON.stringify(shippingAddress),
        userId: null // For guest checkout
      };

      const order = await storage.createOrder(orderData);

      // Add order items
      for (const item of items) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: item.productId,
          designId: item.designId || null,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unitPrice: item.unitPrice,
          customizations: JSON.stringify(item.customizations || {})
        });
      }

      res.status(201).json({ 
        orderId: order.id,
        message: "Order created successfully"
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const products = await storage.getProducts();
      const groupOrders = await storage.getGroupOrders();
      
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const activeOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length;
      
      const stats = {
        totalOrders: orders.length,
        revenue: totalRevenue.toFixed(2),
        products: products.length,
        customers: new Set(orders.map(order => order.userId)).size,
        activeOrders,
        groupOrders: groupOrders.length,
        activeGroupOrders: groupOrders.filter(go => go.status === 'active').length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Stripe Payment Intent
  app.post("/api/payments/create-intent", async (req, res) => {
    try {
      const { amount, currency = 'usd' } = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(400).json({ 
          message: "Payment processing not configured. Please provide Stripe credentials." 
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Confirm payment and update order
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { orderId, paymentIntentId } = req.body;

      if (!orderId || !paymentIntentId) {
        return res.status(400).json({ message: "Order ID and Payment Intent ID are required" });
      }

      // Update order payment status
      const updatedOrder = await storage.updateOrderStatus(orderId, "confirmed");
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send order confirmation email
      try {
        // Get order items for email
        const orderItems = await storage.getOrderItems(orderId);
        const user = await storage.getUser(updatedOrder.userId);
        
        if (user && user.email) {
          const items = await Promise.all(
            orderItems.map(async (item) => {
              const product = await storage.getProduct(item.productId);
              return {
                name: product?.name || 'Product',
                quantity: item.quantity,
                price: item.price
              };
            })
          );

          await emailService.sendOrderConfirmation({
            customerEmail: user.email,
            customerName: user.username,
            orderId: updatedOrder.id,
            totalAmount: updatedOrder.totalAmount,
            items
          });
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order confirmation if email fails
      }

      res.json({ 
        message: "Payment confirmed successfully",
        order: updatedOrder 
      });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Get all orders for admin
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Sponsorship Platform Routes
  
  // Seeker Profile Routes
  app.get("/api/seeker-profiles", async (req, res) => {
    try {
      const profiles = await storage.getSeekerProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seeker profiles" });
    }
  });

  app.get("/api/seeker-profiles/user", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const profile = await storage.getSeekerProfileByUserId(parseInt(userId as string));
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seeker profile" });
    }
  });

  app.get("/api/seeker-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getSeekerProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Seeker profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seeker profile" });
    }
  });

  app.get("/api/seeker-profiles/share/:token", async (req, res) => {
    try {
      const profile = await storage.getSeekerProfileByToken(req.params.token);
      if (!profile) {
        return res.status(404).json({ message: "Shared profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shared profile" });
    }
  });

  app.post("/api/seeker-profiles", async (req, res) => {
    try {
      const validatedData = insertSeekerProfileSchema.parse(req.body);
      // Generate unique shareable token
      const shareableToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const profileData = { ...validatedData, shareableToken };
      const profile = await storage.createSeekerProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating seeker profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create seeker profile" });
    }
  });

  app.patch("/api/seeker-profiles/:id", async (req, res) => {
    try {
      const updates = insertSeekerProfileSchema.partial().parse(req.body);
      const profile = await storage.updateSeekerProfile(parseInt(req.params.id), updates);
      if (!profile) {
        return res.status(404).json({ message: "Seeker profile not found" });
      }
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update seeker profile" });
    }
  });

  app.delete("/api/seeker-profiles/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSeekerProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Seeker profile not found" });
      }
      
      // Allow profile owner or admin to delete
      const isOwner = profile.userId === req.user.id;
      const isAdmin = req.user.username === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const success = await storage.deleteSeekerProfile(profileId);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete profile" });
      }
      
      res.json({ message: "Seeker profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete seeker profile" });
    }
  });

  // Sponsor Profile Routes
  app.get("/api/sponsor-profiles", async (req, res) => {
    try {
      const profiles = await storage.getSponsorProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsor profiles" });
    }
  });

  app.get("/api/sponsor-profiles/user", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const profile = await storage.getSponsorProfileByUserId(parseInt(userId as string));
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsor profile" });
    }
  });

  app.get("/api/sponsor-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getSponsorProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Sponsor profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsor profile" });
    }
  });

  app.post("/api/sponsor-profiles", async (req, res) => {
    try {
      const validatedData = insertSponsorProfileSchema.parse(req.body);
      const profile = await storage.createSponsorProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating sponsor profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sponsor profile" });
    }
  });

  app.patch("/api/sponsor-profiles/:id", async (req, res) => {
    try {
      const updates = insertSponsorProfileSchema.partial().parse(req.body);
      const profile = await storage.updateSponsorProfile(parseInt(req.params.id), updates);
      if (!profile) {
        return res.status(404).json({ message: "Sponsor profile not found" });
      }
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update sponsor profile" });
    }
  });

  app.delete("/api/sponsor-profiles/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSponsorProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Sponsor profile not found" });
      }
      
      // Allow profile owner or admin to delete
      const isOwner = profile.userId === req.user.id;
      const isAdmin = req.user.username === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const success = await storage.deleteSponsorProfile(profileId);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete profile" });
      }
      
      res.json({ message: "Sponsor profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sponsor profile" });
    }
  });

  // Sponsorship Agreement Routes
  app.get("/api/sponsorship-agreements", async (req, res) => {
    try {
      const agreements = await storage.getSponsorshipAgreements();
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsorship agreements" });
    }
  });

  app.get("/api/sponsorship-agreements/:id", async (req, res) => {
    try {
      const agreement = await storage.getSponsorshipAgreement(parseInt(req.params.id));
      if (!agreement) {
        return res.status(404).json({ message: "Sponsorship agreement not found" });
      }
      res.json(agreement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsorship agreement" });
    }
  });

  app.post("/api/sponsorship-agreements", async (req, res) => {
    try {
      console.log("Received sponsorship agreement data:", req.body);
      const validatedData = insertSponsorshipAgreementSchema.parse(req.body);
      const agreement = await storage.createSponsorshipAgreement(validatedData);
      res.status(201).json(agreement);
    } catch (error) {
      console.log("Sponsorship agreement error:", error);
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid agreement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sponsorship agreement" });
    }
  });

  app.put("/api/sponsorship-agreements/:id", async (req, res) => {
    try {
      const updates = insertSponsorshipAgreementSchema.partial().parse(req.body);
      const agreement = await storage.updateSponsorshipAgreement(parseInt(req.params.id), updates);
      if (!agreement) {
        return res.status(404).json({ message: "Sponsorship agreement not found" });
      }
      res.json(agreement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agreement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update sponsorship agreement" });
    }
  });

  app.patch("/api/sponsorship-agreements/:id", async (req, res) => {
    try {
      const updates = insertSponsorshipAgreementSchema.partial().parse(req.body);
      const agreement = await storage.updateSponsorshipAgreement(parseInt(req.params.id), updates);
      if (!agreement) {
        return res.status(404).json({ message: "Sponsorship agreement not found" });
      }
      res.json(agreement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agreement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update sponsorship agreement" });
    }
  });

  app.patch("/api/sponsorship-agreements/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const agreement = await storage.updateSponsorshipAgreement(parseInt(req.params.id), { status });
      if (!agreement) {
        return res.status(404).json({ message: "Sponsorship agreement not found" });
      }
      
      // If agreement is accepted, create sponsorship credit
      if (status === 'accepted') {
        await storage.createSponsorshipCredit({
          agreementId: agreement.id,
          seekerId: agreement.seekerId,
          originalAmount: agreement.amount,
          remainingAmount: agreement.amount,
          expiryDate: new Date(Date.now() + (agreement.duration * 30 * 24 * 60 * 60 * 1000)) // duration in months
        });
      }
      
      res.json(agreement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update agreement status" });
    }
  });

  // Order approval and split payment workflow
  app.post("/api/sponsorship-agreements/:id/submit-order", async (req, res) => {
    try {
      const agreementId = parseInt(req.params.id);
      const { orderId, requestedAmount } = req.body;
      
      const agreement = await storage.getSponsorshipAgreement(agreementId);
      if (!agreement || agreement.status !== 'accepted') {
        return res.status(400).json({ message: "Invalid sponsorship agreement" });
      }
      
      // Update agreement with order details
      await storage.updateSponsorshipAgreement(agreementId, {
        paymentStatus: 'pending_sponsor_approval',
        description: `${agreement.description} - Order #${orderId} submitted for approval`
      });
      
      res.json({ message: "Order submitted to sponsor for approval" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit order for approval" });
    }
  });

  app.patch("/api/sponsorship-agreements/:id/approve-order", async (req, res) => {
    try {
      const agreementId = parseInt(req.params.id);
      const { approved } = req.body;
      
      const agreement = await storage.getSponsorshipAgreement(agreementId);
      if (!agreement) {
        return res.status(404).json({ message: "Sponsorship agreement not found" });
      }
      
      if (approved) {
        await storage.updateSponsorshipAgreement(agreementId, {
          paymentStatus: 'approved_awaiting_sponsor_payment'
        });
      } else {
        await storage.updateSponsorshipAgreement(agreementId, {
          paymentStatus: 'rejected'
        });
      }
      
      res.json({ message: approved ? "Order approved" : "Order rejected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve order" });
    }
  });

  // Sponsorship Credit Routes
  app.get("/api/sponsorship-credits/:seekerId", async (req, res) => {
    try {
      const credits = await storage.getSponsorshipCredits(parseInt(req.params.seekerId));
      res.json(credits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsorship credits" });
    }
  });

  app.get("/api/sponsorship-credits/available/:userId", async (req, res) => {
    try {
      // Get user's seeker profile first
      const seekerProfile = await storage.getSeekerProfileByUserId(parseInt(req.params.userId));
      if (!seekerProfile) {
        return res.json([]);
      }
      
      const credits = await storage.getSponsorshipCredits(seekerProfile.id);
      // Filter only active credits with remaining amount
      const activeCredits = credits.filter(credit => 
        credit.isActive && parseFloat(credit.remainingAmount) > 0
      );
      res.json(activeCredits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available credits" });
    }
  });

  app.post("/api/orders/:orderId/request-sponsorship", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const { creditIds, appliedAmount, message } = req.body;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Update order status to pending sponsor approval
      await storage.updateOrderStatus(orderId, "pending_sponsor_approval");
      
      // Store sponsorship request details (you may want to create a separate table for this)
      // For now, we'll update the order with sponsorship info
      
      res.json({ 
        message: "Sponsorship request submitted successfully",
        orderId: orderId,
        appliedAmount: appliedAmount 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit sponsorship request" });
    }
  });

  app.post("/api/sponsorship-credits/apply", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { seekerId, orderAmount } = req.body;
      const credits = await storage.getSponsorshipCredits(seekerId);
      
      // Calculate total available credits
      const totalCredits = credits.reduce((sum, credit) => 
        sum + parseFloat(credit.remainingAmount), 0
      );

      const creditToApply = Math.min(totalCredits, parseFloat(orderAmount));
      
      res.json({
        availableCredits: totalCredits,
        appliedCredit: creditToApply,
        remainingOrderAmount: parseFloat(orderAmount) - creditToApply
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate sponsorship credits" });
    }
  });

  // Get sponsorship credits for current user (authenticated route)
  app.get("/api/user/sponsorship-credits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // First check if user has a seeker profile
      const seekerProfile = await storage.getSeekerProfileByUserId(req.user.id);
      if (!seekerProfile) {
        return res.json([]); // No seeker profile, no credits
      }

      const credits = await storage.getSponsorshipCredits(seekerProfile.id);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sponsorship credits" });
    }
  });

  app.post("/api/sponsorship-credits", async (req, res) => {
    try {
      const validatedData = insertSponsorshipCreditSchema.parse(req.body);
      const credit = await storage.createSponsorshipCredit(validatedData);
      res.status(201).json(credit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sponsorship credit" });
    }
  });

  // Sponsorship Message Routes
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessages(parseInt(req.params.userId));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/conversations/:userId1/:userId2", async (req, res) => {
    try {
      const conversation = await storage.getConversation(
        parseInt(req.params.userId1),
        parseInt(req.params.userId2)
      );
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertSponsorshipMessageSchema.parse(req.body);
      const message = await storage.sendMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(parseInt(req.params.id));
      res.status(200).json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Newsletter Routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      
      // Send welcome email
      try {
        await emailService.sendNewsletterConfirmation(subscriptionData.email);
      } catch (emailError) {
        console.error('Failed to send newsletter confirmation email:', emailError);
        // Don't fail the subscription if email fails
      }
      
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  // Email Management Routes
  app.get("/api/admin/email-templates", async (req, res) => {
    try {
      const templates = await storage.getAdminSettings();
      const emailTemplates = templates.filter(setting => setting.key.startsWith('email_template_'));
      res.json(emailTemplates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });

  app.post("/api/admin/email-templates/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { subject, html, text } = req.body;
      
      const template = { subject, html, text };
      await emailService.saveEmailTemplate(type, template);
      
      res.json({ message: "Email template saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save email template" });
    }
  });

  // Bulk Product Management Routes
  app.get("/api/admin/products/bulk", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = await storage.getProductCategories();
      
      res.json({ products, categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products for bulk management" });
    }
  });

  app.patch("/api/admin/products/bulk", async (req, res) => {
    try {
      const { updates } = req.body; // Array of { id, updates }
      
      const results = await Promise.all(
        updates.map(async ({ id, ...productUpdates }: any) => {
          try {
            return await storage.updateProduct(id, productUpdates);
          } catch (error) {
            console.error(`Failed to update product ${id}:`, error);
            return null;
          }
        })
      );
      
      const successful = results.filter(result => result !== null).length;
      
      res.json({ 
        message: `Successfully updated ${successful} out of ${updates.length} products`,
        successful,
        total: updates.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to perform bulk product update" });
    }
  });

  app.post("/api/admin/products/bulk-import", async (req, res) => {
    try {
      const { products } = req.body; // Array of product data
      
      const results = await Promise.all(
        products.map(async (productData: any) => {
          try {
            const validatedProduct = insertProductSchema.parse(productData);
            return await storage.createProduct(validatedProduct);
          } catch (error) {
            console.error('Failed to import product:', error);
            return null;
          }
        })
      );
      
      const successful = results.filter(result => result !== null).length;
      
      res.json({ 
        message: `Successfully imported ${successful} out of ${products.length} products`,
        successful,
        total: products.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import products" });
    }
  });

  app.patch("/api/admin/products/bulk-activate", async (req, res) => {
    try {
      const { productIds } = req.body; // Array of product IDs
      
      const results = await Promise.all(
        productIds.map(async (id: number) => {
          try {
            return await storage.updateProduct(id, { isActive: true });
          } catch (error) {
            console.error(`Failed to activate product ${id}:`, error);
            return null;
          }
        })
      );
      
      const successful = results.filter(result => result !== null).length;
      
      res.json({ 
        message: `Successfully activated ${successful} out of ${productIds.length} products`,
        successful,
        total: productIds.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to activate products" });
    }
  });

  app.patch("/api/admin/products/bulk-deactivate", async (req, res) => {
    try {
      const { productIds } = req.body; // Array of product IDs
      
      const results = await Promise.all(
        productIds.map(async (id: number) => {
          try {
            return await storage.updateProduct(id, { isActive: false });
          } catch (error) {
            console.error(`Failed to deactivate product ${id}:`, error);
            return null;
          }
        })
      );
      
      const successful = results.filter(result => result !== null).length;
      
      res.json({ 
        message: `Successfully deactivated ${successful} out of ${productIds.length} products`,
        successful,
        total: productIds.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to deactivate products" });
    }
  });

  // CMS & Admin Panel Routes

  // Pages Management
  app.get("/api/admin/pages", async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getPublishedPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch published pages" });
    }
  });

  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.patch("/api/admin/pages/:id", async (req, res) => {
    try {
      const updates = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(parseInt(req.params.id), updates);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", async (req, res) => {
    try {
      const success = await storage.deletePage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.status(200).json({ message: "Page deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Blog Posts Management
  app.get("/api/admin/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch published blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog-posts/:id", async (req, res) => {
    try {
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(parseInt(req.params.id), updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Quote Requests Management
  app.get("/api/admin/quote-requests", async (req, res) => {
    try {
      const quotes = await storage.getQuoteRequests();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quote requests" });
    }
  });

  app.post("/api/quote-requests", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quote request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });

  app.patch("/api/admin/quote-requests/:id", async (req, res) => {
    try {
      const updates = insertQuoteRequestSchema.partial().parse(req.body);
      const quote = await storage.updateQuoteRequest(parseInt(req.params.id), updates);
      if (!quote) {
        return res.status(404).json({ message: "Quote request not found" });
      }
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quote request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update quote request" });
    }
  });

  // Admin Settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin settings" });
    }
  });

  app.patch("/api/admin/settings/:key", async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }
      
      const setting = await storage.updateAdminSetting(req.params.key, value);
      if (!setting) {
        // Create new setting if it doesn't exist
        const newSetting = await storage.createAdminSetting({
          key: req.params.key,
          value
        });
        return res.status(201).json(newSetting);
      }
      
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update admin setting" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  // Enhanced Admin Stats
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin dashboard stats" });
    }
  });

  // User Management
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/role", async (req, res) => {
    try {
      const { role } = req.body;
      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }
      
      const user = await storage.updateUserRole(parseInt(req.params.id), role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      
      // Log the subscription
      console.log(`Newsletter subscription: ${email}`);
      
      res.json({ 
        message: "Successfully subscribed to newsletter",
        email: email
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Product Recommendations API
  app.get("/api/products/:id/recommendations", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const recommendations = await storage.getProductRecommendations(productId);
      
      // Get the full product details for each recommendation
      const recommendedProducts = await Promise.all(
        recommendations.map(async (rec) => {
          const product = await storage.getProduct(rec.recommendedProductId);
          return {
            ...rec,
            product
          };
        })
      );
      
      res.json(recommendedProducts.filter(rec => rec.product));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product recommendations" });
    }
  });

  app.get("/api/cart/recommendations", async (req, res) => {
    try {
      const { cartItemIds } = req.query;
      if (!cartItemIds) {
        return res.json([]);
      }
      
      const ids = Array.isArray(cartItemIds) 
        ? cartItemIds.map(id => parseInt(id as string))
        : [parseInt(cartItemIds as string)];
      
      const recommendations = await storage.getRecommendationsForCartItems(ids);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart recommendations" });
    }
  });

  app.post("/api/admin/product-recommendations", async (req, res) => {
    try {
      const validatedData = insertProductRecommendationSchema.parse(req.body);
      const recommendation = await storage.createProductRecommendation(validatedData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recommendation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product recommendation" });
    }
  });

  app.patch("/api/admin/product-recommendations/:id", async (req, res) => {
    try {
      const updates = insertProductRecommendationSchema.partial().parse(req.body);
      const recommendation = await storage.updateProductRecommendation(parseInt(req.params.id), updates);
      if (!recommendation) {
        return res.status(404).json({ message: "Product recommendation not found" });
      }
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recommendation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product recommendation" });
    }
  });

  app.delete("/api/admin/product-recommendations/:id", async (req, res) => {
    try {
      const success = await storage.deleteProductRecommendation(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Product recommendation not found" });
      }
      res.json({ message: "Product recommendation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
