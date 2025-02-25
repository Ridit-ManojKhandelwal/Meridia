import React, { useEffect, useState } from "react";
import { Splitter } from "antd";

import FooterComponent from "./sections/footer/";
import ContentSection from "./sections/content/";
import { BottomTabs } from "./bottom-section";

import Header from "./sections/header/";
import AnantChat from "../meridiachat";

import PerfectScrollbar from "react-perfect-scrollbar";

import { useAppDispatch, useAppSelector } from "../shared/hooks";
import {
  update_active_file,
  update_active_files,
  update_sidebar_active,
} from "../shared/rdx-slice";
import { store } from "../shared/store";

import { FolderOutlined, SettingOutlined } from "@ant-design/icons";

import Navigator from "./sidebar-sections/navigator";

import { ReactComponent as ExtensionIcon } from "../assets/svg/extensions.svg";

import "./index.css";

export const App = () => {
  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const terminalActive = useAppSelector((state) => state.main.terminal_active);
  const active_files = useAppSelector((state) => state.main.active_files);

  const [activeItem, setActiveItem] = useState(0);

  const dispatch = useAppDispatch();

  const items = [
    {
      key: 0,
      icon: <FolderOutlined />,
      content: <Navigator />,
    },
    {
      key: 1,
      icon: <ExtensionIcon />,
      // content: <PluginManager />,
    },
    {
      key: 2,
      icon: <SettingOutlined />,
    },
  ];

  const openSettings = () => {
    console.log("opening settings");

    const settingsFile = {
      path: "",
      name: "Settings",
      icon: "settings",
      is_touched: false,
    };

    const current_active_files = [...store.getState().main.active_files];

    const settingsIndex = current_active_files.findIndex(
      (file) => file.name === "Settings"
    );

    if (settingsIndex === -1) {
      current_active_files.push(settingsFile);
    }

    dispatch(update_active_files(current_active_files));
    dispatch(update_active_file(settingsFile));
  };

  useEffect(() => {
    window.electron.ipcRenderer.on("open-settings", () => {
      openSettings();
    });
    return () =>
      window.electron.ipcRenderer.removeListener("open-settings", openSettings);
  }, []);

  return (
    <div
      className="wrapper-component"
      style={{
        height: "99vh",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid var(--border-color)",
        overflow: "hidden",
      }}
    >
      <Header />
      <div className="middle-section" style={{ flex: 1, display: "flex" }}>
        <div className="sidebar">
          <div className="top">
            <div
              key={0}
              className={`sidebar-item ${activeItem === 0 ? "active" : ""}`}
              onClick={() => {
                setActiveItem(activeItem === 0 ? -1 : 0);
                dispatch(update_sidebar_active(activeItem !== 0));
              }}
            >
              <FolderOutlined />
            </div>
            <div
              key={0}
              className={`sidebar-item ${activeItem === 1 ? "active" : ""}`}
              onClick={() => {
                setActiveItem(activeItem === 1 ? -1 : 1);
                dispatch(update_sidebar_active(activeItem !== 1));
              }}
            >
              <ExtensionIcon />
            </div>
          </div>

          <div
            key={1}
            className={`sidebar-item ${activeItem === 2 ? "active" : ""}`}
            onClick={() => {
              // setActiveItem(activeItem === 1 ? -1 : 1);
              // dispatch(update_sidebar_active(activeItem !== 1));
              openSettings();
            }}
          >
            <SettingOutlined />
          </div>
        </div>

        <Splitter
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Splitter.Panel>
            <Splitter layout="vertical">
              <Splitter.Panel>
                <Splitter layout="horizontal">
                  <Splitter.Panel
                    defaultSize="20%"
                    size={sidebarActive ? undefined : "0%"}
                    collapsible
                    max="90%"
                    style={{
                      borderRight: sidebarActive ? "1px solid #4a4a4a" : "none",
                      height: "100%",
                    }}
                  >
                    <PerfectScrollbar>
                      <div>
                        {items.find((item) => item.key === activeItem)?.content}
                      </div>
                    </PerfectScrollbar>
                  </Splitter.Panel>
                  <Splitter.Panel>
                    <ContentSection />
                  </Splitter.Panel>
                </Splitter>
              </Splitter.Panel>

              {terminalActive && (
                <Splitter.Panel
                  defaultSize="30%"
                  min="10%"
                  max="90%"
                  className="terminal"
                  style={{
                    borderTop: "1px solid #4a4a4a",
                  }}
                >
                  <BottomTabs />
                </Splitter.Panel>
              )}
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </div>
      <FooterComponent />
    </div>
  );
};
