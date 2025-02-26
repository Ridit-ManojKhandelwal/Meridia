import React, { useEffect, useState } from "react";
import { Splitter } from "antd";

import FooterComponent from "./sections/footer/";
import ContentSection from "./sections/content/";
import { BottomTabs } from "./bottom-section";

import Header from "./sections/header/";
import AnantChat from "../../apps/meridiachat";

import { ReactComponent as StudioIcon } from "../assets/svg/remote.svg";

import PerfectScrollbar from "react-perfect-scrollbar";

import { useAppDispatch, useAppSelector } from "../shared/hooks";
import {
  update_active_file,
  update_active_files,
  update_sidebar_active,
} from "../shared/rdx-slice";
import { store } from "../shared/store";

import {
  BarChartOutlined,
  FolderOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import Navigator from "./sidebar-sections/navigator";

import Tooltip from "../../extensions/meridiaui/tooltip/Tooltip";

import "./index.css";

export const App = () => {
  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const bottomPanelActive = useAppSelector(
    (state) => state.main.bottom_panel_active
  );
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
      icon: <SettingOutlined />,
    },
  ];

  const openSettings = () => {
    console.log("opening settings");

    const settingsFile = {
      path: "/settings",
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
    } else {
      dispatch(update_active_file(settingsFile));
      return;
    }

    dispatch(update_active_files(current_active_files));
    dispatch(update_active_file(settingsFile));
  };

  const openMeridiaStudio = () => {
    const meridiaStudioFile = {
      path: "/studio",
      name: "Studio",
      icon: "Studio",
      is_touched: false,
    };

    const current_active_files = [...store.getState().main.active_files];

    const studioIndex = current_active_files.findIndex(
      (file) => file.name === "Studio"
    );

    if (studioIndex === -1) {
      current_active_files.push(meridiaStudioFile);
    } else {
      dispatch(update_active_file(meridiaStudioFile));
      return;
    }

    dispatch(update_active_files(current_active_files));
    dispatch(update_active_file(meridiaStudioFile));
  };

  useEffect(() => {
    window.electron.ipcRenderer.on("open-settings", () => {
      openSettings();
    });
    return () =>
      window.electron.ipcRenderer.removeListener("open-settings", openSettings);
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on("open-meridia-studio", () => {
      openMeridiaStudio();
    });
    return () =>
      window.electron.ipcRenderer.removeListener(
        "open-meridia-studio",
        openMeridiaStudio
      );
  }, []);

  return (
    <div
      className="wrapper-component"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid var(--border-color)",
        overflow: "hidden",
      }}
    >
      <Header />
      <div className="middle-section" style={{ flex: 1, display: "flex" }}>
        <div
          className="sidebar"
          style={{
            background: "#363636",
          }}
        >
          <div className="top">
            <Tooltip text="Navigator" position="right">
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
            </Tooltip>
          </div>

          <div className="bottom">
            <Tooltip text="MStudio (Ctrl+Shift+B)" position="right">
              <div
                key={2}
                className={`sidebar-item ${activeItem === 2 ? "active" : ""}`}
                onClick={() => {
                  openMeridiaStudio();
                }}
              >
                <StudioIcon />
              </div>
            </Tooltip>
            <Tooltip text="Settings (Ctrl+,)" position="right">
              <div
                key={1}
                className={`sidebar-item ${activeItem === 1 ? "active" : ""}`}
                onClick={() => {
                  openSettings();
                }}
              >
                <SettingOutlined />
              </div>
            </Tooltip>
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
                      borderRight: sidebarActive
                        ? "1px solid var(--main-border-color)"
                        : "none",
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

              <Splitter.Panel
                defaultSize="30%"
                size={bottomPanelActive ? undefined : "0%"}
                min="10%"
                max="90%"
                collapsible
                className="terminal"
                style={{
                  borderTop: "1px solid var(--main-border-color)",
                }}
              >
                <BottomTabs />
              </Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </div>
      <FooterComponent />
    </div>
  );
};
