import { motion } from "motion/react";
const characterImage = '/1.png';

interface AvatarDisplayProps {
  isConnected: boolean;
  isSpeaking: boolean;
}

export function AvatarDisplay({ isConnected }: AvatarDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Rotating character container */}
      <motion.div
        className="relative"
        animate={{
          rotateY: isConnected ? 360 : 0,
        }}
        transition={{
          duration: 8,
          repeat: isConnected ? Infinity : 0,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={characterImage}
          alt="AI Character"
          className="w-[450px] h-auto object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Status indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-5 py-2.5 rounded-full bg-white shadow-xl border border-gray-200"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-blue-500" : "bg-gray-400"
              }`}
            animate={{
              opacity: isConnected ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isConnected ? Infinity : 0,
            }}
          />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? "Active" : "Inactive"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}