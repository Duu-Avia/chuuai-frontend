import en from "@/app/translation-en"


const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground">ChuuAI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              {/* Боломжууд */}
              {en.Header.Боломжууд}
              </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              {/* Багцууд */}
              {en.Header.Багцууд}
              </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              {/* Бусад үйлчилгээ */}
              {en.Header.Бусадүйлчилгээ}
              </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;