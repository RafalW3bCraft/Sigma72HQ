import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reviews = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Tech Startup',
    rating: 5,
    text: 'Excellent service! The team delivered our website on time and exceeded expectations. The attention to detail and professional communication made the entire process smooth.',
    initials: 'JS',
    color: 'hsl(340, 100%, 63%)',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    company: 'E-commerce Co',
    rating: 5,
    text: 'Our Telegram bot increased customer engagement by 300%. Highly recommended! The AI-powered features work flawlessly and our customers love the instant support.',
    initials: 'MG',
    color: 'hsl(187, 100%, 50%)',
  },
  {
    id: 3,
    name: 'David Chen',
    company: 'Finance Corp',
    rating: 5,
    text: 'Professional team, great communication, and outstanding results on our mobile app. The UI/UX design is intuitive and our users have given overwhelmingly positive feedback.',
    initials: 'DC',
    color: 'hsl(280, 80%, 60%)',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    company: 'Healthcare Solutions',
    rating: 5,
    text: 'The AI assistant they built for us handles complex medical queries with impressive accuracy. Our staff productivity has increased significantly since implementation.',
    initials: 'SJ',
    color: 'hsl(30, 90%, 55%)',
  },
];

export function ReviewsSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section id="reviews" className="py-24 px-6 bg-card/30 relative overflow-hidden">
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
            data-testid="text-reviews-title"
          >
            {t('reviews_title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-reviews-subtitle">
            {t('reviews_subtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="border-2 border-primary/50 bg-background/80 backdrop-blur-sm glass-morph"
                  data-testid={`card-review-${currentReview.id}`}
                >
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-start gap-6 mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Avatar className="w-16 h-16 border-2" style={{ borderColor: currentReview.color }}>
                          <AvatarFallback 
                            className="text-lg font-bold"
                            style={{ 
                              background: `${currentReview.color}20`,
                              color: currentReview.color
                            }}
                          >
                            {currentReview.initials}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 
                          className="font-bold text-xl text-foreground mb-1"
                          data-testid={`text-review-${currentReview.id}-name`}
                        >
                          {currentReview.name}
                        </h3>
                        <p 
                          className="text-sm text-muted-foreground mb-3"
                          data-testid={`text-review-${currentReview.id}-company`}
                        >
                          {currentReview.company}
                        </p>
                        <motion.div 
                          className="flex gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {Array.from({ length: currentReview.rating }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                            >
                              <Star 
                                className="w-5 h-5 fill-primary text-primary" 
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    <motion.p 
                      className="text-foreground/90 text-lg leading-relaxed italic"
                      data-testid={`text-review-${currentReview.id}-text`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      "{currentReview.text}"
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrev}
                className="hover-elevate active-elevate-2"
                data-testid="button-review-prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {reviews.map((review, index) => (
                  <motion.button
                    key={review.id}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-muted hover:bg-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    data-testid={`button-review-dot-${index}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="hover-elevate active-elevate-2"
                data-testid="button-review-next"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
