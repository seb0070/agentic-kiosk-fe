import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addCartItem, deleteCartItem } from '../api/cart';
import { useSession } from './sessionStore';
import type { MenuItem } from '../types';

export const useCart = (menus?: MenuItem[]) => {
  const { sessionId } = useSession();
  const queryClient = useQueryClient();

  // 백엔드 장바구니 조회
  const { data } = useQuery({
    queryKey: ['cart', sessionId],
    queryFn: () => getCart(sessionId),
    enabled: !!sessionId,
  });

  const backendItems = data?.items ?? [];

  // 이미지는 menus 데이터에서 menu_id로 찾아서 붙임
  const items = backendItems.map((cartItem) => {
    const menu = menus?.find((m) => m.id === cartItem.menu_id);
    return {
      ...cartItem,
      img_url: menu?.img_url ?? '',
    };
  });

  const total = backendItems.reduce(
    (sum, i) => sum + i.unit_price * i.quantity,
    0
  );
  const totalCount = backendItems.reduce((sum, i) => sum + i.quantity, 0);

  // 메뉴 클릭 → POST /cart
  const addMutation = useMutation({
    mutationFn: (params: { menu_id: number; unit_price: number }) =>
      addCartItem({
        session_id: sessionId,
        menu_id: params.menu_id,
        quantity: 1,
        unit_price: params.unit_price,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });

  // 항목 삭제 → DELETE /cart/{cart_id}
  const removeMutation = useMutation({
    mutationFn: (cartId: number) => deleteCartItem(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });

  const addItem = (menu_id: number, unit_price: number) => {
    addMutation.mutate({ menu_id, unit_price });
  };

  const removeItem = (cartId: number) => {
    removeMutation.mutate(cartId);
  };

  // AI가 장바구니를 변경하면 다른 컴포넌트에서 강제 갱신할 수 있도록
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
  };

  return { items, total, totalCount, addItem, removeItem, refetch };
};