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
        pythonOptions: ["-u"],
      });

      process.on("message", (message: any) => {
        console.log("PythonShell Message:", message);
        mainWindow?.webContents.send("received-output", message);
      });
    }

    // Handle stdout only for JS, as PythonShell already manages output
    if (path.endsWith(".js") && process.stdout) {
      process.stdout.on("data", (output: any) => {
        console.log("STDOUT:", output.toString().trim());
        mainWindow?.webContents.send(
          "received-output",
          output.toString().trim()
        );
      });
    }

    if (process.stderr) {
      process.stderr.on("data", (error: any) => {
        console.error("STDERR:", error.toString().trim());
        mainWindow?.webContents.send(
          "received-output",
          `Error: ${error.toString().trim()}`
        );
      });
    }
  } catch (err) {
    console.error("Execution Error:", err);
  }
};
