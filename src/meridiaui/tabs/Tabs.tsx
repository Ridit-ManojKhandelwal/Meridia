import { useEffect, useState } from "react";

import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import "./tabs.css";
import Tooltip from "../tooltip/Tooltip";

interface Tab {
  name: string;
  key: number;
  closable: boolean;
  onTabClick?: Function;
}

interface TabProps {
  items?: Tab[];
  addTabButton?: boolean;
  addTabButtonText?: string;
  customButtons?: React.ReactNode[];
  customButtonsTooltip?: string[];
  defaultTabActive?: number;
  activeManualTab?: number;
}

export const Tabs = ({
  items = [],
  addTabButton = false,
  addTabButtonText = "",
  customButtons = [],
  customButtonsTooltip = [],
  defaultTabActive = 0,
  activeManualTab,
}: TabProps) => {
  const [tabs, setTabs] = useState(items);
  const [activeTab, setActiveTab] = useState(tabs.length > 1 ? 1 : 0);

  if (customButtonsTooltip.length > customButtons.length) {
    throw "Custom button tooltips is more than the buttons.";
  }

  const removeTab = (key: number) => {
    const newTabs = tabs.filter((tab) => tab.key !== key);

    setTabs(newTabs);
  };

  const addTab = () => {
    let newKey = tabs.length + 1;

    while (tabs.some((tab) => tab.key === newKey)) {
      newKey++;
    }

    const newTab: Tab = {
      name: `Tab ${newKey}`,
      key: newKey,
      closable: true,
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
  };

  return (
    <div id="anant-tab-theme-mode">
      <div className="anant-tabs-wrapper">
        <div className="anant-tabs">
          {tabs?.map((item) => (
            <Tooltip text={item.name}>
              <div
                key={item.key}
                className={`anant-tab ${activeTab === item.key && "anant-tab-active"} ${activeManualTab === item.key && "anant-tab-active"}`}
                onClick={() => {
                  setActiveTab(item.key);
                  item.onTabClick();
                }}
              >
                <span>{item.name}</span>
                {item.closable && (
                  <button
                    key={item.key}
                    className="anant-close-btn"
                    onClick={() => removeTab(item.key)}
                  >
                    <CloseOutlined />
                  </button>
                )}
              </div>
            </Tooltip>
          ))}
        </div>

        <div className="anant-tabs-buttons">
          {addTabButton && (
            <Tooltip text="Add Tab">
              <button className="anant-add-tab-btn" onClick={addTab}>
                {addTabButtonText === "" && <PlusOutlined />}
              </button>
            </Tooltip>
          )}

          {customButtons.length > 0 && (
            <div className="anant-custom-buttons">
              {customButtons.map((button, index) => (
                <div key={index} className="anant-custom-button">
                  <Tooltip text={customButtonsTooltip[index]}>{button}</Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
