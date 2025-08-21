import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import en from "@/app/translation-en"


const Hero = () => {
  return (
    <section className="py-20 px-6 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(230_85%_65%/0.1),transparent_50%)]"></div>
      <div className="container mx-auto max-w-4xl text-center relative">
   
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Таны сошиал бизнесийн туслах  
          {/* {en.Hero.Танысошиал} */}
          <span className="bg-gradient-primary bg-clip-text text-transparent"> ChuuAI </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
    Facebook болон Instagram-д зориулсан ухаалаг чатбот нь хэрэглэхэд маш хялбар, та ганцхан товч дарахад л таны өмнөөс ухаалаг бот 24/7 цагийн турш хэрэглэгчидтэй харилцаж эхлэх болно.
          {/* {en.Hero.Facebookболон} */}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
         <Button
  variant="default"
  size="lg"
  className="cursor-pointer min-w-48 shadow-md hover:shadow-[0_0_50px_rgba(173,216,230,0.4)] hover:scale-105 transition-all duration-300"
>
  Худалдаж авах
  {/* {en.Hero.Худалдажавах} */}
</Button>

          <Button variant="outline" size="lg" className="min-w-48">
            Watch Demo
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2M+</div>
            <div className="text-muted-foreground">Харилцсан мессеж</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">+20</div>
            <div className="text-muted-foreground">Хэрэглэч гишүүд</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">80%</div>
            <div className="text-muted-foreground">Борлуулалтын өсөлт</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;