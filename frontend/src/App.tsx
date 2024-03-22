// import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import VMs from "./pages/VMs";
import Terminal from "./components/Terminal";
import Global from "./layouts/Global";
import Settings from "./pages/Settings";
import { Billing } from "./pages/Billing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Global />,
    children: [
      {
        path: "vms",
        element: <VMs />,
      },
      {
        path:"billing",
        element: <Billing />
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/terminal",
    element: <Terminal />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
