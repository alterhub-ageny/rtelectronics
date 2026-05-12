const BASE = "/api";

function getToken() {
  try { return localStorage.getItem("rt-token"); } catch { return null; }
}

async function fetchJSON(url, options = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const extra = url.startsWith("/admin/") ? { cache: "no-store" } : {};

  const res = await fetch(`${BASE}${url}`, { headers, ...extra, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API Error: ${res.status}`);
  return data;
}

export const getCategories = () => fetchJSON("/categories");

export const getProducts = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") q.append(k, v); });
  return fetchJSON(`/products${q.toString() ? `?${q}` : ""}`);
};

export const getProduct = (id) => fetchJSON(`/products?id=${id}`);
export const getFeatured = () => fetchJSON("/products?featured=true");
export const getPromotions = () => fetchJSON("/promotions");

export const getProductsByIds = (ids) => {
  if (!ids?.length) return Promise.resolve([]);
  return fetchJSON(`/products?ids=${ids.join(",")}`);
};

/* Auth */
export const register = (data) => fetchJSON("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const login = (data) => fetchJSON("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const getMe = () => fetchJSON("/auth/me");
export const updateProfile = (data) => fetchJSON("/auth/profile", { method: "PUT", body: JSON.stringify(data) });
export const addAddress = (data) => fetchJSON("/auth/addresses", { method: "POST", body: JSON.stringify(data) });
export const deleteAddress = (id) => fetchJSON(`/auth/addresses/${id}`, { method: "DELETE" });

/* Orders */
export const getOrders = () => fetchJSON("/orders");
export const getOrder = (id) => fetchJSON(`/orders/${id}`);
export const createOrder = (data) => fetchJSON("/orders", { method: "POST", body: JSON.stringify(data) });
export const cancelOrder = (id) => fetchJSON(`/orders/${id}/cancel`, { method: "PUT" });

/* Reviews */
export const getReviews = (productId) => fetchJSON(`/reviews?productId=${productId}`);
export const submitReview = (data) => fetchJSON("/reviews", { method: "POST", body: JSON.stringify(data) });

/* Wishlist */
export const getWishlist = () => fetchJSON("/wishlist");
export const addToWishlist = (productId) => fetchJSON(`/wishlist/${productId}`, { method: "POST" });
export const removeFromWishlist = (productId) => fetchJSON(`/wishlist/${productId}`, { method: "DELETE" });

/* Coupons */
export const validateCoupon = (code, orderTotal) =>
  fetchJSON("/coupons/validate", { method: "POST", body: JSON.stringify({ code, orderTotal }) });

/* Contact */
export const submitContact = (data) => fetchJSON("/contact", { method: "POST", body: JSON.stringify(data) });

/* Newsletter */
export const subscribeNewsletter = (email) =>
  fetchJSON("/newsletter", { method: "POST", body: JSON.stringify({ email }) });

/* Admin */
export const adminGetOrders = (params) => fetchJSON(`/admin/orders?${new URLSearchParams(params)}`);
export const adminUpdateOrderStatus = (id, data) => fetchJSON(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify(data) });
export const adminGetProducts = (params) => fetchJSON(`/admin/products?${new URLSearchParams(params)}`);
export const adminCreateProduct = (data) => fetchJSON("/admin/products", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateProduct = (id, data) => fetchJSON(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteProduct = (id) => fetchJSON(`/admin/products/${id}`, { method: "DELETE" });
export const adminBulkDeleteProducts = (ids) => fetchJSON("/admin/products/bulk-delete", { method: "POST", body: JSON.stringify({ ids }) });
export const adminGetStats = () => fetchJSON("/admin/stats");
export const adminGetUsers = (params) => fetchJSON(`/admin/users?${new URLSearchParams(params)}`);
export const adminUpdateUser = (id, data) => fetchJSON(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteUser = (id) => fetchJSON(`/admin/users/${id}`, { method: "DELETE" });
export const adminGetContacts = () => fetchJSON("/admin/contacts");
export const adminMarkContactRead = (id) => fetchJSON(`/admin/contacts/${id}/read`, { method: "PUT" });
export const adminDeleteContact = (id) => fetchJSON(`/admin/contacts/${id}`, { method: "DELETE" });
export const adminGetSubscribers = () => fetchJSON("/admin/subscribers");
export const adminGetReviews = (params) => fetchJSON(`/admin/reviews?${new URLSearchParams(params)}`);
export const adminDeleteReview = (id) => fetchJSON(`/admin/reviews/${id}`, { method: "DELETE" });
export const adminGetCoupons = () => fetchJSON("/coupons");
export const adminCreateCoupon = (data) => fetchJSON("/coupons", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateCoupon = (id, data) => fetchJSON(`/admin/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteCoupon = (id) => fetchJSON(`/admin/coupons/${id}`, { method: "DELETE" });
export const adminGetSalesHistory = (days) => fetchJSON(`/admin/sales-history${days ? `?days=${days}` : ""}`);
export const adminSeed = () => fetchJSON("/admin/seed", { method: "POST" });

/* Admin: Categories */
export const adminCreateCategory = (data) => fetchJSON("/admin/categories", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateCategory = (id, data) => fetchJSON(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteCategory = (id) => fetchJSON(`/admin/categories/${id}`, { method: "DELETE" });

/* Admin: Stock */
export const adminGetLowStock = (threshold) => fetchJSON(`/admin/stock/low?threshold=${threshold || 5}`);
export const adminGetStockLog = () => fetchJSON("/admin/stock/log");
export const adminAdjustStock = (data) => fetchJSON("/admin/stock/adjust", { method: "POST", body: JSON.stringify(data) });

/* Admin: Expenses */
export const adminGetExpenses = () => fetchJSON("/admin/expenses");
export const adminCreateExpense = (data) => fetchJSON("/admin/expenses", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateExpense = (id, data) => fetchJSON(`/admin/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteExpense = (id) => fetchJSON(`/admin/expenses/${id}`, { method: "DELETE" });

/* Admin: Suppliers */
export const adminGetSuppliers = () => fetchJSON("/admin/suppliers");
export const adminCreateSupplier = (data) => fetchJSON("/admin/suppliers", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateSupplier = (id, data) => fetchJSON(`/admin/suppliers/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteSupplier = (id) => fetchJSON(`/admin/suppliers/${id}`, { method: "DELETE" });

/* Admin: Settings */
export const adminGetSettings = () => fetchJSON("/admin/settings");
export const adminUpdateSettings = (data) => fetchJSON("/admin/settings", { method: "PUT", body: JSON.stringify(data) });

/* Admin: Pages */
export const adminGetPages = () => fetchJSON("/admin/pages");
export const adminUpdatePage = (id, data) => fetchJSON(`/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(data) });

/* Chat */
export const createChatConversation = (data) => fetchJSON("/chat/conversations", { method: "POST", body: JSON.stringify(data) });
export const sendChatMessage = (data) => fetchJSON("/chat/messages", { method: "POST", body: JSON.stringify(data) });
export const getChatMessages = (conversationId) => fetchJSON(`/chat/messages/${conversationId}`);

/* Admin: Chat */
export const adminGetChatConversations = () => fetchJSON("/admin/chat/conversations");
export const adminGetChatMessages = (conversationId) => fetchJSON(`/admin/chat/messages/${conversationId}`);
export const adminReplyChat = (conversationId, message) => fetchJSON("/admin/chat/reply", { method: "POST", body: JSON.stringify({ conversationId, message }) });

/* Admin: Notifications */
export const adminGetNotifications = (unread) => fetchJSON(`/admin/notifications${unread ? "?unread=true" : ""}`);
export const adminCreateNotification = (data) => fetchJSON("/admin/notifications", { method: "POST", body: JSON.stringify(data) });
export const adminMarkNotificationRead = (id) => fetchJSON(`/admin/notifications/${id}/read`, { method: "PUT" });
