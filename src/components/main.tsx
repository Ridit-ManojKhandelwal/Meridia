import React, { useCallback } from "react";
import { MainContext } from "../shared/functions";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { IFolderStructure, TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";

import oneDark from "../theme/oneDark.json";
import pythonLangData from "../languages/python/python.json";

import { App } from "./app";

import * as monaco from "monaco-editor";

const MainComponent = React.memo((props: any) => {
  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();
  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);

  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  console.log("folder strucute", folder_structure);

  function flattenFolderStructure(folder: any) {
    let suggestions: any = [];
    if (folder && Array.isArray(folder.items)) {
      folder.items.forEach((item: any) => {
        suggestions.push({
          label: item.name,

          kind: item.is_Folder
            ? monaco.languages.CompletionItemKind.Folder
            : monaco.languages.CompletionItemKind.File,

          insertText: item.is_Folder ? item.name + "/" : item.name,
          detail: item.path,
        });
        // Recursively add child items if this item is a folder
        if (item.is_Folder && item.items && item.items.length > 0) {
          suggestions = suggestions.concat(flattenFolderStructure(item));
        }
      });
    }
    return suggestions;
  }

  const handle_set_editor = useCallback(
    async (selected_file: TSelectedFile) => {
      console.log("selected_file", selected_file);

      if (editor_ref.current != undefined) {
        const current_model = editor_ref.current.getModel();
        const current_model_index = editor_files_ref.current.findIndex(
          (editor) => editor.editor_id == current_model.uri.path
        );

        if (current_model_index > -1) {
          editor_files_ref.current.splice(current_model_index, 1);
          const state = editor_ref.current.saveViewState();
          editor_files_ref.current.push({
            editor_id: current_model.uri.path,
            editor_state: state,
          });
        } else {
          const state = editor_ref.current.saveViewState();
          editor_files_ref.current.push({
            editor_id: current_model.uri.path,
            editor_state: state,
          });
        }

        const target_model = monaco.editor
          .getModels()
          .filter((model) => model.uri.path == selected_file.path);

        if (target_model.length > 0) {
          const _model_index = editor_files_ref.current.findIndex(
            (editor) => editor.editor_id == selected_file.path
          );
          editor_ref.current.setModel(target_model[0]);

          console.log(
            "target_model",
            target_model,
            _model_index,
            editor_files_ref.current[_model_index],
            editor_files_ref.current
          );

          return (
            _model_index > -1 &&
            editor_ref.current.restoreViewState(
              editor_files_ref.current[_model_index].editor_state
            )
          );
        }
      }

      const new_model = monaco.editor.createModel(
        selected_file.content,
        get_file_types(selected_file.name),
        monaco.Uri.file(selected_file.path)
      );

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: 4,
        baseUrl: selected_file.path.split(/\\|\//g).at(-1),
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      monaco.editor.defineTheme("oneDark", {
        inherit: oneDark.inherit,
        colors: oneDark.colors,
        rules: oneDark.rules,
        encodedTokensColors: oneDark.encodedTokensColors,
        base: "vs-dark",
      });

      if (editor_ref.current == undefined) {
        editor_ref.current = monaco.editor.create(
          document.querySelector(".editor-container"),
          {
            theme: "oneDark",
            cursorBlinking: "expand",
            cursorSmoothCaretAnimation: "on",
            minimap: { enabled: false },
            quickSuggestions: { other: true, comments: true, strings: true },
            wordBasedSuggestions: "allDocuments",
            automaticLayout: true,
            folding: true,
            lineNumbers: "on",
            largeFileOptimizations: true,
            links: true,
            acceptSuggestionOnEnter: "on",
            autoClosingBrackets: "always",
            formatOnPaste: true,
            formatOnType: true,
            mouseWheelZoom: true,
            contextmenu: true,
            bracketPairColorization: {
              enabled: true,
            },
            screenReaderAnnounceInlineSuggestion: true,
            parameterHints: {
              enabled: true,
            },
          }
        );
      }

      editor_ref.current.setModel(new_model);

      editor_ref.current.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          handle_save_file({
            path: editor_ref.current.getModel().uri.path,
            content: editor_ref.current.getValue(),
          });
        }
      );

      editor_ref.current.onDidChangeModelContent((e) => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex(
            (file) => file.path == editor_ref.current.getModel().uri.path
          );
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        model_editing.is_touched = true;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
      });

      editor_ref.current.onDidChangeCursorPosition((e) => {
        dispatch(
          update_indent({
            line: e.position.lineNumber,
            column: e.position.column,
          })
        );
      });

      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          );

          const suggestions = [
            ...pythonLangData.keywords.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              detail: "Python Keyword",
              range: range,
            })),
            ...pythonLangData.builtins.map((builtin) => ({
              label: builtin,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: builtin,
              detail: "Python Built-in",
              range: range,
            })),
          ];

          return { suggestions };
        },
      });
    },
    [editor_ref.current, editor_files_ref.current, active_files]
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

      const is_current_model =
        editor_ref.current.getModel().uri.path == selected_file.path;
      const allModels = monaco.editor.getModels();
      const target_model_index = allModels.findIndex(
        (model) => model.uri.path == selected_file.path
      );
      // monaco.editor.add
      // monaco.editor.getModels().splice(target_model_index, 1)
      console.log(
        "monaco.editor.getModels().length",
        monaco.editor.getModels().length
      );
      monaco.editor.getModels()[target_model_index].dispose();

      console.log(
        "monaco.editor.getModels().length",
        monaco.editor.getModels().length
      );
      if (is_current_model) {
        const new_index =
          target_model_index == 0 ? target_model_index : target_model_index - 1;

        if (monaco.editor.getModels().length > 0) {
          editor_ref.current.setModel(monaco.editor.getModels()[new_index]);
        } else {
          editor_ref.current.dispose();
          editor_ref.current = undefined;
        }
      }
    },
    [editor_ref.current]
  );

  const handle_win_blur = React.useCallback(() => {
    console.log("win is blur");

    const blurred_active_files = store
      .getState()
      .main.active_files.filter((file) => file.is_touched == true);
    blurred_active_files.forEach((file) => {
      handle_save_file({
        path: file.path,
        content: monaco.editor
          .getModels()
          .find((model) => model.uri.path == file.path)
          .getValue(),
      });
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener("blur", handle_win_blur);
    return () => window.removeEventListener("blur", handle_win_blur);
  }, []);

  //   React.useEffect(() => {
  //     const handleKeyDown = (event: KeyboardEvent) => {
  //       if (event.key === "Tab") {
  //         event.preventDefault();
  //       }
  //     };

  //     window.addEventListener("keydown", handleKeyDown);

  //     return () => {
  //       window.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }, []);

  return (
    <MainContext.Provider
      value={{ handle_set_editor, handle_remove_editor, handle_save_file }}
    >
      <App />
    </MainContext.Provider>
  );
});

export default MainComponent;
