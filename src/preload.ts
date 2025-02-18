/* eslint-disable @typescript-eslint/no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer, contextBridge } from "electron";

import { TitlebarColor, Titlebar } from "custom-electron-titlebar";

window.addEventListener("DOMContentLoaded", () => {
  new Titlebar({
    backgroundColor: TitlebarColor.fromHex("#2e2d2d"),
    menuSeparatorColor: TitlebarColor.WHITE,
  });
});

ipcRenderer.on("show-tools", async (event, data) => {
  console.log("Data received:", data);

  event.sender.send("send-tools-data", data);
});

ipcRenderer.on("send-tools-data", (event, parsedData) => {
  console.log("Parsed Data:", parsedData);
});

ipcRenderer.on("command-update-folder-structure", (event, data) => {
  event.sender.send("folder-updated", data.updatedData);
});

ipcRenderer.on("new-folder-opened", (event, data) => {
  window.location.reload();
});

ipcRenderer.on("received-output", (event: any, data: any) => {
  const parentDiv = document.querySelector("#output-parent");
  const outputDiv = document.createElement("div");
  outputDiv.id = "output";
  outputDiv.innerHTML = data;
  parentDiv.append(outputDiv);

  ipcRenderer.send("update-output", data);
});

const renderer = {
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

  get_variables: async (path: string) => {
    const vars = await ipcRenderer.invoke("get-variables", path);
    return vars;
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
};

contextBridge.exposeInMainWorld("electron", renderer);

export type ERenderer = typeof renderer;
