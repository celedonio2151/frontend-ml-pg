# useWebSocket

The `useWebSocket` hook connects your app to a WebSocket server, making it easy to send and receive real-time data. It handles reconnections, message buffering, and event-based handling, making it ideal for applications like chat apps, live notifications, or real-time data updates.

This example demonstrates a reusable WebSocket hook with features for connection management, event handling, and graceful cleanup.

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

function useWebSocket(url, options = {}) {
  const { reconnect = true, reconnectInterval = 5000, onOpen, onMessage, onError, onClose } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const websocketRef = useRef(null);
  const reconnectTimeout = useRef(null);

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

  const sendMessage = useCallback((message) => {
    if (isConnected && websocketRef.current) {
      websocketRef.current.send(message);
    }
  }, [isConnected]);

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
```

## Features of `useWebSocket`

- **Reconnection Handling**: If the connection closes, the hook automatically tries to reconnect after a specified interval.
- **Event Handling**: Accepts callbacks for `onOpen`, `onMessage`, `onError`, and `onClose` events to handle them as needed.
- **Message Sending**: Provides a `sendMessage` function that only sends messages when the WebSocket is open.
- **Last Message Storage**: Stores the latest message received, allowing easy access to the most recent data without re-subscribing.

## Usage Example

Here's how to use `useWebSocket` in a component, such as a live chat or a real-time notification system.

```tsx
function ChatApp() {
  const { isConnected, sendMessage, lastMessage } = useWebSocket('ws://localhost:4000/chat', {
    reconnect: true,
    reconnectInterval: 3000,
    onOpen: () => console.log('Connected to WebSocket'),
    onMessage: (event) => console.log('New message received:', event.data),
    onClose: () => console.log('Disconnected from WebSocket'),
  });

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <h3>WebSocket Chat</h3>
      <div>
        <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send
        </button>
      </div>
      <div>
        <h4>Last Message:</h4>
        <p>{lastMessage}</p>
      </div>
    </div>
  );
}
```

## How It Works

1. **Connection Management**: The hook automatically manages the WebSocket connection and allows reconnecting after disconnection.
2. **Sending Messages**: You can send messages through the `sendMessage` function, which only sends when the WebSocket is open.
3. **Event Handlers**: Custom event handlers (like `onMessage`) let you react to WebSocket events without polluting your component code.
4. **Last Message**: You can access the last received message directly, simplifying data access in the UI.
