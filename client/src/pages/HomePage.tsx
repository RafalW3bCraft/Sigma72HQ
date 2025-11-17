import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { BusinessPlanSection } from '@/components/BusinessPlanSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ContactSection } from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sigma72HQ - Premium IT Solutions & Digital Transformation"
        description="Transform your business with cutting-edge IT solutions from Sigma72HQ. Expert web development, AI assistants, Telegram bots, mobile apps, and e-commerce platforms."
        keywords="IT solutions, web development, AI assistant, Telegram bot, mobile app development, e-commerce, digital transformation, software development"
        canonical="https://sigma72hq.replit.app/"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sigma72HQ",
          "description": "Premium IT solutions and digital transformation services",
          "url": "https://sigma72hq.replit.app",
          "logo": "/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Sales",
            "availableLanguage": ["English", "Russian"]
          },
          "sameAs": []
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <BusinessPlanSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
