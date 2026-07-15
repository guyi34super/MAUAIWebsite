import { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import DocsIndex from './pages/docs/DocsIndex';
import CallCenterOverview from './pages/docs/CallCenterOverview';
import CallCenterFeatures from './pages/docs/CallCenterFeatures';
import CallCenterHowItWorks from './pages/docs/CallCenterHowItWorks';
import CallCenterBilling from './pages/docs/CallCenterBilling';
import CallCenterGetStarted from './pages/docs/CallCenterGetStarted';
import MoiOverview from './pages/docs/MoiOverview';
import MoiArchitecture from './pages/docs/MoiArchitecture';
import MoiTraining from './pages/docs/MoiTraining';
import MoiScaling from './pages/docs/MoiScaling';
import MoiRoadmap from './pages/docs/MoiRoadmap';
import CookieNotice from './components/CookieNotice';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const initialPath = useRef(window.location.pathname);
  const [loading, setLoading] = useState(
    () => !initialPath.current.startsWith('/docs')
  );
  const handleLoadComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (!loading) return undefined;
    const fallback = setTimeout(handleLoadComplete, 3000);
    return () => clearTimeout(fallback);
  }, [handleLoadComplete, loading]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/docs/call-center" element={<CallCenterOverview />} />
            <Route path="/docs/call-center/features" element={<CallCenterFeatures />} />
            <Route path="/docs/call-center/how-it-works" element={<CallCenterHowItWorks />} />
            <Route path="/docs/call-center/billing" element={<CallCenterBilling />} />
            <Route path="/docs/call-center/get-started" element={<CallCenterGetStarted />} />
            <Route path="/docs/moi" element={<MoiOverview />} />
            <Route path="/docs/moi/architecture" element={<MoiArchitecture />} />
            <Route path="/docs/moi/training" element={<MoiTraining />} />
            <Route path="/docs/moi/scaling" element={<MoiScaling />} />
            <Route path="/docs/moi/roadmap" element={<MoiRoadmap />} />
          </Route>
        </Routes>
        <CookieNotice />
      </BrowserRouter>
    </>
  );
}
