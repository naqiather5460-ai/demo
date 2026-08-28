import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { products as initialProducts, orders as initialOrders, discountCodes as initialDiscounts } from '@/data/mockData';
import type { Product, CartItem, Order, OrderStatus, ProductStatus, DiscountCode } from '@/data/mockData';

interface AppState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  discountCodes: DiscountCode[];
  isLoggedIn: boolean;
  currentUser: { name: string; email: string } | null;
  isAdminMode: boolean;
  appliedCoupon: string | null;
  couponDiscount: number;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  discountPopupDismissed: boolean;
}

type Action =
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'LOGIN'; payload: { name: string; email: string } }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_ADMIN_MODE' }
  | { type: 'UPDATE_PRODUCT_STATUS'; payload: { id: string; status: ProductStatus; stock?: number } }
  | { type: 'UPDATE_PRODUCT'; payload: Partial<Product> & { id: string } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus } }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'DISMISS_POPUP' }
  | { type: 'ADD_DISCOUNT_CODE'; payload: DiscountCode }
  | { type: 'UPDATE_DISCOUNT_CODE'; payload: Partial<DiscountCode> & { id: string } }
  | { type: 'DELETE_DISCOUNT_CODE'; payload: string };

const initialState: AppState = {
  products: initialProducts,
  cart: [],
  wishlist: [],
  orders: initialOrders,
  discountCodes: initialDiscounts,
  isLoggedIn: false,
  currentUser: null,
  isAdminMode: false,
  appliedCoupon: null,
  couponDiscount: 0,
  notification: null,
  discountPopupDismissed: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { productId: action.payload.productId, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };
    case 'UPDATE_CART_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter(i => i.productId !== action.payload.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(i =>
          i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [], appliedCoupon: null, couponDiscount: 0 };
    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.includes(action.payload)
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload],
      };
    case 'LOGIN':
      return { ...state, isLoggedIn: true, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, currentUser: null, isAdminMode: false };
    case 'TOGGLE_ADMIN_MODE':
      return { ...state, isAdminMode: !state.isAdminMode };
    case 'UPDATE_PRODUCT_STATUS':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id
            ? { ...p, status: action.payload.status, stock: action.payload.stock ?? p.stock }
            : p
        ),
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => (o.id === action.payload.id ? { ...o, status: action.payload.status } : o)),
      };
    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [], appliedCoupon: null, couponDiscount: 0 };
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null, couponDiscount: 0 };
    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };
    case 'DISMISS_POPUP':
      return { ...state, discountPopupDismissed: true };
    case 'ADD_DISCOUNT_CODE':
      return { ...state, discountCodes: [...state.discountCodes, action.payload] };
    case 'UPDATE_DISCOUNT_CODE':
      return {
        ...state,
        discountCodes: state.discountCodes.map(d => (d.id === action.payload.id ? { ...d, ...action.payload } : d)),
      };
    case 'DELETE_DISCOUNT_CODE':
      return { ...state, discountCodes: state.discountCodes.filter(d => d.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  cartTotal: number;
  cartCount: number;
  getProduct: (id: string) => Product | undefined;
  isInWishlist: (id: string) => boolean;
  cartItems: (CartItem & { product: Product })[];
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const cartItems = state.cart
    .map(item => {
      const product = state.products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as (CartItem & { product: Product })[];

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const getProduct = (id: string) => state.products.find(p => p.id === id);
  const isInWishlist = (id: string) => state.wishlist.includes(id);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 3500);
  };

  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 3500);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  return (
    <AppContext.Provider value={{ state, dispatch, cartTotal, cartCount, getProduct, isInWishlist, cartItems, showNotification }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
