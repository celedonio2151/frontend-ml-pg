import { useCallback, useEffect, useRef, useState } from 'react';

export function useWebSocket(
  url: string,
  options: {
    reconnect?: boolean;
    reconnectInterval?: number;
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
  } = {},
) {
  const {
    reconnect = true,
    reconnectInterval = 5000,
    onOpen,
    onMessage,
    onError,
    onClose,
  } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    websocketRef.current = new WebSocket(url);

    websocketRef.current.onopen = (event) => {
      setIsConnected(true);
      onOpen && onOpen(event);
    };

    websocketRef.current.onmessage = (event) => {
      setLastMessage(event.data);
      onMessage && onMessage(event);
    };

    websocketRef.current.onerror = (event) => {
      onError && onError(event);
    };

    websocketRef.current.onclose = (event) => {
      setIsConnected(false);
      onClose && onClose(event);
      if (reconnect) {
        reconnectTimeout.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [url, reconnect, reconnectInterval, onOpen, onMessage, onError, onClose]);

  const sendMessage = useCallback(
    (message: string) => {
      if (isConnected && websocketRef.current) {
        websocketRef.current.send(message);
      }
    },
    [isConnected],
  );

  useEffect(() => {
    connect();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  return { isConnected, sendMessage, lastMessage };
}
