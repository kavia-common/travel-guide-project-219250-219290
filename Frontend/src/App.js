import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Explore from './pages/Explore';
import Header from './components/Header';
import NotificationsPage from './pages/Notifications';
import { NotificationsProvider } from './notifications/NotificationsContext';
import CurrencyPage from './pages/Currency';
import GalleryPage from './pages/Gallery';
import UploadPhotoPage from './pages/UploadPhoto';
import { PhotosProvider } from './photos/PhotosContext';
import { ReviewsProvider } from './reviews/ReviewsContext';
import ReviewsDemoPage from './pages/ReviewsDemo';
import DestinationDetailsPage from './pages/DestinationDetails';

/**
 * PUBLIC_INTERFACE
 * Root application component providing theme toggle and client-side routing.
 * Renders a persistent site header and a main landmark for page content.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document element for CSS variable theming
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggles between light and dark themes across the app. */
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <BrowserRouter>
        <NotificationsProvider>
          <PhotosProvider>
            <ReviewsProvider>
              <Header />
              <main id="main" role="main" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
                  <Route path="/reviews" element={<ReviewsDemoPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/currency" element={<CurrencyPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/gallery/upload" element={<UploadPhotoPage />} />
                  <Route path="/gallery/:photoId" element={<GalleryPage />} />
                  {/* Keep existing or future navigation intact by centralizing routes here */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </ReviewsProvider>
          </PhotosProvider>
        </NotificationsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
