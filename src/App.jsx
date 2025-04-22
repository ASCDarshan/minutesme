import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MeetingProvider } from "./context/MeetingContext";

import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import DashboardShimmer from "./components/UI/DashboardShimmer";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewMeeting from "./pages/NewMeeting";
import MeetingDetails from "./pages/MeetingDetails";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/UI/ScrollToTop";

const Loading = () => (
  <Container maxWidth="sm" sx={{ py: 15, textAlign: "center" }}>
    <DashboardShimmer />
  </Container>
);

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

const AppContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 8,
        }}
      >
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />

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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <MeetingProvider>
          <AppContent />
        </MeetingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
