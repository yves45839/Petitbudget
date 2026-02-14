import { ShoppingCart, Search, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiProduct, fetchProducts } from "../lib/products";
import { BRAND_ASSETS, BRAND_NAME } from "../lib/branding";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type HeaderProps = {
  onSearch: (query: string, productId?: number) => void;
};

export function Header({ onSearch }: HeaderProps) {
  const [cartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [mediaBaseUrl, setMediaBaseUrl] = useState(window.location.origin);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const { products: loadedProducts, mediaBaseUrl: resolvedMediaBaseUrl } =
          await fetchProducts();
        if (isMounted) {
          setProducts(loadedProducts);
          setMediaBaseUrl(resolvedMediaBaseUrl);
        }
      } catch {
        // Le reste de l'application gère déjà les états d'erreur.
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const suggestions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return products
      .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [products, searchQuery]);

  const submitSearch = (query: string, productId?: number) => {
    const normalized = query.trim();
    if (!normalized) {
      return;
    }

    onSearch(normalized, productId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-white to-red-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-md">
              <ImageWithFallback
                src={BRAND_ASSETS.logo}
                alt={`Logo ${BRAND_NAME}`}
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-2xl text-transparent">
                  {BRAND_NAME}
                </h1>
                <p className="text-xs text-gray-600">La sécurité n'est plus un luxe</p>
              </div>
            </div>
          </div>

          <div className="mx-8 max-w-2xl flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    submitSearch(searchQuery);
                  }
                }}
                className="w-full rounded-full border-2 border-white bg-white/90 px-6 py-3 pr-12 shadow-md backdrop-blur-sm focus:border-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => submitSearch(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-red-600 p-2 text-white transition-all hover:shadow-lg"
              >
                <Search className="h-5 w-5" />
              </button>

              {isOpen && suggestions.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                  {suggestions.map((product) => {
                    const imageUrl = product.image_url
                      ? new URL(product.image_url, mediaBaseUrl).toString()
                      : undefined;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setSearchQuery(product.name);
                          submitSearch(product.name, product.id);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-gray-100"
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                          <ImageWithFallback
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="line-clamp-1 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.brand || "Sans marque"} · {product.category || "Autres"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-md transition-all hover:shadow-lg">
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Compte</span>
            </button>
            <button className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-white shadow-md transition-all hover:shadow-lg">
              <ShoppingCart className="h-5 w-5" />
              <span>{cartCount},00</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="rounded-t-3xl bg-gradient-to-r from-gray-900 to-gray-800">
          <ul className="flex items-center justify-center gap-1 px-4 py-3">
            <li>
              <a
                href="#"
                className="inline-block rounded-full bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
              >
                Kits Vidéosurveillance
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Caméras de Surveillance
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Alarmes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Interphone Vidéo
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-block rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-white transition-all hover:shadow-lg"
              >
                Déstockage
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
