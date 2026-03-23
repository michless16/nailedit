/**
 * @module Sonner Toaster
 * @description Composant Toaster utilisant la bibliothèque Sonner.
 * Thème sombre par défaut (adapté au design de NailedIt).
 */

import { Toaster as Sonner } from 'sonner';

/**
 * Composant Toaster Sonner avec styles personnalisés.
 * @param {Object} props - Props transmises au composant Sonner.
 * @returns {JSX.Element}
 */
const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-rose-500 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-zinc-800 group-[.toast]:text-gray-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
