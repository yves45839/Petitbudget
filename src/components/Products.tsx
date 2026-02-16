import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ApiProduct, fetchProducts, resolveAssetUrl } from "../lib/products";
import { getDisplayPrices } from "../lib/pricing";

type ProductsProps = {
  onProductClick: (productId: number, productReference: string) => void;
  onAddToCart: (item: {
    productId: number;
    reference: string;
    name: string;
    unitPrice: number;
  }) => void;
};

export function Products({ onProductClick, onAddToCart }: ProductsProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaBaseUrl, setMediaBaseUrl] = useState<string>(window.location.origin);
  const priceFormatter = useMemo(
    () => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }),
    [],
  );
  const groupedProducts = useMemo(() => {
    const collator = new Intl.Collator("fr", { sensitivity: "base" });
    const byBrand = new Map<string, Map<string, ApiProduct[]>>();

    for (const product of products) {
      const brand = product.brand?.trim() || "Sans marque";
      const category = product.category?.trim() || "Autres catégories";
      const brandBucket = byBrand.get(brand) ?? new Map<string, ApiProduct[]>();
      const categoryBucket = brandBucket.get(category) ?? [];

      categoryBucket.push(product);
      brandBucket.set(category, categoryBucket);
      byBrand.set(brand, brandBucket);
    }

    return Array.from(byBrand.entries())
      .sort(([brandA], [brandB]) => collator.compare(brandA, brandB))
      .map(([brand, categories]) => ({
        brand,
        categories: Array.from(categories.entries())
          .sort(([categoryA], [categoryB]) => collator.compare(categoryA, categoryB))
          .map(([category, categoryProducts]) => ({
            category,
            products: categoryProducts,
          })),
      }));
  }, [products]);

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
          <div className="space-y-10">
            {groupedProducts.map((brandGroup) => (
              <section key={brandGroup.brand} className="space-y-5">
                <h3 className="text-2xl border-b border-gray-200 pb-2">{brandGroup.brand}</h3>

                {brandGroup.categories.map((categoryGroup) => (
                  <div key={`${brandGroup.brand}-${categoryGroup.category}`} className="space-y-4">
                    <h4 className="text-lg text-gray-700">{categoryGroup.category}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryGroup.products.map((product) => {
                        const imageUrl = product.image_url
                          ? resolveAssetUrl(product.image_url, mediaBaseUrl)
                          : undefined;
                        const priceValue = Number(product.sale_price ?? 0);
                        const { displayPrice, originalPrice } = getDisplayPrices(priceValue);
                        const priceLabel = priceFormatter.format(displayPrice);
                        const originalPriceLabel = priceFormatter.format(originalPrice);
                        const requiresPriceRequest = priceValue < 50;
                        const inStock = product.stock_quantity > 0;
                        const productReference = product.sku || product.barcode || product.name;
                        const whatsappMessage = encodeURIComponent(
                          `Bonjour, je souhaite vérifier la disponibilité de ${product.name} (Réf: ${productReference}).`,
                        );
                        const whatsappUrl = `https://wa.me/2250758000045?text=${whatsappMessage}`;

                        const openProductDetails = () => {
                          onProductClick(product.id, productReference);
                        };
                        return (
                          <div
                            key={product.id}
                            role="button"
                            tabIndex={0}
                            onClick={openProductDetails}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                openProductDetails();
                              }
                            }}
                            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100 text-left"
                          >
                            <div className="relative aspect-square bg-gray-100 rounded-3xl m-4">
                              <ImageWithFallback
                                src={imageUrl}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover rounded-3xl"
                              />
                            </div>

                            <div className="p-6">
                              <h3 className="text-lg mb-2 line-clamp-2 h-14">{product.name}</h3>
                              <p className="text-sm text-gray-500 mb-4">
                                Ref : {productReference || "N/A"}
                              </p>

                              {requiresPriceRequest ? (
                                <div className="mb-4">
                                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                                    Demande de prix
                                  </span>
                                </div>
                              ) : (
                                <div className="mb-4">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg text-gray-400 line-through">
                                      {originalPriceLabel}
                                    </span>
                                    <span className="text-xs text-gray-500">FCFA</span>
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-3xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                      {priceLabel}
                                    </span>
                                    <span className="text-sm text-gray-600">FCFA</span>
                                  </div>
                                </div>
                              )}

                              {inStock ? (
                                <div className="flex gap-2">
                                  {requiresPriceRequest ? (
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(event) => event.stopPropagation()}
                                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                      <MessageCircle className="w-5 h-5" />
                                      Demande de prix
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onAddToCart({
                                          productId: product.id,
                                          reference: productReference,
                                          name: product.name,
                                          unitPrice: displayPrice,
                                        });
                                      }}
                                      className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                      <ShoppingCart className="w-5 h-5" />
                                      Ajouter
                                    </button>
                                  )}
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(event) => event.stopPropagation()}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-full hover:shadow-lg transition-all inline-flex items-center justify-center"
                                    aria-label={`Contacter le service commercial pour ${product.name}`}
                                  >
                                    <MessageCircle className="w-5 h-5" />
                                  </a>
                                </div>
                              ) : (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full inline-flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Demander la disponibilité
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
