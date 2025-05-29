import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductCategorySchema, insertProductSchema, insertDesignSchema, 
  insertCartItemSchema, insertOrderSchema, insertOrderItemSchema,
  insertGroupOrderSchema, insertGroupOrderItemSchema,
  type InsertGroupOrder
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Group Orders
  app.get("/api/group-orders", async (req, res) => {
    try {
      const { active } = req.query;
      let groupOrders;
      
      if (active === 'true') {
        groupOrders = await storage.getActiveGroupOrders();
      } else {
        groupOrders = await storage.getGroupOrders();
      }
      
      res.json(groupOrders);
    } catch (error) {
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
      const { name, productId, deadline, minimumQuantity, organizerUserId, description } = req.body;
      
      if (!name || !productId || !deadline || !organizerUserId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const groupOrderData = {
        name,
        productId: parseInt(productId),
        deadline: new Date(deadline),
        minimumQuantity: minimumQuantity || 10,
        organizerUserId: parseInt(organizerUserId),
        description: description || null,
        status: "active",
        currentQuantity: 0,
        paymentMode: "individual",
        totalEstimate: "0.00",
        organizerEmail: null,
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

  const httpServer = createServer(app);
  return httpServer;
}
