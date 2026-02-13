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

export const fetchProducts = async (): Promise<ProductsResult> => {
  for (const source of API_SOURCES) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) {
        continue;
      }

      const payload =
        source.parser === "json"
          ? ((await response.json()) as ApiResponse | ApiProduct[])
          : (JSON.parse(await response.text()) as ApiResponse | ApiProduct[]);
      const products = normalizeProducts(payload);
      if (products.length > 0) {
        return { products, mediaBaseUrl: source.mediaBaseUrl };
      }
    } catch {
      // Ignore and try the next endpoint.
    }
  }

  throw new Error("Impossible de récupérer les produits pour le moment.");
};

const normalizeProducts = (payload: ApiResponse | ApiProduct[]): ApiProduct[] => {
  const isOnline = (product: ApiProduct) => {
    if (typeof product.online === "boolean") {
      return product.online;
    }

    if (typeof product.online === "number") {
      return product.online === 1;
    }

    if (typeof product.online === "string") {
      const normalizedOnline = product.online.trim().toLowerCase();
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
