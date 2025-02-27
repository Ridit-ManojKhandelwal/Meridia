import { ipcRenderer } from "electron";

import { IEditorSettings, IUI, IUIState } from "../../src/shared/types";

export const renderer = {
  openFolder: async () => {
    const folder = await ipcRenderer.invoke("open-folder");
    return folder;
  },

  get_folder: async () => {
    const folder = await ipcRenderer.invoke("get-folder");
    return folder;
  },

  open_set_folder: async () => {
    const folder = await ipcRenderer.invoke("open-set-folder");
    return folder;
  },

  clear_folder: () => {
    ipcRenderer.send("clear-folder");
  },

  get_settings: async () => {
    const settings = await ipcRenderer.invoke("get-settings");
    return settings;
  },
  clear_settings: () => {
    ipcRenderer.send("clear-settings");
  },

  set_settings: (settings: IEditorSettings) => {
    ipcRenderer.send("set-settings", settings);
  },

  get_ui_state: async () => {
    const state = await ipcRenderer.invoke("get-ui-state");
    return state;
  },
  clear_ui_state: () => {
    ipcRenderer.send("clear-ui-state");
  },

  set_ui_state: (state: IUIState) => {
    ipcRenderer.send("set-ui-state", state);
  },

  get_ui: async () => {
    const ui = await ipcRenderer.invoke("get-ui");
    return ui;
  },
  clear_ui: () => {
    ipcRenderer.send("clear-ui");
  },

  set_ui: (ui: IUI) => {
    ipcRenderer.send("set-ui", ui);
  },

  get_file_content: async (path: string) => {
    try {
      console.log("path", path);
      const file_content = await ipcRenderer.invoke("get-file-content", path);
      console.log("content", file_content);
      return file_content;
    } catch {
      return "error fetching file content";
    }
  },

  save_file: (data: { path: string; content: string }) => {
    ipcRenderer.send("save-file", data);
  },

  show_contextmenu: (data: {
    path: string;
    type: "folder" | "file";
    rootPath: string;
  }) => {
    const response = ipcRenderer.send("folder-contextmenu", data);
  },
  varinfo_contextmenu: (data: { name: string; path: string }) => {
    const response = ipcRenderer.send("datavarinfotitle-contextmenu", data);
  },

  create_file: (data: { path: string; fileName: string; rootPath: string }) => {
    ipcRenderer.send("create-file", data);
  },
  create_folder: (data: {
    path: string;
    fileName: string;
    rootPath: string;
  }) => {
    ipcRenderer.send("create-folder", data);
  },

  set_folder: (folder: string) => {
    ipcRenderer.send("set-folder", folder);
  },

  reload_window: (folder: string) => {
    ipcRenderer.send("refresh-window", folder);
  },

  run_code: (data: { path: string; script: string }) => {
    try {
      ipcRenderer.invoke("run-code", data);
    } catch {}
  },

  ipcRenderer: {
    send: (channel: any, data: any) => {
      ipcRenderer.send(channel, data);
    },
    invoke: (channel: any, data: any) => {
      ipcRenderer.invoke(channel, data);
    },
    on: (channel: any, func: any) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    once: (channel: any, func: any) => {
      ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
    },
    removeAllListeners: (channel: any) => {
      ipcRenderer.removeAllListeners(channel);
    },
    removeListener: (channel: any, listener: any) => {
      ipcRenderer.removeListener(channel, listener);
    },
  },

  get_data_studio_variables: async () => {
    const vars = await ipcRenderer.invoke("get-data-studio-variables");
    return vars;
  },

  set_data_studio_variables: async (vars: any[]) => {
    ipcRenderer.send("set-data-studio-variables", vars);
  },

  show_tools: () => {
    ipcRenderer.invoke("show-tools");
  },
  hide_tools: () => {
    ipcRenderer.invoke("hide-tools");
  },
  sendMessage: (message: string) => ipcRenderer.invoke("send-message", message),
  getMenu: () => ipcRenderer.invoke("get-menu"),
  installPackage: (name: string) => ipcRenderer.invoke("install-package", name),
  uninstallPackage: (name: string) =>
    ipcRenderer.invoke("uninstall-package", name),
  getInstalledPackages: () => ipcRenderer.invoke("get-installed-packages"),
  searchPyPiPackages: (query: string) =>
    ipcRenderer.invoke("search-pypi-packages", query),
  run_python_code: async (code: string) => {
    try {
      const result = await ipcRenderer.invoke("run-python-code", code);
      return result ?? {}; // Ensure an empty object if result is null/undefined
    } catch (error) {
      console.error("Error running Python code:", error);
      return {}; // Return an empty object instead of undefined
    }
  },
};
