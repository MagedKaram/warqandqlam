import type { AddProductCartItemInput } from "@/types/cart";
import type { ProductCardProduct } from "@/types/product";

/**
 * Converts a storefront card model into the serializable product snapshot
 * expected by the cart store. Context-specific selections such as color stay
 * in the Product Details purchase flow instead of this card adapter.
 */
export function createProductCardCartInput(
  product: ProductCardProduct,
  quantity = 1,
): AddProductCartItemInput {
  return {
    productId: product.id,
    title: product.title,
    image: product.image,
    imageAlt: product.imageAlt ?? product.title,
    href: product.href,
    unitPrice: product.price,
    quantity,
  };
}
