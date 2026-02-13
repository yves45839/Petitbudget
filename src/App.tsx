import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Brands } from "./components/Brands";
import { Features } from "./components/Features";
import { Products } from "./components/Products";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ProductDetailPage } from "./components/ProductDetailPage";

const PRODUCT_ROUTE_PATTERN = /^\/produits\/(\d+)\/?$/;

const getProductIdFromRoute = (route: string): number | null => {
  const matches = route.match(PRODUCT_ROUTE_PATTERN);
  if (!matches) {
    return null;
  }

  return Number(matches[1]);
};

const getCurrentRoute = () => {
  if (window.location.hash.startsWith("#/")) {
    return window.location.hash.slice(1);
  }

  return window.location.pathname;
};

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute());

  useEffect(() => {
    const handleNavigation = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  const selectedProductId = useMemo(() => getProductIdFromRoute(route), [route]);

  const goToProductDetail = (productId: number) => {
    window.history.pushState({}, "", `/#/produits/${productId}`);
    setRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHome = () => {
    window.history.pushState({}, "", "/#/");
    setRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDetailPage = selectedProductId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Header />
      {isDetailPage ? (
        <ProductDetailPage productId={selectedProductId} onBack={goToHome} />
      ) : (
        <>
          <Hero />
          <Brands />
          <Features />
          <Products onProductClick={goToProductDetail} />
        </>
      )}
      <Footer />
      <WhatsAppButton phoneNumber="+225 07 58 00 00 45" />
    </div>
  );
}
