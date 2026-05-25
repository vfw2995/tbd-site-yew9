import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/toaster";
import { TooltipProvider } from "@workspace/ui/tooltip";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);
  return null;
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

import Home from "@/pages/Home";
import About from "@/pages/About";
import LoanPrograms from "@/pages/LoanPrograms";
import Calculators from "@/pages/Calculators";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Apply from "@/pages/Apply";
import NotFound from "@/pages/not-found";

import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import SiteSettings from "@/pages/admin/SiteSettings";
import HomepageAdmin from "@/pages/admin/HomepageAdmin";
import LoanProgramsAdmin from "@/pages/admin/LoanProgramsAdmin";
import TestimonialsAdmin from "@/pages/admin/TestimonialsAdmin";
import BlogList from "@/pages/admin/BlogList";
import BlogEditor from "@/pages/admin/BlogEditor";
import Account from "@/pages/admin/Account";
import PagesContent from "@/pages/admin/PagesContent";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import ContactInbox from "@/pages/admin/ContactInbox";
import Team from "@/pages/admin/Team";
import ThemeSwitcher from "@/pages/admin/ThemeSwitcher";
import ChangelogPage from "@/pages/admin/ChangelogPage";
import FeaturesPage from "@/pages/admin/FeaturesPage";

const queryClient = new QueryClient();

function ApplyLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Apply />
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/loan-programs" component={LoanPrograms} />
          <Route path="/calculators" component={Calculators} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function AdminRoutes() {
  return (
    <RequireAuth>
      {(user) => (
        <AdminShell user={user}>
          <Switch>
            <Route path="/admin" component={() => <Dashboard user={user} />} />
            <Route path="/admin/site-settings" component={SiteSettings} />
            <Route path="/admin/homepage" component={HomepageAdmin} />
            <Route path="/admin/loan-programs" component={LoanProgramsAdmin} />
            <Route path="/admin/testimonials" component={TestimonialsAdmin} />
            <Route path="/admin/pages" component={PagesContent} />
            <Route path="/admin/blog" component={BlogList} />
            <Route path="/admin/blog/new" component={BlogEditor} />
            <Route path="/admin/blog/:id" component={BlogEditor} />
            <Route path="/admin/inbox" component={ContactInbox} />
            <Route path="/admin/team" component={() => <Team user={user} />} />
            <Route path="/admin/account" component={() => <Account user={user} />} />
            <Route path="/admin/theme" component={ThemeSwitcher} />
            <Route path="/admin/changelog" component={ChangelogPage} />
            <Route path="/admin/features" component={FeaturesPage} />
            <Route><div className="text-center py-20 text-muted-foreground">Page not found</div></Route>
          </Switch>
        </AdminShell>
      )}
    </RequireAuth>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Switch>
            <Route path="/admin/login" component={Login} />
            <Route path="/admin" component={AdminRoutes} />
            <Route path="/admin/:rest*" component={AdminRoutes} />
            <Route path="/apply" component={ApplyLayout} />
            <Route component={PublicLayout} />
          </Switch>
        </WouterRouter>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
