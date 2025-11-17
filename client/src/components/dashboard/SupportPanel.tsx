import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supportApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function SupportPanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error(t('support_error_login'));
      }

      await supportApi.create(currentUser.uid, {
        subject: formData.subject,
        message: formData.message,
        status: 'open',
      });

      toast({
        title: t('support_success'),
      });

      setFormData({ subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: t('support_error'),
        description: error.message || t('support_error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground" data-testid="text-support-title">
          {t('support_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="subject" className="text-foreground mb-2 block">
              {t('support_subject')}
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder={t('support_subject')}
              required
              data-testid="input-support-subject"
              className="bg-background border-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-foreground mb-2 block">
              {t('support_message')}
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t('support_message')}
              required
              rows={8}
              data-testid="input-support-message"
              className="bg-background border-primary/30 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={loading}
            data-testid="button-support-submit"
          >
            {loading ? t('support_sending') : t('support_submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
