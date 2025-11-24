import { NavLink } from "@/components/NavLink";
import { Home, PlusCircle, BarChart3, Bot, Users, BookOpen, Menu, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/add", icon: PlusCircle, label: "Add Transaction" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/ai-chat", icon: Bot, label: "AI Assistant" },
    { to: "/split", icon: Users, label: "Split Bills" },
    { to: "/learn", icon: BookOpen, label: "Learn" },
  ];

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navItems.map((item, index) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onItemClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group animate-fade-in"
          activeClassName="text-primary bg-primary/10 font-semibold shadow-sm"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card/95 backdrop-blur-sm border-r border-border/50 p-6 flex-col shadow-lg z-50">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartAI Expense
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your finances</p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          <NavItems />
        </div>
        <div className="pt-6 border-t border-border/50 animate-fade-in">
          <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all group">
            <Settings className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
            Settings
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border/50 z-50 shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SmartAI Expense
            </h1>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b border-border/50">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  SmartAI Expense
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your finances</p>
              </div>
              <div className="p-4 space-y-2">
                <NavItems onItemClick={() => setIsOpen(false)} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card">
                <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Navigation;
