import { useState, useEffect } from "react";
import axios from "axios";
import PublicCatalog from "./pages/PublicCatalog";
import AdminDashboard from "./pages/AdminDashboard";

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

  return view === "catalog" ? (
    <PublicCatalog onOpenAdmin={() => setView("admin")} products={products} />
  ) : (
    <AdminDashboard
      onOpenCatalog={() => setView("catalog")}
      products={products}
      setProducts={setProducts}
      refreshProducts={fetchProducts}
    />
  );
}
