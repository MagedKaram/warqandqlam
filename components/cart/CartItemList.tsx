"use client";

import { PrintingCartItemRow } from "@/components/cart/PrintingCartItemRow";
import { ProductCartItemRow } from "@/components/cart/ProductCartItemRow";
import type { CartItem } from "@/types/cart";

type CartItemListProps = {
  items: CartItem[];
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
};

export function CartItemList({
  items,
  onQuantityChange,
  onRemove,
}: CartItemListProps) {
  return (
    <div className="grid min-w-0 gap-4" data-cart-item-list>
      {items.map((item) =>
        item.kind === "product" ? (
          <ProductCartItemRow
            item={item}
            key={item.id}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ) : (
          <PrintingCartItemRow
            item={item}
            key={item.id}
            onRemove={onRemove}
          />
        ),
      )}
    </div>
  );
}
