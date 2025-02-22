import { ipcRenderer } from "electron";

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

  get_file_content: async (path: string) => {
    try {
      const file_content = await ipcRenderer.invoke("get-file-content", path);
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
};
