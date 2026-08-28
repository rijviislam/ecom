"use client";

import { Product } from "@/types/product";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

type CartItem = Product & {
  quantity: number;
};

type ShopState = {
  cart: CartItem[];
  wishlist: Product[];
};

type ShopContextType = {
  cart: CartItem[];
  wishlist: Product[];

  cartCount: number;
  wishlistCount: number;
  subtotal: number;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
};

type Action =
  | {
      type: "HYDRATE";
      payload: ShopState;
    }
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        quantity: number;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: string;
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        quantity: number;
      };
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "ADD_TO_WISHLIST";
      payload: Product;
    }
  | {
      type: "REMOVE_FROM_WISHLIST";
      payload: string;
    };

const initialState: ShopState = {
  cart: [],
  wishlist: [],
};

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;

      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            ...product,
            quantity,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.productId
            ? {
                ...item,
                quantity: Math.max(1, action.payload.quantity),
              }
            : item,
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "ADD_TO_WISHLIST": {
      const exists = state.wishlist.some(
        (item) => item.id === action.payload.id,
      );

      if (exists) return state;

      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    }

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cartData = localStorage.getItem("cart");
      const wishlistData = localStorage.getItem("wishlist");

      const rawCart = cartData ? JSON.parse(cartData) : [];
      const rawWishlist = wishlistData ? JSON.parse(wishlistData) : [];

      const cart: CartItem[] = Array.isArray(rawCart)
        ? rawCart.filter(
            (item): item is CartItem =>
              item &&
              typeof item.id === "string" &&
              item.id.length > 0 &&
              typeof item.price === "number" &&
              typeof item.quantity === "number" &&
              item.quantity > 0,
          )
        : [];

      const wishlist: Product[] = Array.isArray(rawWishlist)
        ? rawWishlist.filter(
            (item): item is Product =>
              item && typeof item.id === "string" && item.id.length > 0,
          )
        : [];

      dispatch({ type: "HYDRATE", payload: { cart, wishlist } });
    } catch (error) {
      console.error("Failed to load localStorage:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist, hydrated]);

  const cartCount = useMemo(() => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  const subtotal = useMemo(() => {
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [state.cart]);

  // FUNCTIONS

  function addToCart(product: Product, quantity = 1) {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        quantity,
      },
    });
  }

  function removeFromCart(productId: string) {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productId,
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        productId,
        quantity,
      },
    });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function addToWishlist(product: Product) {
    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: product,
    });
  }

  function removeFromWishlist(productId: string) {
    dispatch({
      type: "REMOVE_FROM_WISHLIST",
      payload: productId,
    });
  }

  function isInCart(productId: string) {
    return state.cart.some((item) => item.id === productId);
  }

  function isInWishlist(productId: string) {
    return state.wishlist.some((item) => item.id === productId);
  }

  return (
    <ShopContext.Provider
      value={{
        cart: state.cart,
        wishlist: state.wishlist,

        cartCount,
        wishlistCount: state.wishlist.length,
        subtotal,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        addToWishlist,
        removeFromWishlist,

        isInCart,
        isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }

  return context;
}
