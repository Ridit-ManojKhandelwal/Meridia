import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { update_output_history } from "../../shared/rdx-slice";

const Output = React.memo(() => {
  const dispatch = useAppDispatch();
  const output = useAppSelector((state) => state.main.output_history);

  useEffect(() => {
    if (output !== undefined) {
      const parentDiv = document.querySelector("#output-parent");
      const outputDiv = document.createElement("div");
      outputDiv.id = "output";
      outputDiv.innerHTML = output.toString();
      parentDiv.append(outputDiv);
    }
  }, []);

  window.electron.ipcRenderer.on("update-output", (event: any, data: any) => {
    dispatch(update_output_history(data));
    console.log("histoy", data);
  });
  return <div id="output-parent"></div>;
});

export default Output;
