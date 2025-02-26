import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks";
import { get_file_types } from "../../../shared/functions";

const FooterComponent = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const editor_indent = useAppSelector((state) => state.main.indent);
  const active_file = useAppSelector((state) => state.main.active_file);
  const dispatch = useAppDispatch();

  return (
    <div
      className="footer-section"
      style={{
        width: "100%",
        zIndex: 100,
        borderTop: "1px solid var(--main-border-color)",
      }}
    >
      <div>
        <div className="">
          <span>
            {active_file == undefined || ""
              ? folder_structure.name == undefined || ""
                ? "main"
                : folder_structure?.name?.split(/\/|\\/).at(-1)
              : active_file.name}
          </span>
        </div>
      </div>
      <div>
        <div className="">
          <div>
            Ln {editor_indent.line}, Col {editor_indent.column}
          </div>
        </div>
        <div className="">
          <div>Spaces: 4</div>
        </div>
        <div className="">
          <div>UTF-8</div>
        </div>
        <div className="">
          <div style={{ textTransform: "capitalize" }}>
            {active_file == undefined ? "" : get_file_types(active_file.name)}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FooterComponent;
