import React, { useCallback, useEffect } from "react";
import { MainContext } from "../shared/functions";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";
import oneDark from "../../theme/oneDark.json";
import pythonLangData from "../../extensions/languages/python/python.json";
import { App } from "./app";
import * as monaco from "monaco-editor";

const MainComponent = React.memo((props: any) => {
  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();

  const settings = useAppSelector((state) => state.main.editorSettings);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!editor_ref.current) return;
    editor_ref.current.updateOptions(settings);
  }, [settings]);

  function normalizePath(path: string) {
    return path.replace(/^\/(\w):\/.*$/, "$1:/");
  }

  const handle_set_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("Setting editor for:", selected_file);

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

      if (!editor_ref.current) {
        console.log("Creating new editor instance...");
        editor_ref.current = monaco.editor.create(
          document.querySelector(".editor-container"),
          {
            theme: settings.theme,
            language: get_file_types(selected_file.name),

            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            cursorBlinking: settings.cursorBlinking,
            cursorSmoothCaretAnimation: settings.cursorSmoothCaretAnimation,
            minimap: settings.minimap,
            quickSuggestions: settings.quickSuggestions,
            wordBasedSuggestions: settings.wordBasedSuggestions,
            automaticLayout: settings.automaticLayout,
            folding: settings.folding,
            lineNumbers: settings.lineNumbers,
            largeFileOptimizations: settings.largeFileOptimizations,
            links: settings.links,
            acceptSuggestionOnEnter: settings.acceptSuggestionOnEnter,
            autoClosingBrackets: settings.autoClosingBrackets,
            formatOnPaste: settings.formatOnPaste,
            formatOnType: settings.formatOnType,
            mouseWheelZoom: settings.mouseWheelZoom,
            contextmenu: settings.contextmenu,
            bracketPairColorization: settings.bracketPairColorization,
            screenReaderAnnounceInlineSuggestion:
              settings.screenReaderAnnounceInlineSuggestion,
            parameterHints: settings.parameterHints,
          }
        );
      }

      let targetModel = monaco.editor
        .getModels()
        .find(
          (model) =>
            model.uri.toString() ===
            monaco.Uri.file(selected_file.path).toString()
        );

      if (!targetModel) {
        console.log("Creating new model for:", selected_file.path);
        targetModel = monaco.editor.createModel(
          selected_file.content,
          get_file_types(selected_file.name),
          monaco.Uri.file(selected_file.path)
        );
      } else {
        console.log("Reusing existing model:", targetModel.uri.toString());
      }

      editor_ref.current.onDidChangeModelContent(() => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex(
            (file) =>
              normalizePath(file.path) ===
              normalizePath(editor_ref.current?.getModel()?.uri.path || "")
          );

        const model_editing_index1 = store
          .getState()
          .main.active_files.findIndex(
            (file) =>
              normalizePath(file.path) ===
              normalizePath(editor_ref.current?.getModel()?.uri.path || "")
          );

        console.log(
          "Normalized file path:",
          store
            .getState()
            .main.active_files.find((file) => normalizePath(file.path))
        );
        console.log(
          "Normalized Monaco path:",
          normalizePath(editor_ref.current?.getModel()?.uri.path || "")
        );
        console.log("Found index:", model_editing_index1);

        if (model_editing_index > -1) {
          const updated_files = [...store.getState().main.active_files];
          updated_files[model_editing_index] = {
            ...updated_files[model_editing_index],
            is_touched: true,
          };
          dispatch(update_active_files(updated_files));
        }
      });

      editor_ref.current.onDidChangeCursorPosition((e) => {
        dispatch(
          update_indent({
            line: e.position.lineNumber,
            column: e.position.column,
          })
        );
      });

      editor_ref.current.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          handle_save_file({
            path: editor_ref.current.getModel().uri.path,
            content: editor_ref.current.getValue(),
          });
        }
      );

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

      editor_ref.current.setModel(targetModel);
    },
    []
  );

  const handle_save_file = React.useCallback(
    (data: { path: string; content: string }) => {
      const newDataPath = normalizePath(data.path);
      window.electron.save_file({ path: newDataPath, content: data.content });

      console.log("save data", normalizePath(data.path));

      setTimeout(() => {
        const state = store.getState();
        const model_editing_index = state.main.active_files.findIndex(
          (file) => normalizePath(file.path) === normalizePath(data.path)
        );

        if (model_editing_index === -1) {
          console.warn(`File not found in active_files: ${data.path}`);
          return;
        }

        const updated_files = [...state.main.active_files];
        updated_files[model_editing_index] = {
          ...updated_files[model_editing_index],
          is_touched: false,
        };

        dispatch(update_active_files(updated_files));
      }, 0);
    },
    []
  );

  const handle_remove_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("Removing editor for:", selected_file);

      const targetModel = monaco.editor
        .getModels()
        .find(
          (model) =>
            model.uri.toString() ===
            monaco.Uri.file(selected_file.path).toString()
        );

      if (targetModel) {
        console.log("Disposing model:", targetModel.uri.toString());
        targetModel.dispose();
      } else {
        console.warn("Model not found:", selected_file.path);
      }

      const remainingModels = monaco.editor.getModels();

      if (editor_ref.current) {
        if (remainingModels.length > 0) {
          console.log("Switching to another model...");
          editor_ref.current.setModel(remainingModels[0]);
        } else {
          console.log("No models left. Disposing editor...");
          editor_ref.current.dispose();
          editor_ref.current = undefined;
        }
      }
    },
    []
  );

  const handle_win_blur = React.useCallback(() => {
    console.log("win is blur");

    const blurred_active_files = store
      .getState()
      .main.active_files.filter((file) => file.is_touched === true);

    blurred_active_files.forEach((file) => {
      const model = monaco.editor
        .getModels()
        .find(
          (model) => normalizePath(model.uri.path) === normalizePath(file.path)
        );

      if (!model) {
        console.warn(`No model found for path: ${file.path}`);
        return;
      }

      handle_save_file({
        path: file.path,
        content: model.getValue(),
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
