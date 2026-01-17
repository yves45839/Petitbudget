import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const handleClick = () => {
    const formattedNumber = phoneNumber.replace(/\s/g, "");
    const message = "Bonjour, j'aimerais avoir des informations sur vos produits.";
    window.open(
      `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all z-50 group"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
        Discuter sur WhatsApp
      </span>
    </button>
  );
}
