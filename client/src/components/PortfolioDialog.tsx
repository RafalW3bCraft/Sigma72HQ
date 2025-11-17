import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Target, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    title: string;
    desc: string;
    category: string;
    tech: string[];
    color: string;
    client?: string;
    duration?: string;
    challenge?: string;
    solution?: string;
    outcome?: string;
    metrics?: { label: string; value: string }[];
    liveUrl?: string;
  };
}

export function PortfolioDialog({ open, onOpenChange, item }: PortfolioDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid={`dialog-portfolio-${item.id}`}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gradient-text mb-2" data-testid={`text-dialog-title-${item.id}`}>
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-base" data-testid={`text-dialog-desc-${item.id}`}>
            {item.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div
            className="h-64 rounded-md relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-9xl font-bold opacity-20"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {String(item.id).padStart(2, "0")}
              </motion.div>
            </div>
          </div>

          {(item.client || item.duration) && (
            <div className="grid grid-cols-2 gap-4">
              {item.client && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Client</h4>
                  <p className="text-foreground">{item.client}</p>
                </div>
              )}
              {item.duration && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Duration</h4>
                  <p className="text-foreground">{item.duration}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {item.tech.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {item.challenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-primary/30 rounded-md p-4"
            >
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Challenge</h4>
                  <p className="text-muted-foreground">{item.challenge}</p>
                </div>
              </div>
            </motion.div>
          )}

          {item.solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-accent/30 rounded-md p-4"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Solution</h4>
                  <p className="text-muted-foreground">{item.solution}</p>
                </div>
              </div>
            </motion.div>
          )}

          {item.outcome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-secondary/30 rounded-md p-4"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Outcome</h4>
                  <p className="text-muted-foreground">{item.outcome}</p>
                </div>
              </div>
            </motion.div>
          )}

          {item.metrics && item.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {item.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-muted rounded-md p-4 text-center hover-elevate"
                  >
                    <p className="text-2xl font-bold gradient-text mb-1">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {item.liveUrl && (
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 hover-elevate active-elevate-2"
                onClick={() => window.open(item.liveUrl, "_blank")}
                data-testid={`button-view-live-${item.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Project
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
