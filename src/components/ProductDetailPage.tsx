import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, MessageCircle, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ApiProduct, fetchProducts } from "../lib/products";
import { getDisplayPrices } from "../lib/pricing";

type ProductDetailPageProps = {
  productId: number;
  onBack: () => void;
};

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [mediaBaseUrl, setMediaBaseUrl] = useState<string>(window.location.origin);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceFormatter = useMemo(
    () => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { products, mediaBaseUrl: resolvedMediaBaseUrl } = await fetchProducts();
        if (!isMounted) {
          return;
        }

        const foundProduct = products.find((item) => item.id === productId) ?? null;
        setProduct(foundProduct);
        setMediaBaseUrl(resolvedMediaBaseUrl);

        if (!foundProduct) {
          setError("Produit introuvable.");
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

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const imageUrl = product?.image_url
    ? new URL(product.image_url, mediaBaseUrl).toString()
    : undefined;
  const inStock = (product?.stock_quantity ?? 0) > 0;
  const priceValue = Number(product?.sale_price ?? 0);
  const requiresPriceRequest = priceValue < 50;
  const { displayPrice, originalPrice } = getDisplayPrices(priceValue);
  const description = product?.description?.trim() ?? "";
  const normalizedBrand = product?.brand?.trim().toLowerCase();
  const isSupportedBrand = Boolean(
    normalizedBrand && ["hikvision", "dahua"].includes(normalizedBrand),
  );
  const datasheetPdfUrl =
    isSupportedBrand && description
      ? extractPdfUrl(description, mediaBaseUrl)
      : null;
  const descriptionWithoutPdfLink = description
    ? removeUrlFromText(description, datasheetPdfUrl)
    : "";

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white min-h-[70vh]">
      <div className="container mx-auto px-4">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux produits
        </button>

        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Chargement du produit...</div>
        ) : error || !product ? (
          <div className="text-center text-red-600 py-12">{error || "Produit introuvable."}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-6 lg:p-10 shadow-lg border border-gray-100">
            <div className="bg-gray-100 rounded-3xl overflow-hidden">
              <ImageWithFallback
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover aspect-square"
              />
            </div>

            <div>
              {product.brand && (
                <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm mb-4">
                  {product.brand}
                </div>
              )}

              <h1 className="text-3xl mb-2">{product.name}</h1>

              <p className="text-gray-500 mb-4">
                Référence : {product.sku || product.barcode || "N/A"}
              </p>

              {requiresPriceRequest ? (
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    Demande de prix
                  </span>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl text-gray-400 line-through">
                      {priceFormatter.format(originalPrice)}
                    </span>
                    <span className="text-sm text-gray-500">FCFA</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                      {priceFormatter.format(displayPrice)}
                    </span>
                    <span className="text-gray-600">FCFA</span>
                  </div>
                </div>
              )}

              <div className="mb-6 space-y-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {descriptionWithoutPdfLink || "Aucune description disponible pour ce produit."}
                </p>

                {datasheetPdfUrl && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <p className="text-sm font-medium text-blue-900 mb-3">
                      Documentation technique fabricant
                    </p>
                    <a
                      href={datasheetPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Voir la fiche technique (PDF)
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>


              {inStock ? (
                <div className="flex gap-3">
                  {requiresPriceRequest ? (
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Demande de prix
                    </button>
                  ) : (
                    <button className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </button>
                  )}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-full hover:shadow-lg transition-all">
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
        )}
      </div>
    </section>
  );
}

const PDF_URL_PATTERN = /(https?:\/\/[^\s)"']+)/gi;

const extractPdfUrl = (description: string, baseUrl: string): string | null => {
  const matches = description.match(PDF_URL_PATTERN);
  if (!matches) {
    return null;
  }

  for (const candidateUrl of matches) {
    try {
      const normalizedUrl = new URL(candidateUrl, baseUrl);
      if (normalizedUrl.pathname.toLowerCase().endsWith(".pdf")) {
        return normalizedUrl.toString();
      }
    } catch {
      // Ignore malformed URL and continue with next candidate.
    }
  }

  return null;
};

const removeUrlFromText = (description: string, pdfUrl: string | null): string => {
  if (!pdfUrl) {
    return description;
  }

  return description
    .replace(pdfUrl, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};
