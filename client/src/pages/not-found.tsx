import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center pt-20">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-foreground">{t('notfound_title')}</h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {t('notfound_message')}
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
