import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceRequest from "./pages/ServiceRequest";
import MyRequests from "./pages/MyRequests";
import RequestDetails from "./pages/RequestDetails";
import Booking from "./pages/Booking";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderProfile from "./pages/ProviderProfile";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Customer dashboard
  if (user.role === "customer") {
    return <CustomerDashboard />;
  }

  // Admin dashboard
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // Other roles
  if (user.role === "provider") {
    return <ProviderDashboard />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          {user.role} dashboard coming next.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Customer service request */}
        <Route
          path="/service-request"
          element={<ServiceRequest />}
        />
        <Route
  path="/provider-profile"
  element={<ProviderProfile />}
/>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/my-requests"
          element={<MyRequests />}
          />
          <Route
  path="/booking/:requestId/:quotationId"
  element={<Booking />}
/>
          <Route
           path="/requests/:id"
           element={<RequestDetails />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;