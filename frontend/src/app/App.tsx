import { useState, useEffect } from "react";
import { PipecatClient, RTVIEvent } from '@pipecat-ai/client-js';
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport';
import { PipecatClientAudio, PipecatClientProvider } from '@pipecat-ai/client-react';

import { ControlPanel } from "./components/ControlPanel";
import { ConversationPanel } from "./components/ConversationPanel";
import { AvatarDisplay } from "./components/AvatarDisplay";
import { ConnectionStatus } from "./components/ConnectionStatus";

const client = new PipecatClient({
  transport: new SmallWebRTCTransport(),
  enableMic: true,
  enableCam: false,
});

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(false);
  const [outputSound, setOutputSound] = useState(true);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }>>([]);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleBotSpeaking = () => setIsBotSpeaking(true);
    const handleBotStoppedSpeaking = () => setIsBotSpeaking(false);

    const handleBotLlmStarted = () => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(),
        text: '',
        sender: 'ai',
        timestamp: new Date()
      }]);
    };

    const handleBotMessage = (text: any) => {
      if (text?.text) {
        setMessages(prev => {
          const lastIndex = prev.length - 1;
          const lastMessage = prev[lastIndex];
          if (lastMessage && lastMessage.sender === 'ai') {
            const newMessages = [...prev];
            newMessages[lastIndex] = {
              ...lastMessage,
              text: lastMessage.text + text.text
            };
            return newMessages;
          }
          return [...prev, {
            id: Date.now().toString() + Math.random().toString(),
            text: text.text,
            sender: 'ai',
            timestamp: new Date()
          }];
        });
      }
    };

    const handleUserMessage = (text: any) => {
      if (text?.text && text?.final) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(),
          text: text.text,
          sender: 'user',
          timestamp: new Date()
        }]);
      }
    };

    client.on(RTVIEvent.Connected, handleConnected);
    client.on(RTVIEvent.Disconnected, handleDisconnected);
    client.on(RTVIEvent.BotStartedSpeaking, handleBotSpeaking);
    client.on(RTVIEvent.BotStoppedSpeaking, handleBotStoppedSpeaking);
    client.on(RTVIEvent.BotLlmStarted, handleBotLlmStarted);
    client.on(RTVIEvent.BotLlmText, handleBotMessage);
    client.on(RTVIEvent.UserTranscript, handleUserMessage);

    return () => {
      client.off(RTVIEvent.Connected, handleConnected);
      client.off(RTVIEvent.Disconnected, handleDisconnected);
      client.off(RTVIEvent.BotStartedSpeaking, handleBotSpeaking);
      client.off(RTVIEvent.BotStoppedSpeaking, handleBotStoppedSpeaking);
      client.off(RTVIEvent.BotLlmStarted, handleBotLlmStarted);
      client.off(RTVIEvent.BotLlmText, handleBotMessage);
      client.off(RTVIEvent.UserTranscript, handleUserMessage);
    };
  }, []);

  const handleConnect = async () => {
    if (isConnected) {
      client.disconnectBot();
      await client.disconnect();
    } else {
      try {
        await client.connect({
          connection_url: 'http://localhost:7860/api/offer'
        });
      } catch (e) {
        console.error('Failed to connect:', e);
        alert('Failed to connect to Pipecat Bot');
      }
    }
  };

  const handleSendMessage = (text: string) => {
    // Optimistic UI update or send to pipecat if that supported
    // Usually user transcript comes via voice.
    // If we want to support text sending, and the bot supports it:
    // client.sendMessage({ type: 'user-llm-text', data: { text } });

    // For now, let's just add to UI locally as a fake "send", or just ignore since Pipecat uses voice mostly.
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Toggle handlers for microphone / camera that could theoretically interact with Pipecat Client
  const handleMicrophoneChange = (val: boolean) => {
    setMicrophone(val);
    if (client.transport && 'client' in client.transport) {
      // PipecatClient has enableMic method but after connect we might need to use transport
      client.enableMic(val);
    }
  };

  return (
    <PipecatClientProvider client={client}>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="w-full h-full max-w-[1600px] flex gap-6 p-6">
          {/* Left Panel - Controls */}
          <div className="flex flex-col flex-shrink-0 gap-4 w-80">
            <ConnectionStatus isConnected={isConnected} />
            <ControlPanel
              microphone={microphone}
              camera={camera}
              outputSound={outputSound}
              onMicrophoneChange={handleMicrophoneChange}
              onCameraChange={setCamera}
              onOutputSoundChange={setOutputSound}
              onConnect={handleConnect}
              isConnected={isConnected}
            />
          </div>

          {/* Center - Avatar */}
          <div className="flex-1 flex items-center justify-center">
            {/* Pass isBotSpeaking if AvatarDisplay can use that instead of microphone for animation */}
            <AvatarDisplay isConnected={isConnected} isSpeaking={isBotSpeaking} />
          </div>

          {/* Right Panel - Conversation */}
          <div className="w-[480px] flex flex-col flex-shrink-0 min-h-0 h-full">
            <ConversationPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}