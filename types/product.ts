export type Product = {
  id: string;
  image: string;
  title: string;
  price: number;
  href: string;
  currency?: string;
  isNew?: boolean;
  isWishlisted?: boolean;
  category?: string;
};

export type ProductCardBadgeTone = "success" | "discount";

/**
 * Serializable storefront view model shared by catalog and recommendation
 * cards. Product-detail and persisted cart-item models intentionally remain
 * separate because they own different interaction and storage concerns.
 */
export type ProductCardProduct = Product & {
  imageAlt?: string;
  oldPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeTone?: ProductCardBadgeTone;
  isAvailable?: boolean;
};

export type ProductFilterGroup = {
  id: string;
  title: string;
  options: {
    id: string;
    label: string;
    count?: number;
  }[];
};

export type ProductDetailTabId = "details" | "specs" | "reviews";

export type ProductDetailImage = {
  id: string;
  src: string;
  alt: string;
};

export type ProductColorOption = {
  id: string;
  label: string;
  value: string;
};

export type ProductServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: "truck" | "returns" | "wallet";
};

export type ProductAccordionItem = {
  id: string;
  title: string;
  content: string;
};

export type ProductSpecRow = {
  id: string;
  label: string;
  value: string;
};

export type ProductReview = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
};

export type RelatedProduct = ProductCardProduct &
  Required<Pick<ProductCardProduct, "rating" | "reviewCount">>;

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  brandHighlight: string;
  subtitle: string;
  badge: string;
  rating: number;
  reviewCount: number;
  soldText: string;
  price: number;
  oldPrice: number;
  currency: string;
  discountBadge: string;
  images: ProductDetailImage[];
  colors: ProductColorOption[];
  services: ProductServiceItem[];
  detailsText: string;
  accordions: ProductAccordionItem[];
  specs: ProductSpecRow[];
  reviews: ProductReview[];
  relatedProducts: RelatedProduct[];
  deliveryPromo: {
    image: string;
    imageAlt: string;
    title: string;
    subtitle: string;
    label: string;
  };
};
