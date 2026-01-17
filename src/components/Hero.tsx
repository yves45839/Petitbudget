import { Plug, Phone, Eye } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-white text-3xl mb-8">
          LA VIDÉOSURVEILLANCE N'A JAMAIS ÉTÉ AUSSI SIMPLE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Branchez */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-300 to-gray-400 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <Plug className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-white text-2xl mb-2">BRANCHEZ</h3>
            <p className="text-gray-300">VOTRE CAMÉRA / VOTRE NVR</p>
          </div>

          {/* Appelez */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-300 to-gray-400 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <Phone className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-white text-2xl mb-2">APPELEZ</h3>
            <p className="text-gray-300">NOTRE SERVICE TECHNIQUE</p>
          </div>

          {/* Visualisez */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-300 to-gray-400 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <Eye className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-white text-2xl mb-2">VISUALISEZ</h3>
            <p className="text-gray-300">VOS CAMÉRAS À DISTANCE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
