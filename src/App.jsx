import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';

// Layout components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Import pages using lazy loading for better performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewMeeting = lazy(() => import('./pages/NewMeeting'));
const MeetingDetails = lazy(() => import('./pages/MeetingDetails'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading component for suspense fallback
const Loading = () => (
  <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" sx={{ mt: 3 }}>
      Loading...
    </Typography>
  </Container>
);

// Protected route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main app structure
const AppContent = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
    }}>
      <Header />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        pt: 4,
        pb: 8,
      }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/new-meeting" 
              element={
                <PrivateRoute>
                  <NewMeeting />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/meeting/:id" 
              element={
                <PrivateRoute>
                  <MeetingDetails />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            
            {/* Redirect all other routes to dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
};

// Root App component with providers
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MeetingProvider>
          <AppContent />
        </MeetingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;