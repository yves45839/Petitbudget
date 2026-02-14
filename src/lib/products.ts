const REMOTE_API_URL = "https://samr.pythonanywhere.com/api/products/";
const REMOTE_MEDIA_BASE_URL = new URL(REMOTE_API_URL).origin;

const API_SOURCES: Array<{
  url: string;
  mediaBaseUrl: string;
  parser: "json" | "text";
}> = [
  {
    url: "/api/products/?page_size=100",
    mediaBaseUrl: window.location.origin,
    parser: "json",
  },
  {
    url: `${REMOTE_API_URL}?page_size=100`,
    mediaBaseUrl: REMOTE_MEDIA_BASE_URL,
    parser: "json",
  },
  {
    url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
      `${REMOTE_API_URL}?page_size=100`,
    )}`,
    mediaBaseUrl: REMOTE_MEDIA_BASE_URL,
    parser: "text",
  },
  {
    url: `https://corsproxy.io/?${encodeURIComponent(
      `${REMOTE_API_URL}?page_size=100`,
    )}`,
    mediaBaseUrl: REMOTE_MEDIA_BASE_URL,
    parser: "text",
  },
];

export type ApiProduct = {
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
  online?: boolean | number | string | null;
  is_online?: boolean | number | string | null;
  updated_at: string;
};

type ApiResponse = {
  count: number;
  results: ApiProduct[];
};

export type ProductsResult = {
  products: ApiProduct[];
  mediaBaseUrl: string;
};

let productsCache: ProductsResult | null = null;
let productsPromise: Promise<ProductsResult> | null = null;

const fetchFromSource = async (
  source: (typeof API_SOURCES)[number],
): Promise<ProductsResult> => {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Source indisponible: ${source.url}`);
  }

  const payload =
    source.parser === "json"
      ? ((await response.json()) as ApiResponse | ApiProduct[])
      : (JSON.parse(await response.text()) as ApiResponse | ApiProduct[]);
  const products = normalizeProducts(payload);

  if (products.length === 0) {
    throw new Error(`Aucun produit disponible sur ${source.url}`);
  }

  return { products, mediaBaseUrl: source.mediaBaseUrl };
};

export const fetchProducts = async (): Promise<ProductsResult> => {
  if (productsCache) {
    return productsCache;
  }

  if (!productsPromise) {
    const sourcesToTry = [...API_SOURCES];

    productsPromise = Promise.any(sourcesToTry.map((source) => fetchFromSource(source)))
      .then((result) => {
        productsCache = result;
        return result;
      })
      .catch(() => {
        throw new Error("Impossible de récupérer les produits pour le moment.");
      })
      .finally(() => {
        productsPromise = null;
      });
  }

  return productsPromise;
};

const normalizeProducts = (payload: ApiResponse | ApiProduct[]): ApiProduct[] => {
  const getOnlineFlag = (product: ApiProduct): boolean | number | string | null | undefined => {
    if (product.online !== undefined) {
      return product.online;
    }

    return product.is_online;
  };

  const isOnline = (product: ApiProduct) => {
    const onlineFlag = getOnlineFlag(product);

    if (typeof onlineFlag === "boolean") {
      return onlineFlag;
    }

    if (typeof onlineFlag === "number") {
      return onlineFlag === 1;
    }

    if (typeof onlineFlag === "string") {
      const normalizedOnline = onlineFlag.trim().toLowerCase();
      return ["1", "true", "yes", "on"].includes(normalizedOnline);
    }

    return false;
  };

  if (Array.isArray(payload)) {
    return payload.filter(isOnline);
  }

  if (Array.isArray(payload.results)) {
    return payload.results.filter(isOnline);
  }

  return [];
};
