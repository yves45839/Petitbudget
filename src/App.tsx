import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Brands } from "./components/Brands";
import { Features } from "./components/Features";
import { Products } from "./components/Products";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Header />
      <Hero />
      <Brands />
      <Features />
      <Products />
      <Footer />
      <WhatsAppButton phoneNumber="+225 07 58 00 00 45" />
    </div>
  );
}
