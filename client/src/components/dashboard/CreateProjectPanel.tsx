import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { projectsApi } from '@/lib/api';
import { InsertProject } from '@shared/schema';

export function CreateProjectPanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<InsertProject>>({
    serviceType: undefined,
    projectName: '',
    description: '',
    timeline: '',
    budget: '',
    status: 'pending',
    userId: '',
  });

  const serviceTypes = [
    { value: 'website', label: t('create_service_website') },
    { value: 'telegram-bot', label: t('create_service_telegram_bot') },
    { value: 'ai-assistant', label: t('create_service_ai_assistant') },
    { value: 'mobile-app', label: t('create_service_mobile_app') },
    { value: 'e-commerce', label: t('create_service_ecommerce') },
    { value: 'other', label: t('create_service_other') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error(t('create_error_login'));
      }
      
      if (!formData.serviceType || !formData.projectName || !formData.description) {
        throw new Error(t('create_error_required'));
      }

      if (formData.description.length < 10) {
        throw new Error(t('create_error_description'));
      }

      await projectsApi.create(currentUser.uid, {
        serviceType: formData.serviceType,
        projectName: formData.projectName,
        description: formData.description,
        timeline: formData.timeline,
        budget: formData.budget,
        status: 'pending',
      });

      toast({
        title: t('create_success'),
      });

      setFormData({
        serviceType: undefined,
        projectName: '',
        description: '',
        timeline: '',
        budget: '',
        status: 'pending',
        userId: '',
      });
    } catch (error: any) {
      toast({
        title: t('create_error'),
        description: error.message || t('create_error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground" data-testid="text-create-project-title">
          {t('create_project_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="service-type" className="text-foreground mb-2 block">
              {t('create_service_label')}
            </Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value as any })}
            >
              <SelectTrigger
                id="service-type"
                className="bg-background border-primary/30 focus:border-primary"
                data-testid="select-service-type"
              >
                <SelectValue placeholder={t('create_service_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} data-testid={`option-service-${type.value}`}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project-name" className="text-foreground mb-2 block">
              {t('create_name_label')}
            </Label>
            <Input
              id="project-name"
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder={t('create_name_placeholder')}
              required
              data-testid="input-project-name"
              className="bg-background border-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground mb-2 block">
              {t('create_desc_label')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('create_desc_placeholder')}
              required
              minLength={10}
              rows={6}
              data-testid="input-description"
              className="bg-background border-primary/30 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline" className="text-foreground mb-2 block">
                {t('create_timeline_label')}
              </Label>
              <Input
                id="timeline"
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder={t('create_timeline_placeholder')}
                data-testid="input-timeline"
                className="bg-background border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="budget" className="text-foreground mb-2 block">
                {t('create_budget_label')}
              </Label>
              <Input
                id="budget"
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={t('create_budget_placeholder')}
                data-testid="input-budget"
                className="bg-background border-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={loading}
            data-testid="button-submit-project"
          >
            {loading ? t('create_submitting') : t('create_submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
