import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Products() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les produits.");
        }
        const data: ApiResponse = await response.json();
        if (isMounted) {
          setProducts(data.results ?? []);
        }
      } catch (caughtError) {
        if (isMounted) {
          const message =
            caughtError instanceof Error
              ? caughtError.message
              : "Une erreur est survenue.";
          setError(message);
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

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl mb-8">BONNES AFFAIRES DU JOUR</h2>

        {isLoading ? (
          <div className="text-center text-gray-500 py-12">
            Chargement des produits...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.image_url
                ? new URL(product.image_url, API_URL).toString()
                : undefined;
              const priceLabel = priceFormatter.format(
                Number(product.sale_price ?? 0),
              );
              const inStock = product.stock_quantity > 0;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-3xl m-4">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    {product.brand && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm">
                        {product.brand}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg mb-2 line-clamp-2 h-14">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Ref : {product.sku || product.barcode || "N/A"}
                    </p>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                        {priceLabel}
                      </span>
                      <span className="text-sm text-gray-600">FCFA</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      Stock : {product.stock_quantity}
                    </p>

                    {inStock ? (
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Ajouter
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-full hover:shadow-lg transition-all">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-full cursor-not-allowed">
                        Rupture de stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const API_URL = "https://samr.pythonanywhere.com/api/products/";

type ApiProduct = {
  id: number;
  sku: string | null;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  barcode: string | null;
  sale_price: string | null;
  purchase_price: string | null;
  stock_quantity: number;
  image_url: string | null;
  updated_at: string;
};

type ApiResponse = {
  count: number;
  results: ApiProduct[];
};
