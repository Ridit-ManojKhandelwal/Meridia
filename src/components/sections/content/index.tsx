import React, { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../../shared/hooks";
import {
  update_active_file,
  update_active_files,
} from "../../../shared/rdx-slice";
import FileIcon from "../../../shared/file-icon";

import SettingsComponent from "../../settings-section";

import { TActiveFile } from "../../../shared/types";

import { ReactComponent as TimesIcon } from "../../../assets/svg/times.svg";

import PerfectScrollbar from "react-perfect-scrollbar";

import { MainContext } from "../../../shared/functions";

const ContentSection = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const { folder_structure, active_files, active_file } = useAppSelector(
    (state) => ({
      folder_structure: state.main.folder_structure,
      active_files: state.main.active_files,
      active_file: state.main.active_file,
    })
  );

  const useMainContextIn = React.useContext(MainContext);

  const handle_set_selected_file = React.useCallback(
    (active_file: TActiveFile) => {
      dispatch(update_active_file(active_file));
      useMainContextIn.handle_set_editor(active_file);
    },
    [active_files]
  );

  const handleRemoveFile = React.useCallback(
    (e: MouseEvent, file: TActiveFile) => {
      e.stopPropagation();

      if (file.name === "Settings") {
        handleRemoveSettingsTab();
        return;
      }

      if (file.is_touched === false) {
      }

      const _clone = [...active_files];
      const index_to_remove = _clone.findIndex((_t) => _t.path == file.path);
      const targetFile = _clone[index_to_remove];
      _clone.splice(index_to_remove, 1);
      const next_index =
        index_to_remove == 0 ? index_to_remove : index_to_remove - 1;
      active_file.path == file.path &&
        dispatch(update_active_file(_clone[next_index]));
      dispatch(update_active_files(_clone));
      useMainContextIn.handle_remove_editor(targetFile);
    },
    [active_files, active_file]
  );

  const handleRemoveSettingsTab = React.useCallback(() => {
    const _clone = [...active_files];
    const index_to_remove = _clone.findIndex(
      (file) => file.name === "Settings"
    );

    if (index_to_remove === -1) return;

    _clone.splice(index_to_remove, 1);

    const next_index =
      index_to_remove === 0 ? index_to_remove : index_to_remove - 1;

    if (active_file.name === "Settings") {
      dispatch(update_active_file(_clone[next_index] || null));
    }

    dispatch(update_active_files(_clone));
  }, [active_files, active_file]);

  const handle_set_settings = React.useCallback(() => {
    if (active_file.name !== "Settings") {
      dispatch(
        update_active_file({
          name: "Settings",
          path: "",
          icon: "settings",
          is_touched: false,
        })
      );
    }
  }, [active_file]);

  useEffect(() => {
    if (active_file?.name === "Settings") {
      document.querySelector("#editor")?.setAttribute("style", "display: none");
    } else {
      document
        .querySelector("#editor")
        ?.setAttribute("style", "display: block");
    }
  }, [active_file, handle_set_settings]);

  const handleMiddleClick = (e: any, file: any) => {
    if (e.button === 1) {
      e.preventDefault();
      handleRemoveFile(e, file);
    }
  };

  return (
    <div className="content-section">
      {Object.keys(folder_structure).length == 0 && (
        <div className="default-screen"></div>
      )}
      {Object.keys(folder_structure).length > 0 && active_files.length == 0 ? (
        <div></div>
      ) : (
        <div className="content-inner">
          <PerfectScrollbar className="page-tabs-cont" style={{ zIndex: 9 }}>
            <div className="tabs">
              {active_files.map((file, index) => (
                <div
                  key={file.path}
                  onClick={() =>
                    file.name === "Settings"
                      ? handle_set_settings()
                      : handle_set_selected_file(file)
                  }
                  className={
                    "tab" + (active_file?.path === file.path ? " active" : "")
                  }
                  onMouseUp={(e) => handleMiddleClick(e, file)}
                  draggable
                >
                  <span>
                    {FileIcon({
                      type:
                        file.name === "Settings"
                          ? "settings"
                          : file.name.split(".").at(-1) || "py",
                    })}
                  </span>
                  <span>{file.name}</span>
                  <span
                    onClick={(e) => handleRemoveFile(e as any, file)}
                    className={file.is_touched ? "is_touched" : ""}
                  >
                    <TimesIcon />
                    <span className="dot"></span>
                  </span>
                </div>
              ))}
            </div>
          </PerfectScrollbar>
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {active_file?.name === "Settings" && <SettingsComponent />}

            <div className="python-container" id="editor"></div>
            <div className="editor-container" id="editor"></div>
          </PerfectScrollbar>
        </div>
      )}
    </div>
  );
});

export default ContentSection;
