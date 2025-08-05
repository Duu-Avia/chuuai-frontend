import Hero from "./_components/Hero";
import Pricing from "./_components/Pricing";
import Footer from "./_components/Footer";
import Features from "./_components/Features";
import Header from "./_components/Header";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Page;