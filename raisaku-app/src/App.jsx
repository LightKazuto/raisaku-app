import { useState, useEffect } from "react";
import axios from "axios";
import PublicCatalog from "./pages/PublicCatalog";
import AdminDashboard from "./pages/AdminDashboard";
import LoginAdmin from "./pages/AdminLogin";

export default function App() {
  const [view, setView] = useState("catalog");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");

      const formattedData = response.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        category:
          item.category_id === 1 || item.category_id === "1"
            ? "Abon"
            : "Puding",
        description: item.description,
        price: item.price,
        image: item.image,
        available: item.is_available ?? true,
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data dari backend:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (view === "login") {
    return (
      <LoginAdmin
        onLoginSuccess={() => setView("admin")}
        onCancel={() => setView("catalog")}
      />
    );
  }

  if (view === "admin") {
    return (
      <AdminDashboard
        onOpenCatalog={() => setView("catalog")}
        products={products}
        setProducts={setProducts}
        refreshProducts={fetchProducts}
      />
    );
  }

  return (
    <PublicCatalog onOpenAdmin={() => setView("login")} products={products} />
  );
}
