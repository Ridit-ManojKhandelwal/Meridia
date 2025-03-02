import React, { useRef, useState } from "react";
import { get_file_types, path_join } from "../../../shared/functions";

import {
  FileAddFilled,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
} from "@ant-design/icons/lib";
import FileIcon from "../../../shared/file-icon";
import FolderIcon from "../../../shared/folder-icon";

import { useAppDispatch, useAppSelector } from "../../../shared/hooks";
import { MainContext } from "../../../shared/functions";

import {
  set_folder_structure,
  update_active_file,
  update_active_files,
} from "../../../shared/rdx-slice";
import { IFolderStructure, TActiveFile } from "../../../shared/types";

import { store } from "../../../shared/store";

import * as monaco from "monaco-editor";

import "./style.css";

const Folder = React.memo(({ handleInsertNode = () => {}, explorer }: any) => {
  const [showPreview, setShowPreview] = useState(false);

  const [_, setPreviewContent] = useState<string>("");

  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [expand, setExpand] = useState(explorer.name === explorer.root);

  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const active_files = useAppSelector((state) => state.main.active_files);
  const active_file = useAppSelector((state) => state.main.active_file);
  const useMainContextIn = React.useContext(MainContext);

  const previewTimeout = useRef<NodeJS.Timeout | null>(null);

  const settings = useAppSelector((state) => state.main.editorSettings);

  const dispatch = useAppDispatch();

  const handleMouseEnter = async () => {
    previewTimeout.current = setTimeout(async () => {
      setShowPreview(true);
      const content = await window.electron.get_file_content(explorer.path);
      setPreviewContent(content);

      if (previewRef.current) {
        if (editorRef.current) {
          editorRef.current.dispose();
          editorRef.current = null;
        }
        editorRef.current = monaco.editor.create(previewRef.current, {
          value: content,
          language: get_file_types(explorer.name) || "plaintext",
          theme: "vs-dark",
          readOnly: true,
          minimap: { enabled: false },
          automaticLayout: true,
        });

        if (active_file?.name === explorer?.name) {
          console.log("content changed found");
          editorRef.current.setValue(active_file.content || "");
        }
      }
    }, 200); // Adds a slight delay for smoothness
  };

  const handleMouseLeave = () => {
    if (previewTimeout.current) {
      clearTimeout(previewTimeout.current);
      previewTimeout.current = null;
    }
    setShowPreview(false);
    if (editorRef.current) {
      editorRef.current.dispose();
      editorRef.current = null;
    }
  };

  const sortedItems = Array.isArray(explorer.items)
    ? [...explorer.items].sort((a, b) => {
        if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
        return a.isFolder ? -1 : 1;
      })
    : [];

  const handleNewFolder = (e: any, isFolder: any) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const handle_set_editor = React.useCallback(
    async (branch_name: string, full_path: string) => {
      console.log("branch", branch_name, full_path);
      const get_file_content =
        await window.electron.get_file_content(full_path);

      console.log("file content", get_file_content);
      const active_file: TActiveFile = {
        icon: "",
        path: full_path,
        name: branch_name,
        is_touched: false,
        content: get_file_content,
      };

      const selected_file = {
        name: branch_name,
        path: full_path,
        content: get_file_content,
      };

      if (
        store
          .getState()
          .main.active_files.findIndex((file) => file.path == full_path) == -1
      ) {
        store.dispatch(
          update_active_files([
            ...store.getState().main.active_files,
            active_file,
          ])
        );
      }

      dispatch(update_active_file(active_file));

      // dispatch(set_selected_file(selected_file))
      setTimeout(() => {
        useMainContextIn.handle_set_editor(selected_file);
      }, 0);
    },
    [active_files]
  );

  const onAddFolder = async (e: any) => {
    if (e.keyCode === 13 && e.target.value.trim()) {
      const newName = e.target.value.trim();

      const alreadyExists = explorer.items.some(
        (item: any) =>
          item.name === newName && item.isFolder === showInput.isFolder
      );

      if (alreadyExists) {
        alert(
          `${
            showInput.isFolder ? "Folder" : "File"
          } "${newName}" already exists.`
        );
        return;
      }

      console.log(explorer.id);
      try {
        console.log(explorer);
        if (showInput.isFolder) {
          await window.electron.create_folder({
            path: path_join([explorer.root, newName]),
            fileName: newName,
            rootPath: explorer.root,
          });
        } else {
          await window.electron.create_file({
            path: path_join([explorer.root, newName]),
            fileName: newName,
            rootPath: explorer.root,
          });
        }

        handleInsertNode(explorer.id, newName, showInput.isFolder);
        // handleInsertNode(0, "main222.pu", true);
      } catch (error) {
        console.error("Error creating file/folder:", error);
        alert(
          `Failed to create ${showInput.isFolder ? "folder" : "file"}: ${
            error.message
          }`
        );
      }

      setShowInput({ ...showInput, visible: false });
    }
  };

  const handle_open_folder = React.useCallback(async () => {
    const folder = (await window.electron.openFolder()) as IFolderStructure;
    folder != undefined && dispatch(set_folder_structure(folder));
  }, []);

  if (Object.keys(explorer).length == 0) {
    return (
      <div className="no-folder-selected-wrapper">
        <p>Select Folder</p>
        <button onClick={handle_open_folder}>Open Directory</button>
      </div>
    );
  } else {
    if (explorer.isFolder) {
      return (
        <div style={{ marginTop: 5 }} className="folder-container">
          <div
            className="folder"
            onClick={() => setExpand(!expand)}
            onAuxClick={() =>
              window.electron.show_contextmenu({
                path: explorer.name,
                type: "folder",
                rootPath: explorer.root,
              })
            }
          >
            <span>
              <FolderIcon name={explorer.name} expanded={expand} />
              {explorer.name.split(/\/|\\/).at(-1)}
            </span>
            <div>
              <button onClick={(e) => handleNewFolder(e, true)}>
                <FolderAddOutlined />
              </button>
              <button onClick={(e) => handleNewFolder(e, false)}>
                <FileAddFilled />
              </button>
            </div>
          </div>
          <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
            {showInput.visible && (
              <div className="inputContainer">
                <span>
                  {showInput.isFolder ? <FolderOutlined /> : <FileOutlined />}
                </span>
                <input
                  type="text"
                  onKeyDown={onAddFolder}
                  onBlur={() => setShowInput({ ...showInput, visible: false })}
                  className="inputContainer__input"
                  autoFocus
                />
              </div>
            )}
            {sortedItems.map((exp: any) => (
              <div key={exp.id}>
                <Folder handleInsertNode={handleInsertNode} explorer={exp} />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <span
          className={`file`}
          onClick={() => {
            handle_set_editor(explorer.name, explorer.path);
          }}
          onAuxClick={() =>
            window.electron.show_contextmenu({
              path: explorer.name,
              type: "file",
              rootPath: explorer.root,
            })
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {FileIcon({
            type: `${explorer.name}`.split(".").at(-1),
          })}
          {explorer.name}
          {/* {showPreview && (
            <div
              className="file-preview show"
              ref={previewRef}
              onClick={(e) => e.stopPropagation()}
            />
          )} */}
        </span>
      );
    }
  }
});

export default Folder;
