import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./shared/router";
import { useAppDispatch, useAppSelector } from "./shared/hooks";
import { IEditorSettings, IFolderStructure } from "./shared/types";
import { set_folder_structure, update_settings } from "./shared/rdx-slice";
import { ConfigProvider, theme } from "antd/es";
import { PrimeReactProvider } from "primereact/api";
import { AnantProvider } from "../extensions/meridiaui";

const App = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const settingsDe = useAppSelector((state) => state.main.editorSettings);

  const checkFirstTime = React.useCallback(() => {
    const isFirstTime = localStorage.getItem("mnovus_meridia") === null;
    if (isFirstTime) {
      window.electron.set_settings(settingsDe);
      localStorage.setItem("mnovus_meridia", "false");
    }
  }, []);

  const get_folder = React.useCallback(async () => {
    const folder = (await window.electron.get_folder()) as IFolderStructure;
    folder != undefined && dispatch(set_folder_structure(folder));
  }, []);

  const get_settings = React.useCallback(async () => {
    const settings = (await window.electron.get_settings()) as IEditorSettings;
    console.log("settings", settings);
    settings != undefined && dispatch(update_settings(settings));
  }, []);

  React.useLayoutEffect(() => {
    checkFirstTime();
    get_folder();
    get_settings();
  }, []);

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
