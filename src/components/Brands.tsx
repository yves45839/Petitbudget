import { ChevronLeft, ChevronRight } from "lucide-react";

export function Brands() {
  const brands = [
    { name: "Dahua", logo: "DAHUA" },
    { name: "Hikvision", logo: "HIKVISION" },
    { name: "EZVIZ", logo: "EZVIZ" },
    { name: "Uniview", logo: "UNIVIEW" },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl">NOS MARQUES</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center h-32"
            >
              <span className="text-white text-2xl">{brand.logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
