import GSAPProvider from "@/components/GSAPProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"));
const ChatWidget = dynamic(() => import("@/components/ChatWidget"));

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <GSAPProvider>
      <LoadingScreen />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </GSAPProvider>
  );
}
