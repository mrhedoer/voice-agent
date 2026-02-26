import { useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { ConversationPanel } from "./components/ConversationPanel";
import { AvatarDisplay } from "./components/AvatarDisplay";
import { ConnectionStatus } from "./components/ConnectionStatus";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(false);
  const [outputSound, setOutputSound] = useState(true);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }>>([]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm listening! How can I help you today?",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <div className="w-full h-full max-w-[1600px] flex gap-6 p-6">
        {/* Left Panel - Controls */}
        <div className="flex flex-col gap-4 w-80">
          <ConnectionStatus isConnected={isConnected} />
          <ControlPanel
            microphone={microphone}
            camera={camera}
            outputSound={outputSound}
            onMicrophoneChange={setMicrophone}
            onCameraChange={setCamera}
            onOutputSoundChange={setOutputSound}
            onConnect={handleConnect}
            isConnected={isConnected}
          />
        </div>

        {/* Center - Avatar */}
        <div className="flex-1 flex items-center justify-center">
          <AvatarDisplay isConnected={isConnected} isSpeaking={microphone} />
        </div>

        {/* Right Panel - Conversation */}
        <div className="w-96">
          <ConversationPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
          />
        </div>
      </div>
    </div>
  );
}