import { Wrench, RotateCcw, CreditCard } from "lucide-react";

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

          {/* 28 jours */}
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-3xl shadow-lg border-2 border-red-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl">
                <RotateCcw className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">28 jours</h3>
                <h3 className="text-2xl mb-2">pour changer</h3>
                <h3 className="text-2xl mb-4">d'avis</h3>
              </div>
            </div>
            <p className="text-gray-600">délai de rétractation</p>
            <p className="text-gray-600">étendu de 14 à 28 jours</p>
          </div>

          {/* Paiement */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg border-2 border-blue-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Paiement</h3>
                <h3 className="text-2xl mb-2">en plusieurs</h3>
                <h3 className="text-2xl mb-4">fois</h3>
              </div>
            </div>
            <p className="text-gray-600">4x sans frais</p>
            <p className="text-gray-600">avec PayPal</p>
          </div>
        </div>
      </div>
    </section>
  );
}
