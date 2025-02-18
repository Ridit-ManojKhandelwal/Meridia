import { createBrowserRouter, createHashRouter } from "react-router-dom";
import MainComponent from "../components/main";
import Navigator from "../components/sidebar-sections/navigator";
import Enviornment from "../components/sidebar-sections/enviornment";
import { Tools } from "../components/tools/index";

export default createHashRouter([
  {
    path: "/main_window",
    element: <MainComponent />,
    errorElement: <MainComponent />,
    children: [
      {
        path: "", // Default route for /main_window
        element: <Navigator />,
        index: true,
      },
      {
        path: "Enviornment", // Relative path for /main_window/information
        element: <Enviornment />,
      },
    ],
  },
  {
    path: "/toolswindow",
    element: <Tools />,
    errorElement: <Tools />,
  },
  // Add the root route (or default route) to fix the error
  {
    path: "/",
    element: <MainComponent />, // or any other component you want to display at root
  },
]);
