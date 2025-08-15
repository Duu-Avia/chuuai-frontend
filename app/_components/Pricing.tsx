'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import en from "@/app/translation-en"


const Pricing = () => {
const[selectedPlan, setSelectedPlan] = useState("");
  const plans = [
  {
    name: "Сошиал Стартер",
    price: "100,000₮",
    period: "/сард",
    description: "Сошиал автоматжуулалтаа эхлүүлэх жижиг бизнест",
    popular: false,
    features: [
      "AI автомат хариулт",
      "Зарж буй бүтээгдэхүүн/үйлчилгээгээ санд хадгалах",
       "Сард 1,500 мессеж хүртэл",
    ]
  },
  {
    name: "Сошиал Про",
    price: "220,000₮",
    period: "/сард",
    description: "Өсөж буй бизнест зориулсан илүү хүчтэй сошиал шийдэл",
    popular: true,
    features: [
      "AI автомат хариулт",
      "Зарж буй бүтээгдэхүүн/үйлчилгээгээ санд хадгалах",
        "Admin хянах хэсэг",
       "Сард 10,000 мессеж хүртэл",
      "бараа үлдэгдэл анхааруулга",
      "Захиалга хүлээн авах товч, процесс автоматжуулалт",
    ]
  },
  {
    name: "Сошиал Энтерпрайз",
    price: "350,000₮",
    period: "/сард",
    description: "Томоохон брэндүүдэд бүрэн автоматжуулалт",
    popular: false,
    features: [
      "AI автомат хариулт",
      "Зарж буй бүтээгдэхүүн/үйлчилгээгээ санд хадгалах",
      "Admin хянах хэсэг",
       "Хязгааргүй мессеж ",
      "бараа үлдэгдэл анхааруулга",
       "Захиалга хүлээн авах товч, процесс автоматжуулалт",
      "Instagram 1 хуудасаа үнэгүй холбох боломж"
    ]
  }
];

  return (
    <section id="pricing" className="py-20 px-6 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            {/* Та өөрт тохирох багцаа сонгоно уу? */}
            {en.Таөөрт}
            
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
           {/* Таны бизнест тохируулсан уян хатан үнийн сонголтууд. */}
            {en.Таныбизнест}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`bg-card border-border hover:shadow-xl transition-all duration-300 relative ${
                plan.popular ? 'border-primary/50 shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/page-connection" className="w-full">
<Button
  className={` w-full mt-6 cursor-pointer min-w-48 shadow-xs hover:shadow-[0_0_25px_rgba(173,216,230,0.4)] hover:scale-103 transition-all duration-300 ${
    plan.name === "Сошиал Про"
      ? selectedPlan === plan.name
        ? "bg-[#527AFF] text-white ring-2 ring-[#527AFF]"
        : "bg-[#527AFF] text-white hover:bg-[#3e66f5]"
      : selectedPlan === plan.name
        ? "bg-[hsl(var(--primary))] text-white ring-2 ring-primary"
        : "bg-muted text-foreground hover:bg-muted-foreground/10"
  }`}
  size="lg"
  onClick={() => setSelectedPlan(plan.name)}
>
  Худалдаж авах
</Button>
                </Link>
              </CardContent>
            </Card>
          ))} */}

 {en.Pricing.plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`bg-card border-border hover:shadow-xl transition-all duration-300 relative ${
                plan.popular ? 'border-primary/50 shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/page-connection" className="w-full">
<Button
  className={` w-full mt-6 cursor-pointer min-w-48 shadow-xs hover:shadow-[0_0_25px_rgba(173,216,230,0.4)] hover:scale-103 transition-all duration-300 ${
    plan.name === "Social Pro"
      ? selectedPlan === plan.name
        ? "bg-[#527AFF] text-white ring-2 ring-[#527AFF]"
        : "bg-[#527AFF] text-white hover:bg-[#3e66f5]"
      : selectedPlan === plan.name
        ? "bg-[hsl(var(--primary))] text-white ring-2 ring-primary"
        : "bg-muted text-foreground hover:bg-muted-foreground/10"
  }`}
  size="lg"
  onClick={() => setSelectedPlan(plan.name)}
>
  {/* Худалдаж авах */}
  {en.ButtonForBuy}
</Button>
                </Link>
              </CardContent>
            </Card>
          ))}

        </div>
        
        <div className="text-center mt-12">

          <p className="text-sm text-muted-foreground">
            Do you need a help? <a href="#" className="text-primary hover:underline">Contact</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;