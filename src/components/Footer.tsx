import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl mb-4 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Petit Budget
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Spécialiste de la vidéosurveillance et de la sécurité. Nous proposons les meilleures marques à prix compétitifs.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full hover:shadow-lg transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full hover:shadow-lg transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full hover:shadow-lg transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Kits Vidéosurveillance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Caméras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Alarmes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Interphones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl mb-4">Service Client</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Livraison
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Retours
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Garantie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p>+225 07 58 00 00 45</p>
                  <p className="text-sm text-gray-400">Lun-Sam 8h-18h</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <p>contact@petitbudget.ci</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <p>Abidjan, Côte d'Ivoire</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Petit Budget. Tous droits réservés. | Conditions Générales de Vente | Mentions Légales
          </p>
        </div>
      </div>
    </footer>
  );
}
