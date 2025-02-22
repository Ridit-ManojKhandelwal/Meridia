import { ipcRenderer } from "electron";

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

  // Remove the previous output if it exists
  const existingOutput = document.querySelector("#output");
  if (existingOutput) {
    existingOutput.remove();
  }

  // Create a new output div
  const outputDiv = document.createElement("div");
  outputDiv.id = "output";
  outputDiv.innerHTML = data;
  parentDiv.append(outputDiv);

  ipcRenderer.send("update-output", data);
});
