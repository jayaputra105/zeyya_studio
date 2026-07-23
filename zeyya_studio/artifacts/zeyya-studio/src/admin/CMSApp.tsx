import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { isAdminLoggedIn } from './cmsApi';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PortfolioList from './pages/PortfolioList';
import PortfolioForm from './pages/PortfolioForm';
import StudyCaseList from './pages/StudyCaseList';
import StudyCaseForm from './pages/StudyCaseForm';
import MediaLibrary from './pages/MediaLibrary';
import HeroEditor from './pages/HeroEditor';
import AboutEditor from './pages/AboutEditor';
import ServicesEditor from './pages/ServicesEditor';
import PricingEditor from './pages/PricingEditor';
import FAQEditor from './pages/FAQEditor';
import TestimonialsPage from './pages/TestimonialsPage';
import SEOEditor from './pages/SEOEditor';
import NavigationEditor from './pages/NavigationEditor';
import SocialEditor from './pages/SocialEditor';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ component: Component, title, breadcrumb }: { component: React.ComponentType, title: string, breadcrumb?: string }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      setLocation('/admin/login');
    }
  }, [location, setLocation]);

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="flex min-h-[100dvh] bg-[#0A0A0A] text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-[#0A0A0A] relative">
        <div className="absolute inset-0 noise pointer-events-none opacity-20"></div>
        <Header title={title} breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <Component />
        </div>
      </main>
    </div>
  );
}

export default function CMSApp() {
  const [location] = useLocation();

  if (location === '/admin/login') {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/admin" component={() => <ProtectedRoute component={Dashboard} title="Dashboard" breadcrumb="Overview" />} />
      <Route path="/admin/portfolio" component={() => <ProtectedRoute component={PortfolioList} title="Portfolio" breadcrumb="Konten" />} />
      <Route path="/admin/portfolio/:id" component={() => <ProtectedRoute component={PortfolioForm} title="Portfolio Editor" breadcrumb="Konten" />} />
      <Route path="/admin/study-case" component={() => <ProtectedRoute component={StudyCaseList} title="Study Case" breadcrumb="Konten" />} />
      <Route path="/admin/study-case/:id" component={() => <ProtectedRoute component={StudyCaseForm} title="Study Case Editor" breadcrumb="Konten" />} />
      <Route path="/admin/media" component={() => <ProtectedRoute component={MediaLibrary} title="Media Library" breadcrumb="Aset Digital" />} />
      <Route path="/admin/hero" component={() => <ProtectedRoute component={HeroEditor} title="Hero Section" breadcrumb="Website" />} />
      <Route path="/admin/about" component={() => <ProtectedRoute component={AboutEditor} title="About Section" breadcrumb="Website" />} />
      <Route path="/admin/services" component={() => <ProtectedRoute component={ServicesEditor} title="Services Section" breadcrumb="Website" />} />
      <Route path="/admin/pricing" component={() => <ProtectedRoute component={PricingEditor} title="Pricing & Packages" breadcrumb="Website" />} />
      <Route path="/admin/faq" component={() => <ProtectedRoute component={FAQEditor} title="FAQ Section" breadcrumb="Website" />} />
      <Route path="/admin/testimonials" component={() => <ProtectedRoute component={TestimonialsPage} title="Testimonials" breadcrumb="Website" />} />
      <Route path="/admin/seo" component={() => <ProtectedRoute component={SEOEditor} title="SEO & Meta Tags" breadcrumb="Pengaturan" />} />
      <Route path="/admin/navigation" component={() => <ProtectedRoute component={NavigationEditor} title="Navigation Settings" breadcrumb="Pengaturan" />} />
      <Route path="/admin/social" component={() => <ProtectedRoute component={SocialEditor} title="Social Media" breadcrumb="Pengaturan" />} />
      <Route path="/admin/settings" component={() => <ProtectedRoute component={SettingsPage} title="Settings" breadcrumb="Pengaturan" />} />
    </Switch>
  );
}
