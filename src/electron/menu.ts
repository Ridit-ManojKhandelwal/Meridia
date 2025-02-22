import { dialog, MenuItem } from "electron";
import { get_files } from "./get_files";

import { mainWindow } from "../main";

export const MenuTemplate = [
  {
    label: "File",
    submenu: [
      { label: "New Text File" },
      {
        label: "New File",
        accelerator: "Ctrl+N",
        click: () => {
          mainWindow.webContents.send("new-file-tab");
        },
      },
      { label: "New Window" },
      { type: "separator" },
      {
        label: "Open...",
        accelerator: "Ctrl+O",
        click: async () => {
          // Open the file dialog
          const result = await dialog.showOpenDialog(mainWindow, {
            properties: ["openFile"],
          });

          // Check if the user selected a file
          if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileName = filePath.split("/").pop(); // Extract file name

            // Send file name and full file path to the renderer process
            mainWindow.webContents.send("new-file-opened", {
              fileName,
              filePath,
            });
          }
        },
      },
      {
        label: "Open Folder...",
        click: async () => {
          const folder = await dialog.showOpenDialog(mainWindow, {
            properties: ["openDirectory"],
          });
          let structure = undefined;
          if (!folder.canceled) {
            console.log("folder", folder.filePaths[0]);
            const items = get_files(folder.filePaths[0]);
            structure = {
              id: 1,
              name: folder.filePaths[0],
              root: folder.filePaths[0],
              isFolder: true,
              items,
            };

            // @ts-ignore
            store.set(SELECTED_FOLDER_STORE_NAME, structure);
            mainWindow.webContents.send("new-folder-opened");
          }
        },
      },
      { label: "Open Workspace From File..." },
      { label: "Open Recent", submenu: [{ label: "Recent File" }] },
      { type: "separator" },
      { label: "Add Folder to Workspace" },
      { label: "Save Workspace As" },
      { label: "Duplicate Workspace" },
      { type: "separator" },
      {
        label: "Save",
        click: () => {
          mainWindow.webContents.send("save-current-file");
        },
        accelerator: "Ctrl + S",
      },
      { label: "Save As..." },
      { label: "Save All" },
      { type: "separator" },
      { type: "separator" },
      { label: "Autosave", type: "checkbox", checked: true },
      { type: "separator" },
      { label: "Close Editor", role: "quit" },
      { label: "Close Folder", role: "quit" },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" },
    ],
  },
  {
    label: "Selection",
    submenu: [
      { role: "selectAll" },
      { label: "Expand Selection" },
      { label: "Shrink Selection" },
      { type: "separator" },
      { label: "Copy Line Up" },
      { label: "Copy Line Down" },
      { label: "Move Line Up" },
      { label: "Move Line Down" },
      { label: "Duplicate Selection" },
      { type: "separator" },
      { label: "Add Cursor Above" },
      { label: "Add Cursor Below" },
      { label: "Add Cursor to Line Ends" },
      { label: "Add Next Occurrence" },
      { label: "Add Previous Occurrence" },
      { label: "Select All Occurrence" },
      { type: "separator" },
      { label: "Column Selection Mode" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Command Palette" },
      { label: "Open View" },
      { type: "separator" },
      {
        label: "Appearance",
        submenu: [
          { label: "Full Screen" },
          { label: "Zen Mode" },
          { label: "Center Layout" },
        ],
      },
      {
        label: "Editor Layout",
        submenu: [
          { label: "Split Up" },
          { label: "Split Down" },
          { label: "Split Left" },
          { label: "Split Right" },
          { type: "separator" },
          { label: "Split In Group" },
          { type: "separator" },
          { label: "Move Editor into New Window" },
          { label: "Copy Editor into New Window" },
          { type: "separator" },
          { label: "Single" },
          { label: "Two Columns" },
          { label: "Three Columns" },
          { label: "Two Rows" },
          { label: "Grid (2x2)" },
          { label: "Two Rows Right" },
          { label: "Two Columns Bottom" },
        ],
      },
      { type: "separator" },
      { label: "Explorer" },
      { label: "Search" },
      { label: "Source Control" },
      {
        label: "Run",
        click: () => {
          mainWindow.webContents.send("run-current-file");
        },
        accelerator: "F5",
      },
      { label: "Extensions" },
      { type: "separator" },
      { label: "Problems" },
      { label: "Output" },
      { label: "Debug Console" },
      { label: "Terminal" },
      { type: "separator" },
      { label: "Word Wrap" },
    ],
  },
  {
    label: "Go",
    submenu: [
      { label: "Back" },
      { label: "Forward", enabled: false },
      { label: "Last Edit Location" },
      {
        label: "Switch Editor",
        submenu: [
          { label: "Next Editor" },
          { label: "Previous Editor" },
          { type: "separator" },
          { label: "Next Used Editor" },
          { label: "Previous Used Editor" },
          { type: "separator" },
          { label: "Next Editor in Group" },
          { label: "Previous Editor in Group" },
        ],
      },
      {
        label: "Switch Group",
        submenu: [
          { label: "Group 1" },
          { label: "Group 2" },
          { label: "Group 3", enabled: false },
          { label: "Group 4", enabled: false },
          { type: "separator" },
          { label: "Next Group", enabled: false },
          { label: "Previous Group", enabled: false },
        ],
      },
      { type: "separator" },
      { label: "Go to File" },
      { label: "Go to Symbol in Workspace" },
      { type: "separator" },
      { label: "Go to Symbol in Editor" },
      { label: "Go to Definition" },
      { label: "Go to Declaration" },
      { label: "Go to Type Definition" },
      { label: "Go to Implementations" },
      { label: "Go to References" },
      { type: "separator" },
      { label: "Go to Line/Column" },
      { label: "Go to Bracket" },
      { type: "separator" },
      { label: "Next Problem" },
      { label: "Previous Problem" },
      { type: "separator" },
      { label: "Next Change" },
      { label: "Previous Change" },
    ],
  },
  {
    label: "Run",
    submenu: [
      {
        label: "Run",
        click: () => {
          mainWindow.webContents.send("run-code-manual");
        },
        accelerator: "F5",
      },
      { label: "Start Debugging" },
      { label: "Run Without Debugging" },
      { label: "Stop Debugging", enabled: false },
      { label: "Restart Debugging", enabled: false },
      { type: "separator" },
      { label: "Open Configuration", enabled: false },
      { label: "Add Configuration", enabled: true },
      { type: "separator" },
      { label: "Step Over", enabled: false },
      { label: "Step Into", enabled: false },
      { label: "Step Out", enabled: false },
      { label: "Continue", enabled: false },
      { type: "separator" },
      { label: "Toggle Breakpoint" },
      { label: "New Breakpoint" },
      {
        role: "zoom",
        submenu: [
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
        ],
      },
    ],
  },
] as unknown as MenuItem[];
