import { ShoppingCart, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Products() {
  const products = [
    {
      id: 1,
      name: "Caméra de surveillance 4MP H265+ avec IA audio intégrée",
      ref: "DESTOCK-VIOI C440(2.8mm)",
      price: "40,10",
      oldPrice: "72,50",
      discount: "Ou 10,03 € en 4x sans frais",
      badge: "5 ans garantie",
      image: "https://images.unsplash.com/photo-1762953007649-8ea70115059a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb21lJTIwc2VjdXJpdHklMjBjYW1lcmF8ZW58MXx8fHwxNzY0NTg4NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
    },
    {
      id: 2,
      name: "Caméra noire Hikvision DS-2CD2183G2-IS(black) 4K",
      ref: "DESTOCK-DS-2CD2183G2-IS(2.8mm)black",
      price: "85,00",
      oldPrice: "120,00",
      image: "https://images.unsplash.com/photo-1621886943381-cb97cc18b17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDQ1RWJTIwY2FtZXJhJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjQ1ODg1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
    },
    {
      id: 3,
      name: "Kit de surveillance Dahua 8 caméras 2MP + NVR",
      ref: "KIT-DAHUA-8CAM-2MP",
      price: "450,00",
      oldPrice: "650,00",
      image: "https://images.unsplash.com/photo-1672073311074-f60c4a5e7b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGNhbWVyYSUyMHN1cnZlaWxsYW5jZXxlbnwxfHx8fDE3NjQ1MTc3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
    },
    {
      id: 4,
      name: "Caméra EZVIZ C6N 360° WiFi 2MP",
      ref: "EZVIZ-C6N-2MP-WIFI",
      price: "55,00",
      oldPrice: "80,00",
      image: "https://images.unsplash.com/photo-1758514474995-390bfe57c5be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2ZWlsbGFuY2UlMjBzeXN0ZW18ZW58MXx8fHwxNzY0NTg4NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      inStock: true,
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl mb-8">BONNES AFFAIRES DU JOUR</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
            >
              <div className="relative aspect-square bg-gray-100 rounded-3xl m-4">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm">
                    {product.badge}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg mb-2 line-clamp-2 h-14">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Ref : {product.ref}</p>

                {product.oldPrice && (
                  <p className="text-sm text-gray-400 line-through mb-1">
                    {product.oldPrice} €
                  </p>
                )}

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    {product.price} €
                  </span>
                  <span className="text-sm text-gray-600">TTC</span>
                </div>

                {product.discount && (
                  <p className="text-sm text-green-600 mb-4">{product.discount}</p>
                )}

                {product.inStock ? (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-full hover:shadow-lg transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-full cursor-not-allowed">
                    Rupture de stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
