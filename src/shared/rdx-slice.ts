import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  IFolderStructure,
  IMainState,
  TActiveFile,
  TIndent,
  TDataStudioActive,
  TEnvVars,
  DataPreviewToolsTab,
  IEditorSettings,
  IUIState,
  IUI,
} from "./types";

// Define the initial state using that type
const initialState: IMainState = {
  folder_structure: {} as IFolderStructure,
  active_files: [],
  active_file: {} as TActiveFile,
  indent: {
    column: 0,
    line: 0,
  } as TIndent,
  settings_tab_active: false,
  env_vars: {
    vars: [],
  } as TEnvVars,
  data_studio_active: { active: false } as TDataStudioActive,
  set_data_tool_type_tab: { active: true, data: [] } as DataPreviewToolsTab,
  sidebar_active: true,
  bottom_panel_active: true,
  toolsdata: null,
  tools_in_a_window: false,
  current_bottom_tab: 0,
  output_history: [{ output: undefined }],
  editorSettings: {
    theme: "oneDark",
    fontSize: 16,
    fontFamily: "'Droid Sans Mono', 'monospace', monospace",
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
    bracketPairColorization: { enabled: true },
    screenReaderAnnounceInlineSuggestion: true,
    parameterHints: { enabled: true },
    floatingPreview: true,
  },
  uiState: {
    active_file: {
      name: "",
      path: "",
      icon: "",
      is_touched: false,
      content: "",
    },
    active_files: [
      { name: "", path: "", icon: "", is_touched: false, content: "" },
    ],
    current_bottom_tab: 1,
    sidebar_active: true,
    bottom_panel_active: true,
  },
  ui: {
    header: [
      {
        name: "",
        type: "",
        tooltip: "",
        shortcut: "",
      },
    ],
    sidebar: [
      {
        name: "",
        position: "",
        tooltip: "",
        shortcut: "",
        content: "content",
      },
    ],
    footer: [
      {
        name: "",
        type: "extensions",
        text: "[editor-indent]",
        tooltip: "[editor-indent]",
      },
    ],
  } as IUI,
};

export const mainSlice = createSlice({
  name: "main",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    set_folder_structure: (state, action: PayloadAction<IFolderStructure>) => {
      state.folder_structure = action.payload;
    },
    update_active_files: (state, action: PayloadAction<TActiveFile[]>) => {
      state.active_files = action.payload;
    },
    update_active_file: (state, action: PayloadAction<TActiveFile>) => {
      state.active_file = action.payload;
    },
    update_indent: (state, action: PayloadAction<TIndent>) => {
      state.indent = action.payload;
    },
    set_settings_tab: (state, action: PayloadAction<boolean>) => {
      state.settings_tab_active = action.payload;
    },
    update_data_studio_active: (
      state,
      action: PayloadAction<TDataStudioActive>
    ) => {
      state.data_studio_active = action.payload;
    },
    update_env_vars: (state, action: PayloadAction<TEnvVars>) => {
      state.env_vars = action.payload;
    },
    set_data_tool_tab: (state, action: PayloadAction<DataPreviewToolsTab>) => {
      state.set_data_tool_type_tab = action.payload;
    },
    update_sidebar_active: (state, action: PayloadAction<boolean>) => {
      state.sidebar_active = action.payload;
    },
    update_bottom_panel_active: (state, action: PayloadAction<boolean>) => {
      state.bottom_panel_active = action.payload;
    },
    update_tools_data: (state, action: PayloadAction<any>) => {
      state.toolsdata = action.payload;
    },
    update_tools_window_state: (state, action: PayloadAction<boolean>) => {
      state.tools_in_a_window = action.payload;
    },
    update_current_bottom_tab: (state, action: PayloadAction<number>) => {
      state.current_bottom_tab = action.payload;
    },
    update_output_history: (state, action: PayloadAction<string>) => {
      state.output_history = [
        { output: state.output_history[0].output + action.payload },
      ];
    },
    update_settings: (state, action: PayloadAction<IEditorSettings>) => {
      state.editorSettings = action.payload;
    },
    update_ui_state: (state, action: PayloadAction<IUIState>) => {
      state.uiState = action.payload;
    },
    update_ui: (state, action: PayloadAction<IUI>) => {
      state.ui = action.payload;
    },
  },
});

export const {
  set_folder_structure,
  update_active_files,
  update_active_file,
  update_indent,
  set_settings_tab,
  update_data_studio_active,
  update_env_vars,
  set_data_tool_tab,
  update_sidebar_active,
  update_bottom_panel_active,
  update_tools_data,
  update_tools_window_state,
  update_current_bottom_tab,
  update_output_history,
  update_settings,
  update_ui_state,
  update_ui,
} = mainSlice.actions;

export default mainSlice.reducer;
