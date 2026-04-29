import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenus } from '../api/menu';
import { useVoice } from '../hooks/useVoice';
import { useCart } from '../store/cartStore';
import type { MenuItem } from '../types';
import VoiceWave from '../components/VoiceWave';

const CATEGORIES = ['추천메뉴', '버거', '디저트/치킨', '음료/커피', '행사메뉴'];

const filterByCategory = (menus: MenuItem[], category: string): MenuItem[] => {
  switch (category) {
    case '추천메뉴':
      return menus.filter((m) => m.badge === 'BEST');
    case '버거':
      return menus.filter((m) => m.category === '버거');
    case '디저트/치킨':
      return menus.filter(
        (m) => m.category === '디저트' || m.category === '치킨'
      );
    case '음료/커피':
      return menus.filter((m) => m.category === '음료');
    case '행사메뉴':
      return menus.filter((m) => m.badge === 'NEW');
    default:
      return menus;
  }
};

function Home() {
  const [activeCategory, setActiveCategory] = useState('추천메뉴');
  const [cartExpanded, setCartExpanded] = useState(false);

  const { isConnected, isListening, message, toggleListening } = useVoice();
  const { items, addItem, removeItem, total } = useCart();

  const { data: menus, isLoading } = useQuery({
    queryKey: ['menus'],
    queryFn: () => getMenus(),
  });

  const filtered = menus ? filterByCategory(menus, activeCategory) : [];
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const visibleOrders = cartExpanded ? items : items.slice(0, 3);

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#e63312',
          fontSize: '16px',
        }}
      >
        로딩 중...
      </div>
    );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: 'calc(100vh * 0.5625)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8f8f8',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #ebebeb',
          flexShrink: 0,
        }}
      >
        <button
          style={{
            background: 'none',
            border: '1.5px solid #ddd',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#555',
            fontWeight: '500',
          }}
        >
          ← 처음으로
        </button>
        <span
          style={{
            fontWeight: '800',
            fontSize: '17px',
            color: '#e63312',
            letterSpacing: '-0.5px',
          }}
        >
          리아버거
        </span>
        <div style={{ width: '72px' }} />
      </div>

      {/* 카테고리 탭 */}
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderBottom: '1px solid #ebebeb',
          flexShrink: 0,
          padding: '0 4px',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flex: 1,
              padding: '14px 2px',
              border: 'none',
              borderBottom:
                activeCategory === cat
                  ? '2.5px solid #e63312'
                  : '2.5px solid transparent',
              background: 'white',
              color: activeCategory === cat ? '#e63312' : '#999',
              fontWeight: activeCategory === cat ? '700' : '400',
              fontSize: '11.5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 메뉴 그리드 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          alignContent: 'start',
          background: '#f8f8f8',
        }}
      >
        {filtered.map((menu) => (
          <div
            key={menu.id}
            onClick={() =>
              addItem({
                id: menu.id,
                name: menu.name,
                price: parseInt(menu.price.replace(',', '')),
                img_url: menu.img_url ?? '',
              })
            }
            style={{
              background: 'white',
              borderRadius: '14px',
              padding: '10px 8px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.1s ease',
            }}
          >
            <img
              src={menu.img_url || undefined}
              alt={menu.name}
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'contain',
                background: '#fafafa',
                borderRadius: '10px',
              }}
            />
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                marginTop: '8px',
                wordBreak: 'keep-all',
                color: '#222',
                lineHeight: '1.4',
              }}
            >
              {menu.name}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#e63312',
                marginTop: '4px',
                fontWeight: '700',
              }}
            >
              {parseInt(menu.price.replace(',', '')).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>

      {/* 장바구니 영역 */}
      {items.length > 0 && (
        <div
          style={{
            background: '#2b2e3b',
            color: 'white',
            flexShrink: 0,
          }}
        >
          {/* 핸들 */}
          <div
            onClick={() => setCartExpanded(!cartExpanded)}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              borderBottom: '1px solid #3a3d4d',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '3px',
                background: '#666',
                borderRadius: '2px',
              }}
            />
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              {cartExpanded ? '장바구니 내리기 ▼' : '전체보기 ▲'}
            </span>
            <div
              style={{
                width: '32px',
                height: '3px',
                background: '#666',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* 주문수 + 총금액 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 16px',
              fontSize: '13px',
              borderBottom: '1px solid #3a3d4d',
            }}
          >
            <span style={{ color: '#aaa' }}>
              주문수 <strong style={{ color: 'white' }}>{totalCount}</strong>
            </span>
            <span style={{ color: '#aaa' }}>
              총 주문금액{' '}
              <strong style={{ color: '#e63312' }}>
                {total.toLocaleString()}원
              </strong>
            </span>
          </div>

          {/* 주문 목록 */}
          <div style={{ padding: '8px 16px' }}>
            {visibleOrders.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                {cartExpanded && (
                  <img
                    src={item.img_url}
                    alt={item.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      background: '#f5f5f5',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, fontSize: '13px' }}>
                  {item.name}
                  <span style={{ color: '#aaa', marginLeft: '4px' }}>
                    x{item.quantity}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#ddd',
                    marginRight: '8px',
                  }}
                >
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e63312',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 응답 + 파형 + 버튼 */}
      <div
        style={{
          background: '#fff',
          borderTop: '1px solid #ebebeb',
          flexShrink: 0,
        }}
      >
        {/* AI 응답 텍스트 + 파형 */}
        <div
          style={{
            padding: '12px 16px 8px',
            textAlign: 'center',
          }}
        >
          {message && (
            <div
              style={{
                fontSize: '14px',
                color: '#333',
                fontWeight: '500',
                marginBottom: '8px',
                lineHeight: '1.5',
              }}
            >
              {message}
            </div>
          )}
          <VoiceWave isActive={isListening} />
        </div>

        {/* 결제 + 마이크 */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            padding: '8px 14px 12px',
          }}
        >
          <button
            disabled={items.length === 0}
            style={{
              flex: 1,
              background: items.length === 0 ? '#e0e0e0' : '#e63312',
              color: items.length === 0 ? '#aaa' : 'white',
              border: 'none',
              borderRadius: '14px',
              height: '54px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: items.length === 0 ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {items.length === 0 ? '결제' : `결제 ${total.toLocaleString()}원`}
          </button>
          <button
            onClick={toggleListening}
            disabled={!isConnected}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: 'none',
              background: isListening ? '#e63312' : '#f0f0f0',
              fontSize: '22px',
              cursor: isConnected ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: isListening
                ? '0 0 0 6px rgba(230,51,18,0.25)'
                : '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
