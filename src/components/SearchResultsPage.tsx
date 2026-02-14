import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ApiProduct, fetchProducts } from "../lib/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getDisplayPrices } from "../lib/pricing";

type SearchResultsPageProps = {
  query: string;
  selectedProductId?: number;
  onProductClick: (productId: number, productReference: string) => void;
};

export function SearchResultsPage({
  query,
  selectedProductId,
  onProductClick,
}: SearchResultsPageProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [mediaBaseUrl, setMediaBaseUrl] = useState<string>(window.location.origin);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const priceFormatter = useMemo(
    () => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { products: loadedProducts, mediaBaseUrl: resolvedMediaBaseUrl } =
          await fetchProducts();
        if (isMounted) {
          setProducts(loadedProducts);
          setMediaBaseUrl(resolvedMediaBaseUrl);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : "Une erreur est survenue.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProduct = useMemo(() => {
    if (selectedProductId) {
      return products.find((product) => product.id === selectedProductId) ?? null;
    }

    const exactMatch = products.find((product) => product.name.toLowerCase() === normalizedQuery);
    if (exactMatch) {
      return exactMatch;
    }

    return products.find((product) => product.name.toLowerCase().includes(normalizedQuery)) ?? null;
  }, [normalizedQuery, products, selectedProductId]);

  const nameMatches = useMemo(
    () =>
      products
        .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 12),
    [normalizedQuery, products],
  );

  const similarProducts = useMemo(() => {
    if (!selectedProduct) {
      return nameMatches.filter((product) => product.id !== selectedProductId).slice(0, 8);
    }

    const byBrandOrCategory = products.filter((product) => {
      if (product.id === selectedProduct.id) {
        return false;
      }

      const sameBrand =
        selectedProduct.brand && product.brand &&
        selectedProduct.brand.toLowerCase() === product.brand.toLowerCase();
      const sameCategory =
        selectedProduct.category && product.category &&
        selectedProduct.category.toLowerCase() === product.category.toLowerCase();

      return Boolean(sameBrand || sameCategory);
    });

    if (byBrandOrCategory.length > 0) {
      return byBrandOrCategory.slice(0, 8);
    }

    return nameMatches.filter((product) => product.id !== selectedProduct.id).slice(0, 8);
  }, [nameMatches, products, selectedProduct, selectedProductId]);

  const renderProductCard = (product: ApiProduct) => {
    const imageUrl = product.image_url ? new URL(product.image_url, mediaBaseUrl).toString() : undefined;
    const priceValue = Number(product.sale_price ?? 0);
    const { displayPrice } = getDisplayPrices(priceValue);
    const priceLabel = priceFormatter.format(displayPrice);

    return (
      <button
        key={product.id}
        type="button"
        onClick={() => onProductClick(product.id, product.sku || product.barcode || product.name)}
        className="rounded-3xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow-lg"
      >
        <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <ImageWithFallback src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <h3 className="line-clamp-2 text-sm">{product.name}</h3>
        <p className="mt-2 text-xs text-gray-500">Ref : {product.sku || product.barcode || "N/A"}</p>
        <p className="mt-2 text-base text-red-600">{priceValue < 50 ? "Demande de prix" : `${priceLabel} FCFA`}</p>
      </button>
    );
  };

  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-blue-700">
            <Search className="h-5 w-5" />
            <h2 className="text-2xl">Résultats de recherche</h2>
          </div>
          <p className="text-gray-600">
            Recherche pour : <span className="font-semibold">{query || "-"}</span>
          </p>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-gray-500">Chargement des résultats...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-600">{error}</p>
        ) : (
          <div className="space-y-10">
            {selectedProduct ? (
              <div>
                <h3 className="mb-4 text-xl">Produit recherché</h3>
                <div className="max-w-sm">{renderProductCard(selectedProduct)}</div>
              </div>
            ) : (
              <p className="text-gray-600">Aucun produit précis trouvé pour cette recherche.</p>
            )}

            <div>
              <h3 className="mb-4 text-xl">Produits similaires</h3>
              {similarProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {similarProducts.map((product) => renderProductCard(product))}
                </div>
              ) : (
                <p className="text-gray-600">Aucun produit similaire disponible.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
