export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      products: "Products",
      design: "Design",
      groupOrders: "Group Orders",
      sponsorship: "Sponsorship",
      about: "About",
      contact: "Contact",
      cart: "Cart",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      admin: "Admin"
    },
    
    // Common
    common: {
      loading: "Loading...",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      remove: "Remove",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      subtotal: "Subtotal",
      continue: "Continue",
      back: "Back",
      next: "Next",
      finish: "Finish"
    },

    // Products
    products: {
      title: "Products",
      subtitle: "Browse our complete collection of premium custom athletic apparel",
      categories: "Categories",
      sortBy: "Sort by",
      searchPlaceholder: "Search products...",
      noResults: "No products found",
      noResultsDesc: "Try adjusting your search criteria or browse all categories",
      showAll: "Show All Products",
      addToCart: "Add to Cart",
      customize: "Customize",
      viewDetails: "View Details",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      sizes: "Sizes",
      colors: "Colors"
    },

    // Design Tool
    design: {
      title: "Design Tool",
      subtitle: "Create custom designs for your athletic apparel",
      selectProduct: "Select a product to start designing",
      canvas: "Canvas",
      elements: "Elements",
      text: "Text",
      shapes: "Shapes",
      images: "Images",
      colors: "Colors",
      fonts: "Fonts",
      layers: "Layers",
      save: "Save Design",
      preview: "Preview",
      download: "Download"
    },

    // Cart & Checkout
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDesc: "Start shopping to add items to your cart",
      startShopping: "Start Shopping",
      checkout: "Checkout",
      removeItem: "Remove item",
      updateQuantity: "Update quantity"
    },

    checkout: {
      title: "Checkout",
      shipping: "Shipping Information",
      payment: "Payment Information",
      review: "Review Order",
      complete: "Complete Order",
      processing: "Processing...",
      success: "Order placed successfully!",
      error: "There was an error processing your order"
    },

    // Group Orders
    groupOrders: {
      title: "Group Orders",
      subtitle: "Coordinate team orders with ease",
      create: "Create Group Order",
      join: "Join Group Order",
      manage: "Manage Orders",
      deadline: "Order Deadline",
      minimumQuantity: "Minimum Quantity",
      currentParticipants: "Current Participants"
    },

    // Sponsorship
    sponsorship: {
      title: "Sponsorship Platform",
      subtitle: "Connect teams with sponsors",
      seekers: "Teams Seeking Sponsorship",
      sponsors: "Available Sponsors",
      createProfile: "Create Profile",
      viewProfile: "View Profile",
      sendMessage: "Send Message",
      makeOffer: "Make Offer"
    },

    // Admin
    admin: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      products: "Products",
      categories: "Categories",
      orders: "Orders",
      users: "Users",
      settings: "Settings",
      analytics: "Analytics"
    },

    // Forms
    forms: {
      required: "This field is required",
      email: "Please enter a valid email address",
      password: "Password must be at least 8 characters",
      confirmPassword: "Passwords do not match",
      phone: "Please enter a valid phone number"
    },

    // Footer
    footer: {
      company: "Company",
      products: "Products",
      support: "Support",
      legal: "Legal",
      newsletter: "Newsletter",
      newsletterDesc: "Subscribe to get updates on new products and offers",
      subscribe: "Subscribe",
      allRightsReserved: "All rights reserved"
    }
  },

  es: {
    // Navigation
    nav: {
      home: "Inicio",
      products: "Productos",
      design: "Diseño",
      groupOrders: "Pedidos Grupales",
      sponsorship: "Patrocinio",
      about: "Acerca de",
      contact: "Contacto",
      cart: "Carrito",
      login: "Iniciar Sesión",
      signup: "Registrarse",
      logout: "Cerrar Sesión",
      admin: "Admin"
    },

    // Common
    common: {
      loading: "Cargando...",
      search: "Buscar",
      filter: "Filtrar",
      clear: "Limpiar",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      add: "Agregar",
      remove: "Quitar",
      price: "Precio",
      quantity: "Cantidad",
      total: "Total",
      subtotal: "Subtotal",
      continue: "Continuar",
      back: "Atrás",
      next: "Siguiente",
      finish: "Finalizar"
    },

    // Products
    products: {
      title: "Productos",
      subtitle: "Explora nuestra colección completa de ropa deportiva personalizada premium",
      categories: "Categorías",
      sortBy: "Ordenar por",
      searchPlaceholder: "Buscar productos...",
      noResults: "No se encontraron productos",
      noResultsDesc: "Intenta ajustar tus criterios de búsqueda o explorar todas las categorías",
      showAll: "Mostrar Todos los Productos",
      addToCart: "Agregar al Carrito",
      customize: "Personalizar",
      viewDetails: "Ver Detalles",
      inStock: "En Stock",
      outOfStock: "Agotado",
      sizes: "Tallas",
      colors: "Colores"
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;