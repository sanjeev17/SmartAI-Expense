import { NavLink } from "@/components/NavLink";
import { Home, PlusCircle, BarChart3, Bot, Users, BookOpen, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/add", icon: PlusCircle, label: "Add Transaction" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/ai-chat", icon: Bot, label: "AI Assistant" },
    { to: "/split", icon: Users, label: "Split Bills" },
    { to: "/learn", icon: BookOpen, label: "Learn" },
  ];

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          activeClassName="text-primary bg-primary/10 font-semibold"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 p-6 flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartAI Expense
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your finances</p>
        </div>
        <div className="flex-1 space-y-2">
          <NavItems />
        </div>
        <div className="pt-6 border-t border-border/50">
          <Button variant="outline" className="w-full">
            Settings
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border/50 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartAI Expense
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  SmartAI Expense
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your finances</p>
              </div>
              <div className="flex-1 space-y-2">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Navigation;
