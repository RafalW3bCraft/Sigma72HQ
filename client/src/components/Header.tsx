import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '@assets/logo.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = ['home', 'services', 'portfolio', 'plan', 'reviews', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#home', id: 'home', label: t('nav_home') },
    { href: '/#services', id: 'services', label: t('nav_services') },
    { href: '/#portfolio', id: 'portfolio', label: t('nav_portfolio') },
    { href: '/#plan', id: 'plan', label: t('nav_plan') },
    { href: '/#reviews', id: 'reviews', label: t('nav_reviews') },
    { href: '/#contact', id: 'contact', label: t('nav_contact') },
  ];

  const handleLogout = async () => {
    await signOut();
    setLocation('/');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/98 backdrop-blur-lg border-b-2 border-primary/50 shadow-lg' 
          : 'bg-background/80 backdrop-blur-md border-b border-primary/30'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md p-2 -ml-2" data-testid="link-home">
            <motion.div 
              className="w-10 h-10 rounded-md overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={logoImage} alt="Sigma72HQ Logo" className="w-full h-full object-contain" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">SIGMA72HQ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className={`text-sm font-medium relative group transition-colors ${
                  activeSection === link.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: activeSection === link.id ? '100%' : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            <div className="flex gap-1 bg-card border border-primary/30 rounded-md p-1">
              <motion.button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-lang-en"
              >
                EN
              </motion.button>
              <motion.button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                  language === 'ru'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-lang-ru"
              >
                RU
              </motion.button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="hover-elevate active-elevate-2" data-testid="button-dashboard">
                    {t('nav_dashboard')}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="secondary" className="hover-elevate active-elevate-2" data-testid="button-logout">
                  {t('nav_logout')}
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="glow-border hover-elevate active-elevate-2" data-testid="button-signup">
                  {t('nav_signup')}
                </Button>
              </Link>
            )}
          </div>

          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            whileTap={{ scale: 0.9 }}
            data-testid="button-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 border-t border-border pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className={`text-left font-medium transition-colors ${
                      activeSection === link.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                      language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                      language === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    RU
                  </button>
                </div>

                {currentUser ? (
                  <div className="flex flex-col gap-2 pt-4">
                    <Link href="/dashboard">
                      <Button className="w-full" variant="outline" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-dashboard">
                        {t('nav_dashboard')}
                      </Button>
                    </Link>
                    <Button className="w-full" onClick={handleLogout} variant="secondary" data-testid="button-mobile-logout">
                      {t('nav_logout')}
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-signup">
                      {t('nav_signup')}
                    </Button>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
