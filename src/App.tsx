import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import SitePreloader from "./components/SitePreloader";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { EditableContentProvider } from "./context/EditableContentContext";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";

const StudioPage = lazy(() => import("./pages/StudioPage"));

function AppContent({ showPreloader }: { showPreloader: boolean }) {
  const location = useLocation();
  const isStudio = location.pathname === "/studio";

  return (
    <>
      {!isStudio ? <SitePreloader visible={showPreloader} /> : null}
      {!isStudio ? <SiteHeader /> : null}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/studio"
          element={<Suspense fallback={<main className="mx-auto w-[min(1140px,92vw)] py-24 text-sm text-muted-foreground">Loading studio...</main>}><StudioPage /></Suspense>}
        />
        <Route path="/edit" element={<Navigate to="/studio" replace />} />
        <Route path="/edit/gallery" element={<Navigate to="/studio" replace />} />
        <Route path="/edit/contact" element={<Navigate to="/studio" replace />} />
        <Route path="/admin/config" element={<Navigate to="/studio" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isStudio ? <SiteFooter /> : null}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const minShowMs = 1100;
    let minTimer: ReturnType<typeof setTimeout> | undefined;

    const waitForMinimumTime = new Promise<void>((resolve) => {
      minTimer = setTimeout(resolve, minShowMs);
    });

    const waitForWindowLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }

      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        resolve();
      };

      window.addEventListener("load", onLoad);
    });

    Promise.all([waitForMinimumTime, waitForWindowLoad]).then(() => {
      if (!isCancelled) {
        setShowPreloader(false);
      }
    });

    return () => {
      isCancelled = true;
      if (minTimer) {
        clearTimeout(minTimer);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <EditableContentProvider>
        <AppContent showPreloader={showPreloader} />
      </EditableContentProvider>
    </BrowserRouter>
  );
}
