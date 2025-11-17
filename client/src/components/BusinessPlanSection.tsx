import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const priorities = [
  { icon: '👥', key: 'db' as const },
  { icon: '🔒', key: 'privacy' as const },
  { icon: '☁️', key: 'hosting' as const },
  { icon: '💳', key: 'payment' as const },
  { icon: '🔍', key: 'seo' as const },
  { icon: '📱', key: 'mobile' as const },
];

export function BusinessPlanSection() {
  const { t } = useLanguage();

  return (
    <section id="plan" className="py-24 px-6 bg-card/50">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-plan-title">
            {t('plan_title')}
          </h2>
          <p className="text-xl text-primary font-semibold" data-testid="text-plan-subtitle">
            {t('plan_subtitle')}
          </p>
        </div>

        <Card className="mb-8 border-l-4 border-l-primary bg-background">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              📋 {t('plan_goal_title')}
            </h3>
            <p className="text-muted-foreground mb-4">{t('plan_goal_desc')}</p>
            <ul className="space-y-2 ml-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <li key={num} className="text-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t(`plan_goal_${num}` as any)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border-l-4 border-l-primary bg-background">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              🎯 {t('plan_stages_title')}
            </h3>
            <ol className="space-y-3 ml-6">
              {[1, 2, 3, 4].map((num) => (
                <li key={num} className="text-foreground">
                  {t(`plan_stage_${num}` as any)}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            🔐 {t('plan_priorities_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priorities.map((priority) => (
              <Card
                key={priority.key}
                className="border border-primary/50 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all bg-background"
                data-testid={`card-priority-${priority.key}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{priority.icon}</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-priority-${priority.key}-title`}>
                    {t(`priority_${priority.key}` as any)}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-priority-${priority.key}-desc`}>
                    {t(`priority_${priority.key}_desc` as any)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
