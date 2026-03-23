import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Heart, Phone, Instagram, Facebook, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import PWAInstaller from '@/components/PWAInstaller';

export default function Layout({ children, currentPageName }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ['shopSettings'],
    queryFn: async () => {
      const list = await apiClient.entities.ShopSettings.list();
      return list[0] || null;
    }
  });

  const handleAdminAccess = async () => {
    try {
      const isAuth = await apiClient.auth.isAuthenticated();
      if (!isAuth) {
        apiClient.auth.redirectToLogin(createPageUrl("Admin"));
        return;
      }

      // Check and auto-grant admin if needed
      const { data } = await apiClient.functions.invoke('autoGrantAdmin', {});

      if (data.isAdmin) {
        navigate(createPageUrl("Admin"));
      } else {
        alert("Accès refusé. Vous devez être administrateur pour accéder à cette section.");
      }
    } catch (error) {
      apiClient.auth.redirectToLogin(createPageUrl("Admin"));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = currentPageName === 'Admin';
  const isBooking = currentPageName === 'Booking';

  const navLinks = [
    { name: 'Accueil', page: 'Home' },
    { name: 'Services', page: 'Services' },
    { name: 'Réserver', page: 'Booking' }
  ];

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black">
      <PWAInstaller />
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isBooking ? 'bg-black/95 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-white hidden sm:block">
                {settings?.shop_name || 'Barbershop'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`text-sm font-medium transition-colors hover:text-rose-400 ${
                    currentPageName === link.page ? 'text-rose-400' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAdminAccess}
                variant="ghost"
                size="icon"
                className="hidden md:flex text-gray-400 hover:text-rose-400 hover:bg-zinc-800"
                title="Accès Admin"
              >
                <Shield className="w-5 h-5" />
              </Button>
              <Link to={createPageUrl("Booking")} className="hidden md:block">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full px-6">
                  Prendre RDV
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-zinc-950 border-zinc-800 w-full max-w-sm">
                  <div className="flex flex-col h-full pt-10">
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.page}
                          to={createPageUrl(link.page)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-2xl font-semibold transition-colors py-2 ${
                            currentPageName === link.page ? 'text-rose-400' : 'text-white hover:text-rose-400'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pb-10 space-y-4">
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleAdminAccess();
                        }}
                        variant="outline"
                        className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white py-6 text-lg rounded-xl"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Accès Admin
                      </Button>

                      <Link to={createPageUrl("Booking")} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-6 text-lg rounded-xl">
                          Prendre Rendez-vous
                        </Button>
                      </Link>

                      {settings?.phone && (
                        <a href={`tel:${settings.phone}`} className="flex items-center justify-center gap-2 mt-4 text-gray-400 hover:text-white transition-colors">
                          <Phone className="w-4 h-4" />
                          {settings.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={isBooking ? 'pt-20' : ''}>
        {children}
      </main>

      {/* Footer */}
      {!isBooking && (
        <footer className="bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    {settings?.shop_name || 'Salon de Beauté'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {settings?.tagline || "L'art de la beauté des ongles à votre portée."}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Navigation</h4>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.page}
                      to={createPageUrl(link.page)}
                      className="block text-gray-400 hover:text-rose-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  {settings?.address && <p>{settings.address}</p>}
                  {settings?.phone && (
                    <a href={`tel:${settings.phone}`} className="block hover:text-rose-400 transition-colors">
                      {settings.phone}
                    </a>
                  )}
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} className="block hover:text-rose-400 transition-colors">
                      {settings.email}
                    </a>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  {settings?.instagram_url && (
                    <a 
                      href={settings.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-zinc-800 hover:bg-rose-500 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    )}
                    {settings?.facebook_url && (
                    <a 
                      href={settings.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-zinc-800 hover:bg-rose-500 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    )}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {settings?.shop_name || 'Salon de Beauté'}. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}