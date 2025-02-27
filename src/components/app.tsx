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
  update_ui_state,
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

const iconMap: Record<string, JSX.Element> = {
  Navigator: <FolderOutlined />,
  Settings: <SettingOutlined />,
  "Meridia Studio": <StudioIcon />,
};

export const App = () => {
  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const bottomPanelActive = useAppSelector(
    (state) => state.main.bottom_panel_active
  );

  const ui = useAppSelector((state) => state.main.ui);

  const [activeItem, setActiveItem] = useState("Navigator");

  const dispatch = useAppDispatch();

  const items = [
    {
      name: "Navigator",
      key: 0,
      icon: <FolderOutlined />,
      content: <Navigator />,
    },
  ];

  const openSettings = () => {
    console.log("opening settings");

    const settingsFile = {
      path: "/settings",
      name: "Settings",
      icon: "settings",
      is_touched: false,
      content: "",
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
      content: "",
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

  // useEffect(() => {
  //   const newState = {
  //     active_file,
  //     active_files,
  //     bottom_panel_active,
  //     sidebar_active,
  //     current_bottom_tab,
  //   };

  //   dispatch(update_ui_state(newState));
  //   console.log("state", newState);
  //   window.electron.set_ui_state(newState);
  // }, [
  //   active_files,
  //   sidebar_active,
  //   bottom_panel_active,
  //   // active_file.path,
  //   current_bottom_tab,
  // ]);

  async function getUi() {
    console.log("ui", await window.electron.get_ui());
  }

  getUi();

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
        <div className="sidebar" style={{ background: "#363636" }}>
          <div className="top">
            {ui.sidebar
              .filter((item) => item.position === "top")
              .map((item, index) => (
                <Tooltip
                  key={index}
                  text={item.tooltip + " (" + item.shortcut + ")"}
                  position="right"
                >
                  <div
                    className={`sidebar-item ${activeItem === item.name ? "active" : ""}`}
                    onClick={() => {
                      if (item.content === "settings") {
                        openSettings();
                      }
                      if (item.content === "mstudio") {
                        openMeridiaStudio();
                      }
                      if (item.content === "content") {
                        setActiveItem(
                          activeItem === item.name ? null : item.name
                        );
                        dispatch(
                          update_sidebar_active(
                            activeItem === item.name ? false : true
                          )
                        );
                      }
                    }}
                  >
                    {iconMap[item.name] || <FolderOutlined />}
                  </div>
                </Tooltip>
              ))}
          </div>

          <div className="bottom">
            {ui.sidebar
              .filter((item) => item.position === "bottom")
              .map((item, index) => (
                <Tooltip
                  key={index}
                  text={item.tooltip + " (" + item.shortcut + ")"}
                  position="right"
                >
                  <div
                    className={`sidebar-item ${activeItem === item.name ? "active" : ""}`}
                    onClick={() => {
                      if (item.content === "settings") {
                        openSettings();
                      }
                      if (item.content === "mstudio") {
                        openMeridiaStudio();
                      }
                      if (item.content === "content") {
                        setActiveItem(
                          activeItem === item.name ? null : item.name
                        );
                        dispatch(
                          update_sidebar_active(
                            activeItem === item.name ? false : true
                          )
                        );
                      }
                    }}
                  >
                    {iconMap[item.name] || <FolderOutlined />}
                  </div>
                </Tooltip>
              ))}
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
                        {
                          items.find((item) => item.name === activeItem)
                            ?.content
                        }
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
