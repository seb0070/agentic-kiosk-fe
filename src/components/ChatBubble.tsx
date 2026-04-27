interface Props {
  message: string;
}

function ChatBubble({ message }: Props) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        background: 'white',
        borderRadius: '16px',
        padding: '18px 20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        fontSize: '18px',
        fontWeight: 'bold',
        lineHeight: '1.6',
        color: '#111',
      }}
    >
      {message}
    </div>
  );
}

export default ChatBubble;
