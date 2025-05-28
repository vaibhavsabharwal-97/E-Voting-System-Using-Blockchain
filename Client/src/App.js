import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./Pages/admin/PageNotFound";
import Landing from "./Pages/Landing";
import Election from "./Pages/Election";
import ViewElection from "./Pages/ViewElection";
import ResultElection from "./Pages/ResultElection";
import ResultCandidate from "./Pages/ResultCandidate";
import { adminRoutes } from "./Routes/AdminRoutes";
import { userRoutes } from "./Routes/UserRoutes";
import { ThemeModeProvider } from "./context/ThemeContext";
import { TransactionProvider } from "./context/TransactionContext";
import { UserProvider } from "./context/UserContext";
import { AudioProvider } from "./context/AudioContext";
import ErrorBoundary from "./Components/ErrorBoundary";
import AdminLogin from "./Pages/admin/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <ThemeModeProvider>
        <AudioProvider>
          <TransactionProvider>
            <UserProvider>
              <BrowserRouter>
                <ErrorBoundary>
                  <Routes>
                    {/* Landing page route */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Admin login */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Direct election routes */}
                    <Route path="/elections" element={<Election />} />
                    <Route path="/elections/:id" element={<ViewElection />} />
                    
                    {/* Direct result routes - Protected for admin only */}
                    <Route path="/result" element={
                      <ProtectedRoute>
                        <ResultElection />
                      </ProtectedRoute>
                    } />
                    <Route path="/result/:id" element={
                      <ProtectedRoute>
                        <ResultCandidate />
                      </ProtectedRoute>
                    } />
                    
                    {/* User routes */}
                    {userRoutes}
                    
                    {/* Admin routes - protected */}
                    <Route path="/admin/*" element={
                      <ProtectedRoute>
                        <Routes>
                          {adminRoutes}
                        </Routes>
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 page */}
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </UserProvider>
          </TransactionProvider>
        </AudioProvider>
      </ThemeModeProvider>
    </div>
  );
}

export default App;
