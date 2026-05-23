import { RouterProvider } from "react-router";
import { router } from "./routes";

import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <RouterProvider router={router} />
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;