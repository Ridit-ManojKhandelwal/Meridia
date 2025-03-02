import { createBrowserRouter, createHashRouter } from "react-router-dom";
import MainComponent from "../components/main";
import Navigator from "../components/sidebar-sections/navigator";

import { Tools } from "../components/tools/index";

export default createHashRouter([
  {
    path: "/main_window",
    element: <MainComponent />,
    errorElement: <MainComponent />,
    children: [
      {
        path: "",
        element: <Navigator />,
        index: true,
      },
    ],
  },
  {
    path: "/toolswindow",
    element: <Tools />,
    errorElement: <Tools />,
  },

  {
    path: "/",
    element: <MainComponent />,
  },
]);
