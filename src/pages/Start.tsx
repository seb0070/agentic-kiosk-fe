import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

function Start() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: 'calc(100vh * 0.5625)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* 상단 홍보 배너 */}
      <div style={{ flex: '0 0 38%', overflow: 'hidden' }}>
        <img
          src={heroImg}
          alt="리아버거 홍보"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* 하단 주문 방식 선택 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          gap: '28px',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#222' }}>
          주문 방식을 선택해 주세요
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            width: '100%',
          }}
        >
          {/* 터치 주문 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '32px 16px',
              border: '1.5px solid #eee',
              borderRadius: '16px',
              background: '#fafafa',
              cursor: 'default',
            }}
          >
            <span style={{ fontSize: '48px' }}>👆</span>
            <span
              style={{ fontSize: '17px', fontWeight: '700', color: '#bbb' }}
            >
              터치 주문
            </span>
          </div>

          {/* 음성 주문 */}
          <div
            onClick={() => navigate('/home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '32px 16px',
              border: '1.5px solid #e63312',
              borderRadius: '16px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '48px' }}>🎤</span>
            <span
              style={{ fontSize: '17px', fontWeight: '700', color: '#e63312' }}
            >
              음성 주문
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
