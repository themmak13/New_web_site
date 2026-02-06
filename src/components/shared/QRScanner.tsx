'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { X, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let stream: MediaStream | null = null;

    const startScanning = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          reader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, err) => {
              if (result) {
                onScan(result.getText());
                stopScanning();
              }
            }
          );
        }
      } catch (err) {
        setError('الرجاء السماح بالوصول إلى الكاميرا');
      }
    };

    const stopScanning = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      reader.reset();
      onClose();
    };

    startScanning();

    return () => {
      stopScanning();
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="bg-white/90 p-2 rounded-full hover:bg-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-white rounded-lg"></div>
        </div>

        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <Camera size={32} className="mx-auto mb-2" />
          <p>ضع رمز QR داخل الإطار</p>
        </div>
      </div>
    </div>
  );
}
