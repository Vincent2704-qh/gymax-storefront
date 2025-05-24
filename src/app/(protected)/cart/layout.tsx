import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
