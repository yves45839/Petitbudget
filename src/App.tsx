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

type CartItem = {
  productId: number;
  reference: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

const PRODUCT_ROUTE_PATTERN = /^\/produits\/(\d+)(?:-[^/]+)?\/?$/;
const WHATSAPP_PHONE = "2250758000045";
const CART_STORAGE_KEY = "petitbudget-cart";

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

const buildCartConfirmationMessage = (cartItems: CartItem[]) => {
  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const lines = cartItems.map(
    (item, index) =>
      `${index + 1}. ${item.name} (Réf: ${item.reference}) x${item.quantity} - ${formatter.format(item.unitPrice)} FCFA`,
  );
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return [
    "Bonjour, je souhaite confirmer mon panier :",
    ...lines,
    "",
    `Total estimé : ${formatter.format(total)} FCFA`,
  ].join("\n");
};

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute());
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) {
        return [];
      }

      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item): item is CartItem =>
          typeof item?.productId === "number" &&
          typeof item?.reference === "string" &&
          typeof item?.name === "string" &&
          typeof item?.unitPrice === "number" &&
          typeof item?.quantity === "number" &&
          item.quantity > 0,
      );
    } catch {
      return [];
    }
  });

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
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

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

  const handleAddToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((currentItems) => {
      const existing = currentItems.find((cartItem) => cartItem.productId === item.productId);
      if (existing) {
        return currentItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const handleConfirmCart = () => {
    if (cartItems.length === 0) {
      return;
    }

    const message = buildCartConfirmationMessage(cartItems);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const isDetailPage = selectedProductId !== null;
  const isSearchPage = searchState !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Header
        onSearch={goToSearchResults}
        cartItems={cartItems}
        cartCount={cartCount}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onConfirmCart={handleConfirmCart}
      />
      {isDetailPage ? (
        <ProductDetailPage
          productId={selectedProductId}
          onBack={goToHome}
          onAddToCart={handleAddToCart}
        />
      ) : isSearchPage ? (
        <SearchResultsPage
          query={searchState.query}
          selectedProductId={searchState.productId}
          onProductClick={goToProductDetail}
        />
      ) : (
        <>
          <Brands />
          <Features />
          <Products onProductClick={goToProductDetail} onAddToCart={handleAddToCart} />
          <Hero />
        </>
      )}
      <Footer />
      <WhatsAppButton phoneNumber="+225 07 58 00 00 45" />
    </div>
  );
}
