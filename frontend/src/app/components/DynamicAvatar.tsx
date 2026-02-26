import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function DynamicAvatar() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate speaking animation cycles
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        {/* Outer pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/20"
          animate={{
            scale: isSpeaking ? [1, 1.5, 1.5, 1] : 1,
            opacity: isSpeaking ? [0.5, 0, 0, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: "300px", height: "300px" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400/30"
          animate={{
            scale: isSpeaking ? [1, 1.3, 1.3, 1] : 1,
            opacity: isSpeaking ? [0.6, 0, 0, 0.6] : 0.6,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          style={{ width: "300px", height: "300px" }}
        />

        {/* Main avatar circle */}
        <motion.div
          className="relative rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: "300px", height: "300px" }}
        >
          {/* Inner animated rings */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-300/40 to-purple-500/40 backdrop-blur-sm" />
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-blue-200/60 to-purple-400/60 backdrop-blur-md" />
          
          {/* Center icon/face */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            animate={{
              y: isSpeaking ? [-2, 2, -2] : 0,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Eyes */}
            <div className="flex gap-8">
              <motion.div
                className="w-3 h-3 rounded-full bg-white"
                animate={{
                  scaleY: isSpeaking ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-white"
                animate={{
                  scaleY: isSpeaking ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </div>
            
            {/* Mouth/Wave visualization */}
            <div className="flex gap-1 items-end h-12">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: isSpeaking
                      ? [8, Math.random() * 40 + 10, 8]
                      : 8,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-300/60"
            style={{
              top: `${Math.random() * 300}px`,
              left: `${Math.random() * 300}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
