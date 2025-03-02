import React from "react";
import { useAppSelector } from "../../../shared/hooks";
import { get_file_types } from "../../../shared/functions";

const FooterComponent = React.memo(() => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const editor_indent = useAppSelector((state) => state.main.indent);
  const active_file = useAppSelector((state) => state.main.active_file);
  const ui = useAppSelector((state) => state.main.ui);

  const extensionItem = ui.footer.find((item) => item.type === "extensions");

  return (
    <div
      className="footer-section"
      style={{
        width: "100%",
        zIndex: 100,
        borderTop: "1px solid var(--main-border-color)",
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 8px",
        overflow: "hidden",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {ui.footer.some((item) => item.type === "project-name") && (
        <div>
          <span>
            {active_file?.name ||
              folder_structure?.name?.split(/\/|\\/).at(-1) ||
              "main"}
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        {ui.footer.some((item) => item.type === "editor-indent") && (
          <div>
            Ln {editor_indent.line}, Col {editor_indent.column}
          </div>
        )}

        {ui.footer.some((item) => item.type === "editor-spaces") && (
          <div>Spaces: 4</div>
        )}

        {ui.footer.some((item) => item.type === "editor-utf") && (
          <div>UTF-8</div>
        )}

        {ui.footer.some((item) => item.type === "selected-file-language") &&
          active_file?.name && (
            <div style={{ textTransform: "capitalize" }}>
              {get_file_types(active_file.name)}
            </div>
          )}
      </div>
    </div>
  );
});

export default FooterComponent;
