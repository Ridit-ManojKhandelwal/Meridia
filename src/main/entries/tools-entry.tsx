import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../shared/store";
import { ToolsWindow } from "../../components/tools/toolsWindow";

const toolsWindow = createRoot(document.querySelector("#toolsWindow"));
toolsWindow.render(
  <Provider store={store}>
    <ToolsWindow />
  </Provider>
);
