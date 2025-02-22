import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks";
import { get_file_types } from "../../../shared/functions";
import {
  update_sidebar_active,
  update_terminal_active,
} from "../../../shared/rdx-slice";

const FooterComponent = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const editor_indent = useAppSelector((state) => state.main.indent);
  const active_file = useAppSelector((state) => state.main.active_file);
  const sidebar_active = useAppSelector((state) => state.main.sidebar_active);
  const terminal_active = useAppSelector((state) => state.main.terminal_active);
  const dispatch = useAppDispatch();

  return (
    <div
      className="footer-section"
      style={{
        // position: "absolute",
        // bottom: 0,
        // left: 0,
        // right: 0,
        width: "100%",
        zIndex: 100,
        borderTop: "1px solid #4a4a4a",
      }}
    >
      <div>
        <div className="">
          <span
            onClick={() =>
              dispatch(update_sidebar_active(sidebar_active ? false : true))
            }
          >
            Sidebar
          </span>
        </div>
        <div
          className=""
          style={{
            borderLeft: "2px solid var(--border-color)",
            borderRight: "2px solid var(--border-color)",
          }}
        >
          <span
            onClick={() =>
              dispatch(update_terminal_active(terminal_active ? false : true))
            }
          >
            Terminal
          </span>
        </div>
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
