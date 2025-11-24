import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
