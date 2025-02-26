import { mainWindow } from "..";

import fs from "fs";
import { PythonShell } from "python-shell";
import { spawn } from "child_process";

export const get_file_content = ({ path }: { path: string }) => {
  try {
    console.log(path);
    const file_content = fs.readFileSync(path, "utf8");
    console.log("got file content", file_content);
    return file_content;
  } catch (err) {
    return err;
  }
};

export const run_code = ({ data }: { data: { path: string } }) => {
  try {
    const { path } = data;
    if (!path.endsWith(".py") && !path.endsWith(".js")) return;

    let process: any;

    if (path.endsWith(".js")) {
      process = spawn("node", [path]);
    } else {
      process = new PythonShell(path, {
        pythonPath: PythonShell.defaultPythonPath,
        mode: "text",
      });

      process.on("message", (message: any) => {
        mainWindow?.webContents.send("received-output", message);
      });
    }

    if (process.stdout) {
      process.stdout.on("data", (output: any) => {
        mainWindow?.webContents.send("received-output", output.toString());
      });
    }

    if (process.stderr) {
      process.stderr.on("data", (error: any) => {
        mainWindow?.webContents.send(
          "received-output",
          `Error: ${error.toString()}`
        );
      });
    }
  } catch (err) {
    console.error("Execution Error:", err);
  }
};
