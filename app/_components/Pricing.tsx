'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleClick = (planName: string) => {
    if (selectedPlan === planName && clickCount === 1) {
      router.push("/page-connection");
    } else {
      setSelectedPlan(planName);
      setClickCount(1);
      setTimeout(() => setClickCount(0), 3000); // reset after 3s
    }
  };

  const plans = [
    {
      name: "Сошиал Стартер",
      price: "100,000",
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
      price: "220,000",
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
      price: "350,000",
      period: "/сард",
      description: "Томоохон брэндүүдэд бүрэн автоматжуулалт",
      popular: false,
      features: [
        "AI автомат хариулт",
        "Зарж буй бүтээгдэхүүн/үйлчилгээгээ санд хадгалах",
        "Admin хянах хэсэг",
        "Хязгааргүй мессеж",
        "бараа үлдэгдэл анхааруулга",
        "Захиалга хүлээн авах товч, процесс автоматжуулалт",
        "Instagram хуудасаа үнэгүй холбох боломж"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Та өөрт тохирох багцаа сонгоно уу?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Таны бизнест тохируулсан уян хатан үнийн сонголтууд.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
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

                <Button
                  variant={selectedPlan === plan.name ? "default" : "secondary"}
                  className={`cursor-pointer w-full mt-6 ${
                    selectedPlan === plan.name ? "ring-2 ring-primary" : ""
                  }`}
                  size="lg"
                  onClick={() => handleClick(plan.name)}
                >
                  Худалдаж авах
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Тусламж хэрэгтэй юу? <a href="#" className="text-primary hover:underline">Холбогдох</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
