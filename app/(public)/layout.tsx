import GSAPProvider from "@/components/GSAPProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"));
const ChatWidget = dynamic(() => import("@/components/ChatWidget"));

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <GSAPProvider>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="public-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </GSAPProvider>
  );
}
