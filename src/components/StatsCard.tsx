import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export const StatsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
  delay = 0,
}: StatsCardProps) => {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in border-border/50 backdrop-blur-sm bg-card/50 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground transition-transform group-hover:scale-105">
            {value}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={`text-sm font-medium ${
                trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${gradient} shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};
