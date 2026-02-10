import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Brands } from "./components/Brands";
import { Features } from "./components/Features";
import { Products } from "./components/Products";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ProductDetailPage } from "./components/ProductDetailPage";

const getProductIdFromPath = (pathname: string): number | null => {
  const matches = pathname.match(/^\/produits\/(\d+)\/?$/);
  if (!matches) {
    return null;
  }

  return Number(matches[1]);
};

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const selectedProductId = useMemo(() => getProductIdFromPath(pathname), [pathname]);

  const goToProductDetail = (productId: number) => {
    window.history.pushState({}, "", `/produits/${productId}`);
    setPathname(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHome = () => {
    window.history.pushState({}, "", "/");
    setPathname(window.location.pathname);
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
