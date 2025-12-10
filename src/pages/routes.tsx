import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { Layout } from "../components/layout/Layout";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import { RegisterPage } from "./RegisterPage";
import { LoginPage } from "./LoginPage";
import { ProtectedRoute } from "../utils/hooks/withAuth";
import { ProjectsPage } from "./ProjectsPage";
import { ProjectsDetailsPage } from "./ProjectDetailsPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      {
        path: "/teams",
        element: <TeamsPage />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      {
        path: "/projects/:id",
        element: <ProjectsDetailsPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
];
