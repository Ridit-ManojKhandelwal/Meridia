import { dialog } from "electron";

import { mainWindow } from "../main";

import { get_files } from "./get_files";

import fs from "fs";
import { PythonShell } from "python-shell";
import { spawn } from "child_process";

let previousOutput = "";

interface Variable {
  name: string;
  type: string;
  value: string | number | boolean | null;
}

export const open_set_folder = async () => {
  const folder = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  let structure = undefined;
  if (!folder.canceled) {
    console.log("folder", folder.filePaths[0]);
    const items = get_files(folder.filePaths[0]);
    structure = {
      // name: path.dirname(folder.filePaths[0]),
      id: 0,
      name: folder.filePaths[0],
      root: folder.filePaths[0],
      isFolder: true,
      items,
    };
    // @ts-ignore
    store.set(SELECTED_FOLDER_STORE_NAME, structure);
    // ipcMain.emit('new-folder-opened')
    mainWindow.webContents.send("new-folder-opened");
  }
};

export const open_folder = async () => {
  const folder = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  let structure = undefined;
  if (!folder.canceled) {
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
  }

  return structure;
};

export const set_folder = ({ folder }: { folder: string }) => {
  let structure = undefined;

  try {
    const items = get_files(folder);

    structure = {
      id: 1,
      name: folder,
      root: folder,
      isFolder: true,
      items,
    };

    // @ts-ignore
    store.set(SELECTED_FOLDER_STORE_NAME, structure);

    mainWindow.webContents.send("new-folder-opened", structure);
  } catch (error) {
    console.error(`Error while reading the folder: ${error.message}`);
    mainWindow.webContents.send("error-opening-folder", error.message);
  }
};

export const refresh_window = ({ folder }: { folder: string }) => {
  let structure = undefined;

  const items = get_files(folder);
  structure = {
    id: 0,
    name: folder,
    root: folder,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);
  mainWindow.webContents.send("new-folder-opened");
};

export const create_folder = ({
  data,
}: {
  data: { path: string; rootPath: string; fileName: string };
}) => {
  const new_folder = fs.mkdirSync(data.path);

  const items = get_files(data.rootPath);
  const structure = {
    // name: path.dirname(data.rootPath),
    id: 1,
    name: data.rootPath,
    root: data.rootPath,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);

  const newFolder = {
    name: data.fileName,
    parentPath: data.path,
    path: data.path,
    is_dir: true,
  };
};

export const create_file = ({
  data,
}: {
  data: { path: string; rootPath: string };
}) => {
  const new_file = fs.writeFileSync(data.path, "");

  const items = get_files(data.rootPath);
  const structure = {
    id: 1,
    name: data.rootPath,
    root: data.rootPath,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);
};

export const get_file_content = ({ path }: { path: string }) => {
  try {
    console.log(path);
    const file_content = fs.readFileSync(path, "utf8");
    return file_content;
  } catch (err) {
    return err;
  }
};

export const run_code = ({
  data,
  event,
}: {
  data: {
    path: string;
  };
  event: Electron.IpcMainInvokeEvent;
}) => {
  try {
    if (!data.path.endsWith(".py")) {
      if (data.path.endsWith(".js")) {
        const nodeProcess = spawn(`node`, [data.path]);

        nodeProcess.stdout.on("data", (data) => {
          // Append to the previous output
          previousOutput += data.toString();
          mainWindow.webContents.send("received-output", previousOutput);
        });

        nodeProcess.stderr.on("data", (data) => {
          // Append to the previous output
          previousOutput += `Error: ${data.toString()}`;
          mainWindow.webContents.send("received-output", previousOutput);
        });

        nodeProcess.on("close", (code) => {
          if (code !== 0) {
            previousOutput += `Process exited with code ${code}`;
            mainWindow.webContents.send("received-output", previousOutput);
          }
        });
      }
      return;
    }

    // @ts-ignore
    const vars = store.get(DATASTUDIO_VARIABLES_STORE_NAME);

    const content = fs.readFileSync(data.path, "utf8");

    const words = content.split(/\s+/);

    vars.map((data: any) => {
      for (let word of words) {
        data.name === word
          ? event.sender.send("show-tools", data.toString())
          : console.log(data.name, words);
      }
    });
  } catch (err) {}

  try {
    let options = {
      pythonPath: PythonShell.defaultPythonPath, // Auto-detects system Python
      scriptPath: "", // Set script directory if needed
    };

    let pythonProcess = new PythonShell(data.path, options);

    pythonProcess.on("message", (message) => {
      previousOutput += message + "\n";
      mainWindow?.webContents.send("received-output", message);
    });

    pythonProcess.on("stderr", (stderr) => {
      previousOutput += `Error: ${stderr}\n`;
      mainWindow?.webContents.send("received-output", stderr);
    });

    pythonProcess.end((err, code, signal) => {
      if (err) {
        previousOutput += `Process exited with error: ${err.message}`;
        mainWindow?.webContents.send("received-output", err.message);
      } else if (code !== 0) {
        previousOutput += `Process exited with code ${code}`;
        mainWindow?.webContents.send(
          "received-output",
          `Exited with code ${code}`
        );
      }
    });
  } catch (err) {}
};

export const get_variables = ({ filePath }: { filePath: string }) => {
  try {
    if (!filePath.endsWith(".py")) {
      return { error: "Only Python files are allowed." };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/gm;

    const variables: Variable[] = [];
    let match;

    while ((match = variableRegex.exec(fileContent)) !== null) {
      const name = match[1];
      const rawValue = match[2].trim();

      let value: any = rawValue;
      let type = "string";

      try {
        if (!isNaN(Number(rawValue))) {
          value = Number(rawValue);
          type = "number";
        } else if (rawValue === "True" || rawValue === "False") {
          value = rawValue === "True";
          type = "boolean";
        } else if (rawValue === "None") {
          value = null;
          type = "null";
        } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
          type = "list";
        } else if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
          type = "dict";
        } else if (rawValue.startsWith("(") && rawValue.endsWith(")")) {
          value = JSON.parse(
            rawValue.replace(/'/g, '"').replace(/^\(|\)$/g, "[") + "]"
          );
          type = "tuple";
        } else if (rawValue.startsWith("set(") && rawValue.endsWith(")")) {
          const setContent = rawValue.slice(4, -1).replace(/^\{|\}$/g, "");
          value = new Set(JSON.parse(`[${setContent.replace(/'/g, '"')}]`));
          type = "set";
        } else {
          value = rawValue.replace(/^["']|["']$/g, "");
        }
      } catch (parseError) {}

      variables.push({ name, type, value });
    }

    return { vars: variables };
  } catch (err) {
    return { error: "Failed to process the file." };
  }
};
