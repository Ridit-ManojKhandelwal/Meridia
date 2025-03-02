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

ipcRenderer.on("received-output", (_, data) => {
  const parentDiv = document.querySelector(".output-parent");
  if (!parentDiv) return;

  let outputDiv = document.querySelector("#output");
  if (!outputDiv) {
    outputDiv = document.createElement("div");
    outputDiv.id = "output";
    parentDiv.appendChild(outputDiv);
  }

  // Append instead of replacing
  const newLine = document.createElement("div");
  newLine.textContent = data;
  outputDiv.appendChild(newLine);

  console.log("output", data);
});
