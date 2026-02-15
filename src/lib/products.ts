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
  technical_sheet_url?: string | null;
  datasheet_url?: string | null;
  fiche_technique_url?: string | null;
  product_url?: string | null;
  online?: boolean | number | string | null;
  is_online?: boolean | number | string | null;
  updated_at: string;
};

type ApiResponse = {
  count: number;
  results: ApiProduct[];
  next?: string | null;
  previous?: string | null;
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
  const mediaBaseUrl = inferMediaBaseUrl(payload, source.mediaBaseUrl);

  if (products.length === 0) {
    throw new Error(`Aucun produit disponible sur ${source.url}`);
  }

  return { products, mediaBaseUrl };
};

const inferMediaBaseUrl = (
  payload: ApiResponse | ApiProduct[],
  fallbackMediaBaseUrl: string,
): string => {
  if (Array.isArray(payload)) {
    return fallbackMediaBaseUrl;
  }

  const paginationCandidates = [payload.next, payload.previous];
  for (const candidate of paginationCandidates) {
    if (!candidate) {
      continue;
    }

    try {
      return new URL(candidate).origin;
    } catch {
      // Ignore malformed URL and keep searching.
    }
  }

  const firstImageUrl = payload.results.find((product) => Boolean(product.image_url))?.image_url;
  if (firstImageUrl) {
    try {
      const maybeAbsoluteImageUrl = new URL(firstImageUrl);
      return maybeAbsoluteImageUrl.origin;
    } catch {
      // Relative image URL, fallback to provided base URL.
    }
  }

  return fallbackMediaBaseUrl;
};

export const resolveAssetUrl = (
  rawAssetUrl: string | null | undefined,
  mediaBaseUrl: string,
): string | undefined => {
  if (!rawAssetUrl) {
    return undefined;
  }

  const cleanedUrl = rawAssetUrl.trim();
  if (!cleanedUrl) {
    return undefined;
  }

  const normalizedRawUrl = cleanedUrl.startsWith("//") ? `https:${cleanedUrl}` : cleanedUrl;

  try {
    const resolvedUrl = new URL(normalizedRawUrl, mediaBaseUrl);

    if (window.location.protocol === "https:" && resolvedUrl.protocol === "http:") {
      resolvedUrl.protocol = "https:";
    }

    return resolvedUrl.toString();
  } catch {
    return undefined;
  }
};

const DATASHEET_PATH_HINTS = ["sheet", "datasheet", "fiche", "tech", "doc", "manual"];

const isLikelyDatasheetUrl = (rawUrl: string): boolean => {
  const lowerCasedUrl = rawUrl.toLowerCase();

  if (lowerCasedUrl.includes(".pdf")) {
    return true;
  }

  return DATASHEET_PATH_HINTS.some((hint) => lowerCasedUrl.includes(hint));
};

export const resolveDatasheetUrlFromProduct = (
  product: ApiProduct,
  mediaBaseUrl: string,
): string | null => {
  const candidateKeys = [
    "technical_sheet_url",
    "datasheet_url",
    "fiche_technique_url",
    "product_url",
  ] as const;

  for (const key of candidateKeys) {
    const resolvedUrl = resolveAssetUrl(product[key], mediaBaseUrl);
    if (resolvedUrl && isLikelyDatasheetUrl(resolvedUrl)) {
      return resolvedUrl;
    }
  }

  return null;
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
