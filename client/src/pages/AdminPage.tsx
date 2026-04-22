import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, Briefcase, TrendingUp, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { projectsApi, supportApi, contactApi, usersApi } from '@/lib/api';
import type { Project, ContactSubmission, SupportMessage, UserProfile } from '@shared/schema';

type ContactStatus = ContactSubmission['status'];
type SupportStatus = SupportMessage['status'];

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { currentUser, userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const isAdmin = !!currentUser && userProfile?.role === 'admin';
  const locale = t('nav_home') === 'Home' ? 'en-US' : 'ru-RU';

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const [supportTickets, setSupportTickets] = useState<SupportMessage[]>([]);
  const [supportLoading, setSupportLoading] = useState(true);
  const [supportError, setSupportError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const usersById = useMemo(() => {
    const map = new Map<string, UserProfile>();
    users.forEach((profile) => map.set(profile.uid, profile));
    return map;
  }, [users]);

  useEffect(() => {
    if (!loading && (!currentUser || userProfile?.role !== 'admin')) {
      setLocation('/');
    }
  }, [currentUser, userProfile, loading, setLocation]);

  useEffect(() => {
    if (!isAdmin) {
      setProjects([]);
      setProjectsLoading(false);
      setProjectsError(null);
      return;
    }

    setProjectsLoading(true);
    setProjectsError(null);
    const unsubscribe = projectsApi.subscribeAll(
      (next) => {
        setProjects(next);
        setProjectsLoading(false);
      },
      (error) => {
        setProjectsError(error.message);
        setProjectsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      setContacts([]);
      setContactsLoading(false);
      setContactsError(null);
      return;
    }

    setContactsLoading(true);
    setContactsError(null);
    const unsubscribe = contactApi.subscribeAll(
      (next) => {
        setContacts(next);
        setContactsLoading(false);
      },
      (error) => {
        setContactsError(error.message);
        setContactsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      setSupportTickets([]);
      setSupportLoading(false);
      setSupportError(null);
      return;
    }

    setSupportLoading(true);
    setSupportError(null);
    const unsubscribe = supportApi.subscribeAll(
      (next) => {
        setSupportTickets(next);
        setSupportLoading(false);
      },
      (error) => {
        setSupportError(error.message);
        setSupportLoading(false);
      },
    );
    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      setUsers([]);
      setUsersLoading(false);
      setUsersError(null);
      return;
    }

    setUsersLoading(true);
    setUsersError(null);
    const unsubscribe = usersApi.subscribeAll(
      (next) => {
        setUsers(next);
        setUsersLoading(false);
      },
      (error) => {
        setUsersError(error.message);
        setUsersLoading(false);
      },
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getContactNextStatus = (status: ContactStatus): ContactStatus | null => {
    if (status === 'new') return 'read';
    if (status === 'read') return 'responded';
    return null;
  };

  const getSupportNextStatus = (status: SupportStatus): SupportStatus | null => {
    if (status === 'open') return 'in-progress';
    if (status === 'in-progress') return 'resolved';
    return null;
  };

  const contactStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      contactApi.updateStatus(id, status),
    onSuccess: () => {
      toast({
        title: t('admin_action_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin_error_generic'),
        description: error?.message || String(error),
        variant: 'destructive',
      });
    },
  });

  const supportStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SupportStatus }) =>
      supportApi.updateStatus(id, status),
    onSuccess: () => {
      toast({
        title: t('admin_action_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin_error_generic'),
        description: error?.message || String(error),
        variant: 'destructive',
      });
    },
  });

  const projectStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Project['status'] }) =>
      projectsApi.updateStatus(id, status),
    onSuccess: () => {
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

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl" data-testid="text-loading">
          {t('admin_loading')}
        </div>
      </div>
    );
  }

  const newContactsCount = contacts.filter((contact) => contact.status === 'new').length;
  const openSupportCount = supportTickets.filter((ticket) => ticket.status !== 'resolved').length;
  const totalProjects = projects.length;

  const completedProjects = projects.filter((project) => project.status === 'completed');
  const totalRevenue = completedProjects.reduce((sum, project) => {
    if (!project.budget) return sum;
    const numeric = parseFloat(project.budget.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);
  const formattedRevenue = totalRevenue > 0
    ? new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: locale === 'ru-RU' ? 'RUB' : 'USD',
        maximumFractionDigits: 0,
      }).format(totalRevenue)
    : completedProjects.length > 0
    ? `${completedProjects.length} ${completedProjects.length === 1 ? 'project' : 'projects'}`
    : '—';

  const renderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
      'in-progress': 'bg-blue-500/20 text-blue-500 border-blue-500/40',
      completed: 'bg-green-500/20 text-green-500 border-green-500/40',
      cancelled: 'bg-red-500/20 text-red-500 border-red-500/40',
      new: 'bg-primary/15 text-primary border-primary/30',
      read: 'bg-muted text-muted-foreground border-border',
      responded: 'bg-green-500/15 text-green-500 border-green-500/30',
      open: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
      resolved: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    };

    return (
      <Badge className={`${map[status] ?? 'bg-muted'} border`} data-testid={`badge-${status}`}>
        {t(`status_${status.replace('-', '_')}` as any) ?? status}
      </Badge>
    );
  };

  const summaryLoading = projectsLoading || contactsLoading || supportLoading;
  const projectDataError = projectsError || usersError;

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
                      <p className="text-2xl font-bold text-foreground">
                        {summaryLoading ? '—' : newContactsCount}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {summaryLoading ? '—' : openSupportCount}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {summaryLoading ? '—' : totalProjects}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {summaryLoading ? '—' : formattedRevenue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts" data-testid="tab-contacts">
                  {t('admin_tab_contacts')}
                </TabsTrigger>
                <TabsTrigger value="support" data-testid="tab-support">
                  {t('admin_tab_support')}
                </TabsTrigger>
                <TabsTrigger value="projects" data-testid="tab-projects">
                  {t('admin_tab_projects')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="mt-6">
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_contacts')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactsError ? (
                      <Alert variant="destructive" className="mb-4" data-testid="alert-contacts-error">
                        <AlertTitle>{t('admin_data_error_title')}</AlertTitle>
                        <AlertDescription>
                          {t('admin_data_error_description')}
                          <span className="block font-mono text-xs mt-2 break-all">
                            {contactsError}
                          </span>
                        </AlertDescription>
                      </Alert>
                    ) : contactsLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((key) => (
                          <Skeleton key={key} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : contacts.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('admin_no_contacts')}</p>
                        <p className="text-sm mt-2">{t('admin_contacts_desc')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {contacts.map((contact) => {
                          const nextStatus = getContactNextStatus(contact.status);
                          return (
                            <Card key={contact.id} className="border border-primary/20">
                              <CardContent className="p-4 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                  <div>
                                    <p className="text-lg font-semibold text-foreground">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {t('admin_contact_received')} {formatDate(contact.createdAt)}
                                    </p>
                                  </div>
                                  {renderStatusBadge(contact.status)}
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {contact.message}
                                </p>
                                {nextStatus && (
                                  <div className="flex justify-end">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        contactStatusMutation.mutate({
                                          id: contact.id,
                                          status: nextStatus,
                                        })
                                      }
                                      disabled={contactStatusMutation.isPending}
                                      data-testid={`button-contact-${contact.id}-advance`}
                                    >
                                      {contact.status === 'new'
                                        ? t('admin_action_mark_read')
                                        : t('admin_action_mark_responded')}
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <Card className="border-2 border-accent/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_support')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {supportError ? (
                      <Alert variant="destructive" className="mb-4" data-testid="alert-support-error">
                        <AlertTitle>{t('admin_data_error_title')}</AlertTitle>
                        <AlertDescription>
                          {t('admin_data_error_description')}
                          <span className="block font-mono text-xs mt-2 break-all">
                            {supportError}
                          </span>
                        </AlertDescription>
                      </Alert>
                    ) : supportLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((key) => (
                          <Skeleton key={key} className="h-28 w-full" />
                        ))}
                      </div>
                    ) : supportTickets.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('admin_no_support')}</p>
                        <p className="text-sm mt-2">{t('admin_support_desc')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {supportTickets.map((ticket) => {
                          const nextStatus = getSupportNextStatus(ticket.status);
                          const owner = usersById.get(ticket.userId);
                          return (
                            <Card key={ticket.id} className="border border-accent/20">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                  <div>
                                    <p className="text-lg font-semibold text-foreground">
                                      {ticket.subject}
                                    </p>
                                    {owner && (
                                      <p className="text-sm text-muted-foreground">
                                        {owner.companyName} • {owner.email}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(ticket.createdAt)}
                                    </p>
                                  </div>
                                  {renderStatusBadge(ticket.status)}
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {ticket.message}
                                </p>
                                {nextStatus && (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        supportStatusMutation.mutate({
                                          id: ticket.id,
                                          status: nextStatus,
                                        })
                                      }
                                      disabled={supportStatusMutation.isPending}
                                      data-testid={`button-support-${ticket.id}-advance`}
                                    >
                                      {ticket.status === 'open'
                                        ? t('admin_action_mark_in_progress')
                                        : t('admin_action_mark_resolved')}
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card className="border-2 border-secondary/30">
                  <CardHeader>
                    <CardTitle>{t('admin_tab_projects')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectDataError ? (
                      <Alert variant="destructive" className="mb-4" data-testid="alert-projects-error">
                        <AlertTitle>{t('admin_data_error_title')}</AlertTitle>
                        <AlertDescription>
                          {t('admin_data_error_description')}
                          <span className="block font-mono text-xs mt-2 break-all">
                            {projectDataError}
                          </span>
                        </AlertDescription>
                      </Alert>
                    ) : projectsLoading || usersLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((key) => (
                          <Skeleton key={key} className="h-40 w-full" />
                        ))}
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('admin_no_projects')}</p>
                        <p className="text-sm mt-2">{t('admin_projects_desc')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projects.map((project) => {
                          const owner = usersById.get(project.userId);
                          return (
                            <Card key={project.id} className="border border-secondary/40">
                              <CardContent className="p-4 space-y-4">
                                <div className="flex flex-col gap-2">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div>
                                      <p className="text-xl font-semibold text-foreground">
                                        {project.projectName}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {t('admin_projects_client')}: {owner?.companyName ?? project.userId}
                                      </p>
                                      {owner && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                          <Mail className="w-4 h-4" />
                                          {owner.email}
                                          {owner.phoneNumber && (
                                            <>
                                              <Phone className="w-4 h-4" />
                                              {owner.phoneNumber}
                                            </>
                                          )}
                                        </p>
                                      )}
                                      <p className="text-xs text-muted-foreground">
                                        {t('admin_projects_updated')} {formatDate(project.updatedAt ?? project.createdAt)}
                                      </p>
                                    </div>
                                    {renderStatusBadge(project.status)}
                                  </div>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {project.description}
                                  </p>
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      {project.timeline && (
                                        <span>
                                          {t('create_timeline_label')}: {project.timeline}
                                        </span>
                                      )}
                                      {project.budget && (
                                        <span>
                                          {t('create_budget_label')}: {project.budget}
                                        </span>
                                      )}
                                    </div>
                                    <div className="w-full md:w-64">
                                      <Select
                                        value={project.status}
                                        onValueChange={(value) =>
                                          projectStatusMutation.mutate({
                                            id: project.id,
                                            status: value as Project['status'],
                                          })
                                        }
                                      >
                                        <SelectTrigger data-testid={`select-project-${project.id}-status`}>
                                          <SelectValue placeholder={t('admin_project_update_status')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">{t('status_pending')}</SelectItem>
                                          <SelectItem value="in-progress">{t('status_in_progress')}</SelectItem>
                                          <SelectItem value="completed">{t('status_completed')}</SelectItem>
                                          <SelectItem value="cancelled">{t('status_cancelled')}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
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
