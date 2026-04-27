import { useEffect, useRef, useState } from 'react';

interface SttMessage {
  text: string;
}

export const useVoice = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');

  const stopListeningInternal = () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioCtxRef.current = null;
    isListeningRef.current = false;
    setIsListening(false);
  };

  const connect = () => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/stt/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket 연결됨');
      setIsConnected(true);
    };
    ws.onclose = () => {
      console.log('WebSocket 닫힘');
      setIsConnected(false);
    };
    ws.onerror = (e) => console.error('WebSocket 오류:', e);

    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const data: SttMessage = JSON.parse(event.data);
        console.log('STT 결과:', data.text);
        setMessage(data.text);
        // 응답 오면 자동 비활성화
        processorRef.current?.disconnect();
        sourceRef.current?.disconnect();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close().catch(() => {});
        processorRef.current = null;
        sourceRef.current = null;
        streamRef.current = null;
        audioCtxRef.current = null;
        isListeningRef.current = false;
        setIsListening(false);
      }
    };
  };

  const startListening = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (isListeningRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioCtx.createScriptProcessor(1024, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const float32 = e.inputBuffer.getChannelData(0);
          wsRef.current.send(float32.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      isListeningRef.current = true;
      setIsListening(true);
    } catch (e) {
      console.error('마이크 오류:', e);
    }
  };

  const toggleListening = () => {
    if (isListeningRef.current) {
      stopListeningInternal();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      stopListeningInternal();
      wsRef.current?.close();
    };
  }, []);

  return { isConnected, isListening, message, toggleListening };
};