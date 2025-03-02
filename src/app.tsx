import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./shared/router";
import { useAppDispatch, useAppSelector } from "./shared/hooks";
import {
  IEditorSettings,
  IFolderStructure,
  IUI,
  IUIState,
} from "./shared/types";
import {
  set_folder_structure,
  update_settings,
  update_ui,
  update_ui_state,
} from "./shared/rdx-slice";
import { ConfigProvider, theme } from "antd/es";
import { PrimeReactProvider } from "primereact/api";
import { AnantProvider } from "../extensions/meridiaui";
import { MainContext } from "./shared/functions";
import { store } from "./shared/store";

const App = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const settingsDe = useAppSelector((state) => state.main.editorSettings);
  const stateDe = useAppSelector((state) => state.main.uiState);

  const { handle_set_editor } = React.useContext(MainContext) || {};

  const handleSetEditor = React.useCallback(
    async (branch_name: string, full_path: string) => {
      console.log("branch", branch_name, full_path);
      const content = await window.electron.get_file_content(full_path);

      if (typeof handle_set_editor === "function") {
        handle_set_editor({ name: branch_name, path: full_path, content });
      } else {
        console.error("handle_set_editor is not defined");
      }
    },
    [handle_set_editor]
  );

  const startup = React.useCallback(async () => {
    const ui = (await window.electron.get_ui()) as IUI;
    const folder = (await window.electron.get_folder()) as IFolderStructure;
    const settings = (await window.electron.get_settings()) as IEditorSettings;
    const state = (await window.electron.get_ui_state()) as IUIState;

    if (!localStorage.getItem("mnovus_meridia")) {
      window.electron.set_settings(settingsDe);
      window.electron.set_ui_state(stateDe);
      localStorage.setItem("mnovus_meridia", "false");
    }

    if (folder) dispatch(set_folder_structure(folder));
    if (settings) dispatch(update_settings(settings));
    if (state) dispatch(update_ui_state(state));
    if (ui) dispatch(update_ui(ui));
    if (state) {
      if (state.active_file) {
      }
    }
  }, [dispatch]);

  React.useLayoutEffect(() => {
    startup();
  }, [startup]);

  return (
    <AnantProvider mode="dark">
      <PrimeReactProvider>
        <ConfigProvider
          theme={{
            algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            components: {
              Splitter: {
                splitBarSize: 0,
              },
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </PrimeReactProvider>
    </AnantProvider>
  );
});

export default App;
