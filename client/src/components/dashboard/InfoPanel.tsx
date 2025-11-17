import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InfoPanel() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Most projects take 2-6 weeks depending on complexity and requirements.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cryptocurrency payments for secure and fast transactions.',
    },
    {
      question: 'Can I request changes during development?',
      answer: 'Yes! We offer iterative development with regular check-ins and revisions.',
    },
    {
      question: 'Do you provide post-launch support?',
      answer: 'Absolutely. All projects include 30 days of free support and maintenance.',
    },
  ];

  return (
    <Card className="border-2 border-primary bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground" data-testid="text-info-title">
          {t('info_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4" data-testid="text-info-how-title">
            {t('info_how_title')}
          </h3>
          <ol className="space-y-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={num} className="text-foreground flex items-start gap-2" data-testid={`text-info-step-${num}`}>
                <span className="text-primary font-semibold min-w-[24px]">{num}.</span>
                <span>{t(`info_how_${num}` as any)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-4" data-testid="text-info-faq-title">
            {t('info_faq_title')}
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-background border-primary/30" data-testid={`card-faq-${index}`}>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-2" data-testid={`text-faq-${index}-question`}>
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid={`text-faq-${index}-answer`}>
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-accent/20 rounded-lg p-6 border border-primary/30">
          <h4 className="font-semibold text-foreground mb-2">Need More Help?</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Have questions? Contact our support team using the Support panel or email us directly.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">support@sigma72hq.com</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
