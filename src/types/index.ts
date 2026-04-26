export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;        // number → string으로 변경
  spicy_level: number;
  kcal?: number;
  description?: string;
  img_url?: string;     // 추가
  badge?: string;       // 추가
}

export interface CartItem {
  cart_id: number;
  menu_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface WsMessage {
  stt_text: string;
  refined_text: string;
  voice: string;
  screen: string;
}

export interface OrderResponse {
  order_id: number;
  total_price: number;
  message: string;
}