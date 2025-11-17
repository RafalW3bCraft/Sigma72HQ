import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { currentUser, userProfile, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && (!currentUser || userProfile?.role !== 'admin')) {
      setLocation('/');
    }
  }, [currentUser, userProfile, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl" data-testid="text-loading">{t('admin_loading')}</div>
      </div>
    );
  }

  if (!currentUser || userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-forbidden-title">{t('admin_access_denied')}</h1>
          <p className="text-muted-foreground mb-6" data-testid="text-forbidden-message">
            {t('admin_no_permission')}
          </p>
          <Button onClick={() => setLocation('/')} data-testid="button-back-home">
            {t('admin_return_home')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2 gradient-text" data-testid="text-admin-title">
              {t('admin_dashboard_title')}
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-admin-subtitle">
              {t('admin_dashboard_subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-2 border-primary/50 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admin_new_contacts')}</p>
                      <p className="text-2xl font-bold text-foreground">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/50 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admin_support_tickets')}</p>
                      <p className="text-2xl font-bold text-foreground">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/50 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Briefcase className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admin_total_projects')}</p>
                      <p className="text-2xl font-bold text-foreground">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/50 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('admin_revenue')}</p>
                      <p className="text-2xl font-bold text-foreground">$0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts" data-testid="tab-contacts">{t('admin_tab_contacts')}</TabsTrigger>
                <TabsTrigger value="support" data-testid="tab-support">{t('admin_tab_support')}</TabsTrigger>
                <TabsTrigger value="projects" data-testid="tab-projects">{t('admin_tab_projects')}</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="mt-6">
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_contacts')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin_no_contacts')}</p>
                      <p className="text-sm mt-2">{t('admin_contacts_desc')}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <Card className="border-2 border-accent/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_support')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin_no_support')}</p>
                      <p className="text-sm mt-2">{t('admin_support_desc')}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card className="border-2 border-secondary/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_projects')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin_no_projects')}</p>
                      <p className="text-sm mt-2">{t('admin_projects_desc')}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
