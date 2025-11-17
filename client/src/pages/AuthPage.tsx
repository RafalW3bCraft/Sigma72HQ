import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        await signUp(formData.email, formData.password, {
          email: formData.email,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber,
        });

        toast({
          title: t('auth_success'),
          description: 'Welcome to Sigma72HQ!',
        });
      } else {
        await signIn(formData.email, formData.password);
        
        toast({
          title: t('auth_success'),
          description: 'Welcome back!',
        });
      }

      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: t('auth_error'),
        description: error.message || 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <Card className="w-full max-w-md border-2 border-primary bg-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-foreground" data-testid="text-auth-title">
              {isSignUp ? t('auth_register_title') : t('auth_login_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">{t('auth_email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('auth_email')}
                  required
                  data-testid="input-email"
                  className="bg-background border-primary/30 focus:border-primary mt-2"
                />
              </div>

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="company" className="text-foreground">{t('auth_company')}</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder={t('auth_company')}
                      required
                      data-testid="input-company"
                      className="bg-background border-primary/30 focus:border-primary mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">{t('auth_phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder={t('auth_phone')}
                      required
                      data-testid="input-phone"
                      className="bg-background border-primary/30 focus:border-primary mt-2"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password" className="text-foreground">{t('auth_password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('auth_password')}
                  required
                  data-testid="input-password"
                  className="bg-background border-primary/30 focus:border-primary mt-2"
                />
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground">{t('auth_confirm_password')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder={t('auth_confirm_password')}
                    required
                    data-testid="input-confirm-password"
                    className="bg-background border-primary/30 focus:border-primary mt-2"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 mt-6"
                disabled={loading}
                data-testid="button-auth-submit"
              >
                {loading ? 'Loading...' : (isSignUp ? t('auth_signup_btn') : t('auth_login_btn'))}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors mt-4"
                data-testid="button-auth-switch"
              >
                {isSignUp ? t('auth_switch_login') : t('auth_switch_signup')}
              </button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
