import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import en from "@/app/translation-en"

const Features = () => {
  const features = [
    {
      title: "Facebook Messenger холболт",
      description: "Хэрэглэгчтэй харилцах яриаг автоматжуулахын тулд Facebook хуудастайгаа саадгүй холбох.",
      icon: "📘",
      details: [
        "Нэг товч дарахад л холбогдох автоматжуулалт",
        "Мессеж бүрт автоматаар бараа/үйлчилгээ танилцуулах",
        "Өөрийн чатнаасаа шууд бараа бүтээгдэхүүнээ хянах(хасаж нэмэх)",
        "Захиалга хүлээн авах процессийг автоматжуулалт",
      ]
    },
    {
      title: "Instagram Messenger холболт",
      description: "Хэрэглэгчтэй харилцах яриаг автоматжуулахын тулд Instagram хуудастайгаа саадгүй холбох.",
      icon: "📸",
      details: [
        "Нэг товч дарахад л холбогдох автоматжуулалт",
        "Мессеж бүрт автоматаар бараа/үйлчилгээ танилцуулах",
        "Өөрийн чатнаасаа шууд бараа бүтээгдэхүүнээ хянах(хасаж нэмэх)",
        "Захиалга хүлээн авах процессийг автоматжуулалт",
      ]
    },

    {
      title: "Хамгийн гол түргэн шуурхай бөгөөд хямд үнэ",
      description: "Зөвхөн online website бус сошиал хуудсууд хүртэл бараа материалийн сан, үлдэгдэлээ хүссэнээрээ өөрчлөх хянах боломж.",
      icon: "🎯",
      details: [
        "Бараа материалын сан үүсгэх",
        "Admin хянах хэсгээс бараа материалаа харах",
        "Ухаалаг чатботтойгоо өөрөө харилцан бараа материалаа хянах боломж",
        "Аюулгүй найдвартай"
      ]
    },

 
  ];

  return (
    <section id="features" className="py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Сошиал медиаг ухаалаг chatbot улам хялбаршуулсан нь
             {/* {en.Сошиалмедиаг} */}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
           Хэрэглэгч болгондоо биечлэн хариулах хугацаагаа та өөр зүйлд зарцуулах боломж
            {/* {en.Хэрэглэгчболгондоо} */}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

             {/* {en.Features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))} */}
        </div>
      </div>
    </section>
  );
};

export default Features;