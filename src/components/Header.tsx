import { ShoppingCart, Search, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [cartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-gradient-to-r from-blue-600 via-white to-red-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-md">
              <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Petit Budget
              </h1>
              <p className="text-xs text-gray-600">La sécurité n'est plus un luxe</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pr-12 border-2 border-white rounded-full shadow-md focus:outline-none focus:border-blue-400 bg-white/90 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-red-600 text-white p-2 rounded-full hover:shadow-lg transition-all">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Compte</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-md hover:shadow-lg transition-all relative">
              <ShoppingCart className="w-5 h-5" />
              <span>{cartCount},00 €</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-3xl">
          <ul className="flex items-center justify-center gap-1 py-3 px-4">
            <li>
              <a
                href="#"
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all inline-block"
              >
                Kits Vidéosurveillance
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 text-white hover:bg-white/10 rounded-full transition-all inline-block"
              >
                Caméras de Surveillance
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 text-white hover:bg-white/10 rounded-full transition-all inline-block"
              >
                Alarmes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 text-white hover:bg-white/10 rounded-full transition-all inline-block"
              >
                Interphone Vidéo
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 text-white hover:bg-white/10 rounded-full transition-all inline-block"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 text-white hover:bg-white/10 rounded-full transition-all inline-block"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full hover:shadow-lg transition-all inline-block"
              >
                Déstockage
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
