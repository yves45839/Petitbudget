import { Wrench, Truck, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Hotline */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg border-2 border-blue-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Hotline</h3>
                <h3 className="text-2xl mb-2">et support</h3>
                <h3 className="text-2xl mb-4">inclus</h3>
              </div>
            </div>
            <p className="text-gray-600">numéro</p>
            <p className="text-gray-600">non surtaxé</p>
          </div>

          {/* Livraison Abidjan */}
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-3xl shadow-lg border-2 border-red-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Livraison</h3>
                <h3 className="text-2xl mb-2">rapide sur</h3>
                <h3 className="text-2xl mb-4">Abidjan</h3>
              </div>
            </div>
            <p className="text-gray-600">expédition locale</p>
            <p className="text-gray-600">suivi de commande inclus</p>
          </div>

          {/* Produits certifiés */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg border-2 border-blue-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Produits</h3>
                <h3 className="text-2xl mb-2">testés et</h3>
                <h3 className="text-2xl mb-4">validés</h3>
              </div>
            </div>
            <p className="text-gray-600">qualité vérifiée</p>
            <p className="text-gray-600">avant expédition</p>
          </div>
        </div>
      </div>
    </section>
  );
}
