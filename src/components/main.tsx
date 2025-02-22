import React, { useCallback } from "react";
import { MainContext } from "../shared/functions";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";

import { App } from "./app";

import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";

const MainComponent = React.memo((props: any) => {
  const editor_ref = React.useRef<EditorView | null>(null);
  const editor_instances_ref = React.useRef<
    { filePath: string; editor: EditorView }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);
  const active_file = useAppSelector((state) => state.main.active_file);

  const handle_set_editor = useCallback(
    async (selectedFile: TSelectedFile) => {
      if (!selectedFile) return;

      const language =
        get_file_types(selectedFile.path) === "python"
          ? python()
          : javascript();

      if (editor_ref.current) {
        editor_ref.current.destroy();
      }

      // Define the cursor configuration
      const cursorConfig = EditorView.theme(
        {
          "&": {
            fontSize: "16px",
          },
          ".cm-content": {
            caretColor: "transparent", // Hide default caret
          },
        },
        { dark: true }
      );

      // Initialize the editor
      editor_ref.current = new EditorView({
        doc:
          selectedFile.content ||
          (await window.electron.get_file_content(selectedFile.path)),
        extensions: [
          basicSetup,
          language,
          oneDark,
          cursorConfig,

          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const state = store.getState();
              const activeFiles = [...state.main.active_files];

              const modelEditingIndex = activeFiles.findIndex(
                (file) => file.path === selectedFile.path
              );

              if (modelEditingIndex === -1) return;

              const updatedFile = {
                ...activeFiles[modelEditingIndex],
                is_touched: true,
              };
              activeFiles[modelEditingIndex] = updatedFile;

              dispatch(update_active_files(activeFiles));
            }
          }),
          keymap.of([
            {
              key: "Mod-s",
              run: () => {
                console.log("Saving file:", selectedFile.path);
                handle_save_file({
                  path: selectedFile.path,
                  content:
                    editor_ref.current?.state.doc.toString() ||
                    selectedFile.content?.toString() ||
                    "",
                });
                return true;
              },
            },
          ]),
        ],
        parent: document.querySelector(".editor-container"),
      });

      document
        .querySelector(".editor-container")
        ?.setAttribute("style", "height: 100%; overflow: auto;");
    },

    [dispatch, update_active_files, update_indent]
  );

  const handle_save_file = React.useCallback(
    (data: { path: string; content: string }) => {
      window.electron.save_file(data);

      setTimeout(() => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex((file) => file.path == data.path);
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        _active_file.splice(model_editing_index, 0);
        model_editing.is_touched = false;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
      }, 0);
    },
    []
  );

  const handle_remove_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("selected_file", selected_file);

      if (!editor_ref.current) return;

      const is_current_file =
        editor_ref.current.state.doc.toString() === selected_file.content;
      const allEditors = editor_instances_ref.current;

      const target_index = allEditors.findIndex(
        (editor) => editor.filePath === selected_file.path
      );

      if (target_index !== -1) {
        allEditors[target_index].editor.destroy();
        allEditors.splice(target_index, 1);
      }

      if (is_current_file && allEditors.length > 0) {
        editor_ref.current = allEditors[Math.max(0, target_index - 1)].editor;
      } else if (is_current_file) {
        editor_ref.current = null;
      }
    },
    []
  );

  const handle_win_blur = React.useCallback(() => {
    console.log("win is blur");

    const blurred_active_files = store
      .getState()
      .main.active_files.filter((file) => file.is_touched == true);
    blurred_active_files.forEach((file) => {
      handle_save_file({
        path: file.path,
        content: editor_ref.current.state.doc.toString() || "",
      });
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener("blur", handle_win_blur);
    return () => window.removeEventListener("blur", handle_win_blur);
  }, []);

  return (
    <MainContext.Provider
      value={{ handle_set_editor, handle_remove_editor, handle_save_file }}
    >
      <App />
    </MainContext.Provider>
  );
});

export default MainComponent;
