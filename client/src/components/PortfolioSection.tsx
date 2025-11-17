import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PortfolioDialog } from '@/components/PortfolioDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';

const portfolioItems = [
  { 
    id: 1, 
    title: 'E-commerce Platform', 
    desc: 'Full-featured online store with payment integration and real-time inventory', 
    category: 'e-commerce',
    tech: ['React', 'Node.js', 'Stripe', 'PostgreSQL', 'Redis'],
    color: 'hsl(340, 100%, 63%)',
    client: 'Fashion Retail Co.',
    duration: '4 months',
    challenge: 'The client needed a scalable e-commerce solution that could handle thousands of concurrent users during peak sales, with real-time inventory management across multiple warehouses.',
    solution: 'Built a microservices architecture with React frontend, Node.js backend, PostgreSQL for data persistence, and Redis for caching. Implemented Stripe for payments and developed a custom inventory management system with real-time synchronization.',
    outcome: 'Successfully launched with 99.9% uptime during Black Friday sales. The platform now processes over 10,000 orders monthly with seamless payment processing and inventory tracking.',
    metrics: [
      { label: 'Monthly Orders', value: '10K+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Load Time', value: '<2s' },
    ],
    liveUrl: 'https://example.com',
  },
  { 
    id: 2, 
    title: 'Telegram Bot for SaaS', 
    desc: 'Automated customer service bot with AI learning capabilities', 
    category: 'telegram-bot',
    tech: ['Python', 'TensorFlow', 'Telegram API', 'MongoDB'],
    color: 'hsl(187, 100%, 50%)',
    client: 'SaaS Startup',
    duration: '2 months',
    challenge: 'The client\'s customer support team was overwhelmed with repetitive questions, leading to slow response times and customer dissatisfaction.',
    solution: 'Developed an intelligent Telegram bot using Python and TensorFlow that handles common customer queries automatically. The bot learns from past interactions and can escalate complex issues to human agents.',
    outcome: 'Reduced support ticket volume by 60% and improved average response time from 4 hours to under 2 minutes for common queries.',
    metrics: [
      { label: 'Tickets Reduced', value: '60%' },
      { label: 'Response Time', value: '<2min' },
      { label: 'Accuracy', value: '92%' },
    ],
  },
  { 
    id: 3, 
    title: 'Mobile Banking App', 
    desc: 'Cross-platform financial management application with biometric security', 
    category: 'mobile-app',
    tech: ['React Native', 'TypeScript', 'Firebase', 'Plaid API'],
    color: 'hsl(280, 80%, 60%)',
    client: 'FinTech Company',
    duration: '6 months',
    challenge: 'Creating a secure, user-friendly mobile banking experience that works seamlessly across iOS and Android while meeting strict financial regulations and security requirements.',
    solution: 'Built with React Native for cross-platform compatibility, integrated Plaid API for bank connections, and implemented biometric authentication. Used Firebase for real-time data sync and secure cloud storage.',
    outcome: 'Launched to 50,000+ users with a 4.8 star rating. Zero security incidents reported and 85% user retention after 3 months.',
    metrics: [
      { label: 'Active Users', value: '50K+' },
      { label: 'App Rating', value: '4.8★' },
      { label: 'Retention', value: '85%' },
    ],
  },
  { 
    id: 4, 
    title: 'AI Customer Support', 
    desc: 'Intelligent chatbot for 24/7 customer support with natural language processing', 
    category: 'ai-assistant',
    tech: ['OpenAI GPT-4', 'Python', 'FastAPI', 'PostgreSQL'],
    color: 'hsl(30, 90%, 55%)',
    client: 'E-learning Platform',
    duration: '3 months',
    challenge: 'Providing round-the-clock customer support across multiple time zones was expensive and inefficient, while maintaining high quality responses.',
    solution: 'Developed an AI-powered chatbot using OpenAI GPT-4, trained on the company\'s knowledge base. Built with FastAPI for high-performance API endpoints and PostgreSQL for conversation history.',
    outcome: 'Achieved 24/7 availability with 89% first-contact resolution rate. Reduced support costs by 45% while improving customer satisfaction scores.',
    metrics: [
      { label: 'Availability', value: '24/7' },
      { label: 'Resolution Rate', value: '89%' },
      { label: 'Cost Savings', value: '45%' },
    ],
  },
  { 
    id: 5, 
    title: 'Real Estate Portal', 
    desc: 'Advanced property search and listing platform with virtual tours', 
    category: 'website',
    tech: ['Next.js', 'PostgreSQL', 'Mapbox', 'AWS S3'],
    color: 'hsl(160, 75%, 50%)',
    client: 'Property Management Group',
    duration: '5 months',
    challenge: 'Real estate agents needed a powerful platform to showcase properties with interactive maps, virtual tours, and advanced filtering for potential buyers.',
    solution: 'Built a Next.js application with server-side rendering for SEO, integrated Mapbox for interactive property maps, PostgreSQL for robust search, and AWS S3 for media storage. Added 360° virtual tour capabilities.',
    outcome: 'Platform now hosts 5,000+ property listings with 100,000+ monthly visitors. Agent productivity increased by 40% through automated listing management.',
    metrics: [
      { label: 'Property Listings', value: '5K+' },
      { label: 'Monthly Visitors', value: '100K+' },
      { label: 'Agent Productivity', value: '+40%' },
    ],
    liveUrl: 'https://example.com',
  },
  { 
    id: 6, 
    title: 'Fitness App', 
    desc: 'Personal training tracking and workout planning with AR features', 
    category: 'mobile-app',
    tech: ['Flutter', 'ARKit', 'ARCore', 'Firebase'],
    color: 'hsl(340, 100%, 63%)',
    client: 'Fitness Studio Chain',
    duration: '4 months',
    challenge: 'Fitness trainers needed a way to provide personalized workout plans and track client progress remotely, with proper form demonstration.',
    solution: 'Developed a Flutter app with AR features using ARKit and ARCore for exercise form visualization. Integrated Firebase for real-time progress tracking and cloud-based workout plans.',
    outcome: 'Deployed to 10,000+ users across 50 fitness studios. Improved client engagement by 65% and enabled trainers to manage 3x more clients remotely.',
    metrics: [
      { label: 'Active Users', value: '10K+' },
      { label: 'Engagement', value: '+65%' },
      { label: 'Studios', value: '50+' },
    ],
  },
];

const categories = ['all', 'website', 'telegram-bot', 'mobile-app', 'ai-assistant', 'e-commerce'];

export function PortfolioSection() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const handleViewDetails = (item: typeof portfolioItems[0]) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <section id="portfolio" className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
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
            data-testid="text-portfolio-title"
          >
            {t('portfolio_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-portfolio-subtitle">
            {t('portfolio_subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'glow-border' : ''}
                  data-testid={`button-filter-${category}`}
                >
                  {category === 'all' ? t('portfolio_filter_all') : category.replace('-', ' ')}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className="border border-primary/50 hover:border-primary overflow-hidden bg-card h-full hover-elevate active-elevate-2 group"
                  data-testid={`card-portfolio-${item.id}`}
                >
                  <div 
                    className="h-48 relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-8xl font-bold opacity-20"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {String(item.id).padStart(2, '0')}
                      </motion.div>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Code2 className="w-8 h-8" style={{ color: item.color }} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 
                      className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
                      data-testid={`text-portfolio-${item.id}-title`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm" data-testid={`text-portfolio-${item.id}-desc`}>
                      {item.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tech.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group/btn hover-elevate active-elevate-2"
                      onClick={() => handleViewDetails(item)}
                      data-testid={`button-portfolio-${item.id}-view`}
                    >
                      <span>View Case Study</span>
                      <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedItem && (
        <PortfolioDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
        />
      )}
    </section>
  );
}
