import { useAppSelector, useAppDispatch } from "../../shared/hooks";
import { update_settings } from "../../shared/rdx-slice";
import { Select, InputNumber, Switch, Input, Typography, Divider } from "antd";
import { useState, useEffect } from "react";

const { Option } = Select;
const { Text, Title } = Typography;

const SettingsComponent = () => {
  const dispatch = useAppDispatch();
  const currentSettings = useAppSelector((state) => state.main.editorSettings);
  const [settings, setSettings]: any = useState(currentSettings);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.electron.set_settings(settings);
    dispatch(update_settings(settings));
  }, [settings, dispatch]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const groupedSettings = {
    "Editor Appearance": [
      "theme",
      "lineNumbers",
      "cursorBlinking",
      "fontSize",
      "fontFamily",
    ],
    "Editor Behavior": [
      "wordBasedSuggestions",
      "autoClosingBrackets",
      "acceptSuggestionOnEnter",
      "cursorSmoothCaretAnimation",
    ],
    Performance: ["renderWhitespace", "fontLigatures"],
    Advanced: [
      "suggestSelection",
      "bracketPairColorization",
      "minimap",
      "floatingPreview",
    ],
  };

  const settingOptions: Record<string, string[]> = {
    theme: ["oneDark", "vs-dark", "light"],
    cursorBlinking: ["blink", "smooth", "phase", "expand", "solid"],
    cursorSmoothCaretAnimation: ["on", "off"],
    wordBasedSuggestions: ["allDocuments", "currentDocument", "off"],
    lineNumbers: ["on", "off", "relative", "interval"],
    acceptSuggestionOnEnter: ["on", "smart", "off"],
    autoClosingBrackets: [
      "always",
      "languageDefined",
      "beforeWhitespace",
      "never",
    ],
    suggestSelection: ["first", "recentlyUsed", "recentlyUsedByPrefix"],
    bracketPairColorization: ["on", "off"],
    minimap: ["on", "off"],
    renderWhitespace: ["none", "boundary", "selection", "all"],
    fontLigatures: ["on", "off"],
    floatingPreview: ["on", "off"],
  };

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Input.Search
        placeholder="Search settings..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        style={{ marginBottom: 20, width: "100%" }}
      />
      {Object.entries(groupedSettings).map(([category, keys]) => {
        const filteredKeys = keys.filter((key) => key.includes(search));
        if (filteredKeys.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: 24 }}>
            <Title level={5}>{category}</Title>
            <Divider />
            {filteredKeys.map((key) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <Text strong>{key}</Text>
                {typeof settings[key] === "boolean" ? (
                  <Switch
                    checked={settings[key]}
                    onChange={(val) => handleChange(key, val)}
                    style={{ marginLeft: 10 }}
                  />
                ) : typeof settings[key] === "number" ? (
                  <InputNumber
                    value={settings[key]}
                    onChange={(val) => handleChange(key, val)}
                    style={{ marginLeft: 10 }}
                  />
                ) : typeof settings[key] === "string" && settingOptions[key] ? (
                  <Select
                    value={settings[key]}
                    onChange={(val) => handleChange(key, val)}
                    style={{ marginLeft: 10, width: 200 }}
                  >
                    {settingOptions[key].map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    value={settings[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={{ width: 200 }}
                  />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SettingsComponent;
