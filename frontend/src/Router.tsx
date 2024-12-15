import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./Layout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Workspace from "./pages/Workspace";
import Editing from "./pages/Editing";

// Protected Route and RedirectIfLoggedIn components
const isAuthenticated = () => !!localStorage.getItem("jwt");

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

const RedirectIfLoggedIn: React.FC = () => {
  return isAuthenticated() ? <Navigate to="/workspace" replace /> : <Outlet />;
};

const Router: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Redirect logged-in users away from auth-related routes */}
        <Route element={<RedirectIfLoggedIn />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected workspace route */}
        <Route element={<ProtectedRoute />}>
          <Route path="workspace" element={<Workspace />} />
          <Route path="workspace/editing/:docId" element={<Editing />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
