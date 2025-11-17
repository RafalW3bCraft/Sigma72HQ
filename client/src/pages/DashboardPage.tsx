import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreateProjectPanel } from '@/components/dashboard/CreateProjectPanel';
import { ProjectStatusPanel } from '@/components/dashboard/ProjectStatusPanel';
import { SupportPanel } from '@/components/dashboard/SupportPanel';
import { InfoPanel } from '@/components/dashboard/InfoPanel';
import { Card } from '@/components/ui/card';

type Panel = 'create-project' | 'project-status' | 'support' | 'info';

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { currentUser, userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const [activePanel, setActivePanel] = useState<Panel>('create-project');

  useEffect(() => {
    if (!loading && !currentUser) {
      setLocation('/auth');
    }
  }, [currentUser, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return null;
  }

  const panels: { id: Panel; label: string }[] = [
    { id: 'create-project', label: t('dashboard_create_project') },
    { id: 'project-status', label: t('dashboard_project_status') },
    { id: 'support', label: t('dashboard_support') },
    { id: 'info', label: t('dashboard_info') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-dashboard-welcome">
              {t('dashboard_welcome')}, {userProfile.companyName}
            </h1>
            <p className="text-muted-foreground" data-testid="text-dashboard-email">{userProfile.email}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 bg-card border-2 border-primary p-6">
              <nav className="space-y-2">
                {panels.map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(panel.id)}
                    className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all ${
                      activePanel === panel.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                    data-testid={`button-panel-${panel.id}`}
                  >
                    {panel.label}
                  </button>
                ))}
              </nav>
            </Card>

            <div className="lg:col-span-3">
              {activePanel === 'create-project' && <CreateProjectPanel />}
              {activePanel === 'project-status' && <ProjectStatusPanel />}
              {activePanel === 'support' && <SupportPanel />}
              {activePanel === 'info' && <InfoPanel />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
