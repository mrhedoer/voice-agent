import { motion } from "motion/react";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            scale: isConnected ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isConnected ? Infinity : 0,
            ease: "easeInOut",
          }}
          className={`p-2 rounded-xl ${
            isConnected
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isConnected ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5" />
          )}
        </motion.div>
        <div className="flex-1">
          <div className={`text-sm font-medium ${
            isConnected ? "text-blue-600" : "text-gray-500"
          }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
          <div className="text-xs text-gray-400">
            {isConnected ? "Ready to chat" : "Click connect to start"}
          </div>
        </div>
        {isConnected && (
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-blue-500"
          />
        )}
      </div>
    </motion.div>
  );
}