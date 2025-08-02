import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Link, useParams } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, LogOut, Store, ArrowLeft, Trash2, Plus, Minus, Search, Star, Heart, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, type Item, type Cart, type Order } from "./services/api";

const queryClient = new QueryClient();

// Auth Context
const AuthContext = createContext<any>(null);
const useAuth = () => useContext(AuthContext);

// Login Page
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.login(username, password);
      toast({
        title: "Login successful",
        description: "Welcome to TechMart!",
      });
      navigate('/products');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <Card className="w-full max-w-md p-8">
        <CardTitle className="text-2xl text-center mb-6">Welcome to TechMart</CardTitle>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo credentials: admin / techmart123</p>
        </div>
      </Card>
    </div>
  );
}

// Products Page
function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Furniture', 'Food & Beverages', 'Home & Garden', 'Sports & Fitness'];

  useEffect(() => {
    loadItems();
    loadCartCount();
  }, []);

  const loadItems = async () => {
    try {
      const response = await apiService.getItems();
      setItems(response.items);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const response = await apiService.getCart();
      const totalItems = response.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      // Cart might be empty, set count to 0
      setCartCount(0);
    }
  };

  const handleAddToCart = async (itemId: number) => {
    try {
      await apiService.addToCart(itemId, 1);
      // Update cart count immediately
      setCartCount(prev => prev + 1);
      toast({
        title: "Success",
        description: "Item added to cart!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedItems = items
    .filter(item => 
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading TechMart products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            TechMart Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover cutting-edge technology and premium products for the modern lifestyle
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-lg p-4">
          <div className="flex gap-4">
            <Button onClick={() => navigate('/cart')} variant="outline" className="relative group hover:bg-purple-50">
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:text-purple-600" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button onClick={() => navigate('/orders')} variant="outline" className="group hover:bg-purple-50">
              <Package className="w-4 h-4 mr-2 group-hover:text-purple-600" />
              Orders
            </Button>
            <Button onClick={() => {
              apiService.clearToken();
              navigate('/');
            }} variant="outline" className="group hover:bg-purple-50">
              <LogOut className="w-4 h-4 mr-2 group-hover:text-purple-600" />
              Logout
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Welcome to TechMart! 🚀
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </div>
                {item.in_stock ? (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold ml-1">{item.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </div>
                </div>
                <CardTitle className="text-xl mb-3 font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {item.name}
                </CardTitle>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ${item.price.toLocaleString()}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item.id)}
                    size="sm"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or browse all categories.</p>
          </div>
        )}

        {/* Results Summary */}
        {filteredAndSortedItems.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredAndSortedItems.length} of {items.length} products
          </div>
        )}
      </div>
    </div>
  );
}

// Cart Page
function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await apiService.getCart();
      setCart(response.cart);
    } catch (error: any) {
      if (error.message.includes('Cart not found')) {
        setCart({ id: 0, user_id: 0, items: [] });
      } else {
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await apiService.removeFromCart(itemId);
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
      // Reload cart to update the UI
      loadCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await apiService.createOrder();
      toast({
        title: "Order successful!",
        description: `Order #${response.order_id} created with total: $${response.total.toFixed(2)}`,
      });
      navigate('/orders');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const total = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your TechMart Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your selected items and proceed to checkout
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/products')} variant="outline" className="group hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:text-purple-600" />
              Back to Products
            </Button>
          </div>
          <Button onClick={() => navigate('/orders')} variant="outline" className="group hover:bg-purple-50">
            <Package className="w-4 h-4 mr-2 group-hover:text-purple-600" />
            View Orders
          </Button>
        </div>

        {cart?.items.length === 0 ? (
          <Card className="p-12 text-center bg-white shadow-xl rounded-2xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some amazing TechMart products to get started!</p>
            <Button onClick={() => navigate('/products')} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            {cart?.items.map((item) => (
              <Card key={item.id} className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={item.item.image}
                      alt={item.item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.item.name}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.item.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${item.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toLocaleString()} each
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveFromCart(item.item_id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Checkout Section */}
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl">
              <div className="flex justify-between items-center text-2xl font-bold mb-6">
                <span className="text-gray-900">Total:</span>
                <span className="text-green-600">${total.toLocaleString()}</span>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={handleCheckout} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  🚀 Proceed to Checkout
                </Button>
                <Button 
                  onClick={() => navigate('/products')} 
                  variant="outline" 
                  className="w-full py-4 text-lg rounded-xl"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Orders Page
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    loadCartCount();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.getOrders();
      setOrders(response.orders);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const response = await apiService.getCart();
      const totalItems = response.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      setCartCount(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your TechMart Orders
          </h1>
          <p className="text-xl text-gray-600">
            Track your purchase history and order status
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/products')} variant="outline" className="group hover:bg-purple-50">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:text-purple-600" />
              Back to Products
            </Button>
          </div>
          <Button onClick={() => navigate('/cart')} variant="outline" className="relative group hover:bg-purple-50">
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:text-purple-600" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center bg-white shadow-xl rounded-2xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">No orders yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start shopping to see your order history!</p>
            <Button onClick={() => navigate('/products')} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-8 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.id}</h3>
                    <p className="text-gray-600 text-lg">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${order.total.toLocaleString()}
                    </div>
                    <span className="text-sm text-gray-500 bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items:</h4>
                  {order.cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{item.item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-600">
                          ${item.price.toLocaleString()}
                        </span>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toLocaleString()} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
