"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { ReactNode } from "react";
import {
  calculateCartTotals,
  getPrintingCartAggregate,
  selectCartLineCount,
  selectCartUnitCount,
} from "@/lib/cart/cart-calculations";
import {
  CART_STORAGE_KEY,
  getCartCoupon,
  normalizeCouponCode,
} from "@/lib/cart/cart-config";
import {
  deserializeCartStorageValue,
  loadCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart/cart-storage";
import type {
  AddPrintingCartItemInput,
  AddProductCartItemInput,
  CartItem,
  CartState,
  PrintingCartItem,
  ProductCartItem,
} from "@/types/cart";
import { createEmptyCartState } from "@/types/cart";

export type CartAction =
  | { type: "replace"; state: CartState }
  | { type: "add_product"; item: ProductCartItem }
  | { type: "add_printing"; item: PrintingCartItem }
  | { type: "remove_item"; itemId: string }
  | { type: "update_product_quantity"; itemId: string; quantity: number }
  | { type: "clear" }
  | { type: "set_coupon"; couponCode: string | null };

function normalizeQuantity(quantity: number) {
  return Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
}

function selectedColorsMatch(
  first: ProductCartItem["selectedColor"],
  second: ProductCartItem["selectedColor"],
) {
  return first?.id === second?.id;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "replace":
      return action.state;

    case "add_product": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.kind === "product" &&
          item.productId === action.item.productId &&
          selectedColorsMatch(item.selectedColor, action.item.selectedColor),
      );

      if (existingItemIndex === -1) {
        if (state.items.some((item) => item.id === action.item.id)) {
          return state;
        }

        return {
          ...state,
          items: [
            ...state.items,
            {
              ...action.item,
              quantity: normalizeQuantity(action.item.quantity),
            },
          ],
        };
      }

      const existingItem = state.items[existingItemIndex];

      if (existingItem.kind !== "product") {
        return state;
      }

      const nextItems = [...state.items];
      nextItems[existingItemIndex] = {
        ...action.item,
        id: existingItem.id,
        addedAt: existingItem.addedAt,
        quantity:
          existingItem.quantity + normalizeQuantity(action.item.quantity),
      };

      return { ...state, items: nextItems };
    }

    case "add_printing":
      if (state.items.some((item) => item.id === action.item.id)) {
        return state;
      }

      return { ...state, items: [...state.items, action.item] };

    case "remove_item":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.itemId),
      };

    case "update_product_quantity":
      return {
        ...state,
        items: state.items.map((item) =>
          item.kind === "product" && item.id === action.itemId
            ? { ...item, quantity: normalizeQuantity(action.quantity) }
            : item,
        ),
      };

    case "clear":
      return createEmptyCartState();

    case "set_coupon":
      return { ...state, couponCode: action.couponCode };
  }
}

function createCartItemId(prefix: CartItem["kind"]) {
  const randomId = globalThis.crypto?.randomUUID?.();

  if (randomId) {
    return `${prefix}-${randomId}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type CartContextValue = {
  state: CartState;
  hydrated: boolean;
  lineCount: number;
  unitCount: number;
  totals: ReturnType<typeof calculateCartTotals>;
  printingAggregate: ReturnType<typeof getPrintingCartAggregate>;
  appliedCoupon: ReturnType<typeof getCartCoupon>;
  addProduct: (input: AddProductCartItemInput) => string;
  addPrinting: (input: AddPrintingCartItemInput) => string;
  removeItem: (itemId: string) => void;
  updateProductQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (couponCode: string | null) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, createEmptyCartState);
  const [hydrated, markHydrated] = useReducer(() => true, false);
  const suppressNextPersistenceRef = useRef(false);

  useEffect(() => {
    const loadResult = loadCartFromStorage(window.localStorage);
    suppressNextPersistenceRef.current = true;
    dispatch({ type: "replace", state: loadResult.state });
    markHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (suppressNextPersistenceRef.current) {
      suppressNextPersistenceRef.current = false;
      return;
    }

    writeCartToStorage(window.localStorage, state);
  }, [hydrated, state]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key !== CART_STORAGE_KEY ||
        event.storageArea !== window.localStorage
      ) {
        return;
      }

      const nextState =
        event.newValue === null
          ? createEmptyCartState()
          : deserializeCartStorageValue(event.newValue);

      if (!nextState) {
        return;
      }

      suppressNextPersistenceRef.current = true;
      dispatch({ type: "replace", state: nextState });
      markHydrated();
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addProduct = useCallback((input: AddProductCartItemInput) => {
    const itemId = input.id ?? createCartItemId("product");
    const item: ProductCartItem = {
      ...input,
      kind: "product",
      id: itemId,
      addedAt: input.addedAt ?? new Date().toISOString(),
      currency: input.currency ?? "LE",
      quantity: normalizeQuantity(input.quantity ?? 1),
    };

    dispatch({ type: "add_product", item });
    return itemId;
  }, []);

  const addPrinting = useCallback((input: AddPrintingCartItemInput) => {
    const itemId = input.id ?? createCartItemId("printing");
    const item: PrintingCartItem = {
      ...input,
      kind: "printing",
      id: itemId,
      addedAt: input.addedAt ?? new Date().toISOString(),
    };

    dispatch({ type: "add_printing", item });
    return itemId;
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "remove_item", itemId });
  }, []);

  const updateProductQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: "update_product_quantity", itemId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const setCoupon = useCallback((couponCode: string | null) => {
    if (couponCode === null || couponCode.trim() === "") {
      dispatch({ type: "set_coupon", couponCode: null });
      return true;
    }

    const normalizedCode = normalizeCouponCode(couponCode);

    if (!getCartCoupon(normalizedCode)) {
      return false;
    }

    dispatch({ type: "set_coupon", couponCode: normalizedCode });
    return true;
  }, []);

  const totals = useMemo(() => calculateCartTotals(state), [state]);
  const printingAggregate = useMemo(
    () => getPrintingCartAggregate(state.items),
    [state.items],
  );
  const lineCount = useMemo(() => selectCartLineCount(state), [state]);
  const unitCount = useMemo(() => selectCartUnitCount(state), [state]);
  const appliedCoupon = useMemo(
    () => getCartCoupon(state.couponCode),
    [state.couponCode],
  );

  const contextValue = useMemo<CartContextValue>(
    () => ({
      state,
      hydrated,
      lineCount,
      unitCount,
      totals,
      printingAggregate,
      appliedCoupon,
      addProduct,
      addPrinting,
      removeItem,
      updateProductQuantity,
      clearCart,
      setCoupon,
    }),
    [
      addPrinting,
      addProduct,
      appliedCoupon,
      clearCart,
      hydrated,
      lineCount,
      printingAggregate,
      removeItem,
      setCoupon,
      state,
      totals,
      unitCount,
      updateProductQuantity,
    ],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
