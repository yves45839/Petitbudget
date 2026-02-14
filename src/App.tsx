import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Brands } from "./components/Brands";
import { Features } from "./components/Features";
import { Products } from "./components/Products";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { SearchResultsPage } from "./components/SearchResultsPage";

const PRODUCT_ROUTE_PATTERN = /^\/produits\/(\d+)(?:-[^/]+)?\/?$/;

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

  return `${window.location.pathname}${window.location.search}`;
};

const getSearchStateFromRoute = (route: string) => {
  if (!route.startsWith("/recherche")) {
    return null;
  }

  const url = new URL(route, window.location.origin);
  const query = url.searchParams.get("q") ?? "";
  const productId = Number(url.searchParams.get("id"));

  return {
    query,
    productId: Number.isFinite(productId) ? productId : undefined,
  };
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
  const searchState = useMemo(() => getSearchStateFromRoute(route), [route]);

  const goToProductDetail = (productId: number, productReference: string) => {
    const referenceSlug = toSlug(productReference) || "sans-reference";
    window.history.pushState({}, "", `/#/produits/${productId}-${referenceSlug}`);
    setRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSearchResults = (query: string, productId?: number) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (productId) {
      params.set("id", String(productId));
    }

    window.history.pushState({}, "", `/#/recherche?${params.toString()}`);
    setRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHome = () => {
    window.history.pushState({}, "", "/#/");
    setRoute(getCurrentRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDetailPage = selectedProductId !== null;
  const isSearchPage = searchState !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Header onSearch={goToSearchResults} />
      {isDetailPage ? (
        <ProductDetailPage productId={selectedProductId} onBack={goToHome} />
      ) : isSearchPage ? (
        <SearchResultsPage
          query={searchState.query}
          selectedProductId={searchState.productId}
          onProductClick={goToProductDetail}
        />
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
