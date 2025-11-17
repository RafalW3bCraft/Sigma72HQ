import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';

export function ProjectStatusPanel() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return [];
      return projectsApi.getByUserId(currentUser.uid);
    },
    enabled: !!currentUser,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ projectId, status }: { projectId: string; status: 'pending' | 'in-progress' | 'completed' | 'cancelled' }) => 
      projectsApi.updateStatus(projectId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', currentUser?.uid] });
      toast({
        title: t('status_updated'),
        description: t('status_update_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('create_error'),
        description: error.message || t('status_update_error'),
        variant: 'destructive',
      });
    },
  });

  const getNextStatus = (currentStatus: string): 'in-progress' | 'completed' | null => {
    switch (currentStatus) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string): string => {
    const next = getNextStatus(currentStatus);
    if (!next) return '';
    return next === 'in-progress' ? t('status_advance_start') : t('status_advance_complete');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted';
    }
  };

  const formatDate = (timestamp: number) => {
    const locale = t('nav_home') === 'Home' ? 'en-US' : 'ru-RU';
    return new Date(timestamp).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="border-2 border-primary bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground" data-testid="text-status-title">
          {t('status_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg" data-testid="text-status-empty">
              {t('status_empty')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="border border-primary/30 hover:border-primary transition-all bg-background"
                data-testid={`card-project-${project.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-project-${project.id}-name`}>
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('status_submitted')} {formatDate(project.createdAt)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`${getStatusColor(project.status)} border`}
                          data-testid={`badge-project-${project.id}-status`}
                        >
                          {t(`status_${project.status.replace('-', '_')}` as any)}
                        </Badge>
                        {getNextStatus(project.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({
                              projectId: project.id,
                              status: getNextStatus(project.status)!,
                            })}
                            disabled={updateStatusMutation.isPending}
                            className="gap-1"
                            data-testid={`button-advance-status-${project.id}`}
                          >
                            {getNextStatusLabel(project.status)}
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.status === 'pending' || project.status === 'in-progress' || project.status === 'completed'
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                        title="Pending"
                      ></div>
                      <div className="w-8 h-0.5 bg-muted"></div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.status === 'in-progress' || project.status === 'completed' ? 'bg-primary' : 'bg-muted'
                        }`}
                        title="In Progress"
                      ></div>
                      <div className="w-8 h-0.5 bg-muted"></div>
                      <div
                        className={`w-3 h-3 rounded-full ${project.status === 'completed' ? 'bg-primary' : 'bg-muted'}`}
                        title="Completed"
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
