import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider, useCMS } from './contexts/CMSContext';
import EditingToolbar from './components/cms/EditingToolbar';
import SectionManager from './components/cms/SectionManager';
import Header from './components/Header';
import { sectionRegistry } from './components/sections/registry';

// Route-level code splitting: keep the admin editor and the design-system
// showcase out of the initial public bundle.
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const DesignSystemShowcase = lazy(() => import('./components/DesignSystemShowcase'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-text-tertiary">Loading…</div>
);

function HomePage() {
  const { isEditMode, sections } = useCMS();

  // Render every section in order, resolving its renderer from the catalog by
  // `type`. Enable/disable visibility is handled inside each SectionWrapper so
  // disabled sections remain toggleable in edit mode.
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className={`min-h-screen ${isEditMode ? 'pt-[60px]' : ''}`}>
      <EditingToolbar />
      <SectionManager />
      <Header />
      <main>
        {ordered.map((section) => {
          const entry = sectionRegistry[section.type];
          if (!entry) return null;
          const Renderer = entry.Renderer;
          return <Renderer key={section.id} sectionId={section.id} />;
        })}
      </main>
    </div>
  );
}

function App() {
  return (
    <CMSProvider>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design-system" element={<DesignSystemShowcase />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Suspense>
      </Router>
    </CMSProvider>
  );
}

export default App;
