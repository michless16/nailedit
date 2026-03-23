import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed');
      });
    }

    // Add manifest to head
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add theme color
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#f43f5e';
    document.head.appendChild(themeColor);

    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icon-192.png';
    document.head.appendChild(appleTouchIcon);

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt if not already installed and not dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowInstallPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      document.head.removeChild(manifestLink);
      document.head.removeChild(themeColor);
      document.head.removeChild(appleTouchIcon);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50"
        >
          <div className="bg-zinc-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Installer l'application</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Installez notre app pour un accès rapide et une meilleure expérience.
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-semibold flex-1"
                  >
                    Installer
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}