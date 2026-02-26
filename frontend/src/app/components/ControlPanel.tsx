import { motion } from "motion/react";
import { Mic, MicOff, Camera, CameraOff, Volume2, VolumeX, Settings } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

interface ControlPanelProps {
  microphone: boolean;
  camera: boolean;
  outputSound: boolean;
  onMicrophoneChange: (value: boolean) => void;
  onCameraChange: (value: boolean) => void;
  onOutputSoundChange: (value: boolean) => void;
  onConnect: () => void;
  isConnected: boolean;
}

export function ControlPanel({
  microphone,
  camera,
  outputSound,
  onMicrophoneChange,
  onCameraChange,
  onOutputSoundChange,
  onConnect,
  isConnected,
}: ControlPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Handle camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 },
          audio: false 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError("Camera access denied");
        onCameraChange(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (camera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [camera, onCameraChange]);

  const controls = [
    {
      icon: microphone ? Mic : MicOff,
      label: "Microphone",
      value: microphone,
      onChange: onMicrophoneChange,
      activeColor: "text-blue-600",
      inactiveColor: "text-gray-400",
    },
    {
      icon: camera ? Camera : CameraOff,
      label: "Camera",
      value: camera,
      onChange: onCameraChange,
      activeColor: "text-blue-600",
      inactiveColor: "text-gray-400",
    },
    {
      icon: outputSound ? Volume2 : VolumeX,
      label: "Output Sound",
      value: outputSound,
      onChange: onOutputSoundChange,
      activeColor: "text-blue-600",
      inactiveColor: "text-gray-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-lg flex-1 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
          <Settings className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Controls</h2>
      </div>

      <div className="flex-1 space-y-4">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <motion.div
              key={control.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: control.value ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={control.value ? control.activeColor : control.inactiveColor}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-sm font-medium ${
                  control.value ? "text-gray-800" : "text-gray-500"
                }`}>
                  {control.label}
                </span>
              </div>
              <Switch
                checked={control.value}
                onCheckedChange={control.onChange}
              />
            </motion.div>
          );
        })}

        {/* Camera Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
            {camera ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/95 backdrop-blur-sm shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-medium text-white">LIVE</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <CameraOff className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">
                    {cameraError || "Camera off"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <Button
          onClick={onConnect}
          className={`w-full h-12 rounded-xl font-semibold transition-all shadow-lg ${
            isConnected
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </motion.div>
    </motion.div>
  );
}