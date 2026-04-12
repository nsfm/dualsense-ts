import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ManagerContext, manager } from "./controller";
import { routes } from "./routes";

const router = createBrowserRouter(routes, {
  basename: "/dualsense-ts",
});

const Loading = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      opacity: 0.4,
      fontSize: 13,
    }}
  >
    Loading...
  </div>
);

export const App: React.FC = () => (
  <ManagerContext.Provider value={manager}>
    <React.Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </React.Suspense>
  </ManagerContext.Provider>
);
