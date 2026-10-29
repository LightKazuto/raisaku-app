import { useState, useEffect } from "react";
import axios from "axios";
import PublicCatalog from "./pages/PublicCatalog";
import AdminDashboard from "./pages/AdminDashboard";
import LoginAdmin from "./pages/AdminLogin";

export default function App() {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState(() => {
    return localStorage.getItem("admin_token") ? "admin" : "catalog";
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/products");

      const formattedData = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        category_id: item.category_id,
        category: item.category_name || "Lainnya",
        description: item.description,
        price: item.price,
        image: item.image,
        available: item.is_available ?? true,
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data produk dari backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setView("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdminUser(null);
    setView("catalog");
  };

  if (view === "login") {
    return (
      <LoginAdmin
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setView("catalog")}
      />
    );
  }

  if (view === "admin") {
    return (
      <AdminDashboard
        onOpenCatalog={handleLogout}
        currentUser={adminUser}
        products={products}
        setProducts={setProducts}
        refreshProducts={fetchProducts}
        categories={categories}
        refreshCategories={fetchCategories}
        isLoading={isLoading}
      />
    );
  }

  return (
    <PublicCatalog
      onOpenAdmin={() =>
        setView(localStorage.getItem("admin_token") ? "admin" : "login")
      }
      products={products}
      categories={categories}
      isLoading={isLoading}
    />
  );
}
