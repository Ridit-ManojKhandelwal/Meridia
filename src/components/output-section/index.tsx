import React, { useEffect, useRef } from "react";

import "./index.css";

const Output = React.memo(({ history, updateHistory }: any) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById("output-parent")) {
      outputRef.current?.setAttribute("id", "output-parent");
    }

    history.forEach((line: any) => {
      const div = document.createElement("div");
      div.className = "output";
      div.textContent = line;
      outputRef.current?.appendChild(div);
    });
  }, [history]); // Added dependency to re-render when history changes

  window.electron.ipcRenderer.on("update-output-history", (data: any) => {
    updateHistory("output", data);
  });

  return <div ref={outputRef} className="output-parent"></div>;
});

export default Output;
