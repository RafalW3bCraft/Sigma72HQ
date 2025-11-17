import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, MessageSquare, Brain, Smartphone } from 'lucide-react';

const services = [
  { icon: Code, key: 'web' as const, color: 'hsl(340, 100%, 63%)' },
  { icon: MessageSquare, key: 'bot' as const, color: 'hsl(187, 100%, 50%)' },
  { icon: Brain, key: 'ai' as const, color: 'hsl(280, 80%, 60%)' },
  { icon: Smartphone, key: 'mobile' as const, color: 'hsl(30, 90%, 55%)' },
];

export function ServicesSection() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="services" className="py-24 px-6 bg-card/30 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      <div className="max-w-[1280px] mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 glow-text"
            data-testid="text-services-title"
          >
            {t('services_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-subtitle">
            {t('services_subtitle')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card
                  className="border-2 border-primary/50 hover:border-primary bg-background/80 backdrop-blur-sm h-full hover-elevate active-elevate-2 group relative overflow-hidden"
                  data-testid={`card-service-${service.key}`}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: service.color }}
                  />
                  
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{ background: service.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div 
                        className="p-4 rounded-lg relative"
                        style={{ 
                          background: `${service.color}15`,
                          boxShadow: `0 0 20px ${service.color}30`
                        }}
                        whileHover={{ 
                          boxShadow: `0 0 30px ${service.color}50, 0 0 60px ${service.color}30`
                        }}
                      >
                        <Icon 
                          className="w-12 h-12" 
                          style={{ color: service.color }}
                        />
                      </motion.div>
                    </motion.div>
                    
                    <h3 
                      className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors"
                      data-testid={`text-service-${service.key}-title`}
                    >
                      {t(`service_${service.key}_title` as any)}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`text-service-${service.key}-desc`}>
                      {t(`service_${service.key}_desc` as any)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
