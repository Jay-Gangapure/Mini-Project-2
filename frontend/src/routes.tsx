import { createBrowserRouter, Navigate } from "react-router";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { LayoutWrapper } from "./components/LayoutWrapper";
// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SituationAssistant from "./pages/SituationAssistant";
import GuidanceResult from "./pages/GuidanceResult";
import AIChatPage from "./pages/AIChatPage";
import SchemesPage from "./pages/SchemesPage";
import DocumentUpload from "./pages/DocumentUpload";
import LegalDirectory from "./pages/LegalDirectory";
import ProfilePage from "./pages/ProfilePage";
import RestrictedAccess from "./pages/RestrictedAccess";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/restricted",
    element: <RestrictedAccess />,
  },

  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <LayoutWrapper />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/situation",
            element: <SituationAssistant />,
          },
          {
            path: "/guidance/:id",
            element: <GuidanceResult />,
          },
          {
            path: "/chat",
            element: <AIChatPage />,
          },
          {
            path: "/schemes",
            element: <SchemesPage />,
          },
          {
            path: "/documents",
            element: <DocumentUpload />,
          },
          {
            path: "/directory",
            element: <LegalDirectory />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);