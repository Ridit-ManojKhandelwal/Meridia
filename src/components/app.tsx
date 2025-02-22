import { Splitter } from "antd";

import FooterComponent from "./sections/footer";
import ContentSection from "./sections/content";

import { BottomTabs } from "./bottom-section/tab";

import Navigator from "./sidebar-sections/navigator";
import Enviornment from "./sidebar-sections/enviornment";

import AnantChat from "../anantchat";

import { useAppSelector } from "../shared/hooks";
import Header from "./sections/header";

export const App = () => {
  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const terminalActive = useAppSelector((state) => state.main.terminal_active);

  return (
    <div
      className="wrapper-component"
      style={{
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <Header />
      <FooterComponent />
      <div className="middle-section" style={{ flex: 1, display: "flex" }}>
        <Splitter
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {sidebarActive ? (
            <Splitter.Panel defaultSize="20%" min="10%" max="95%">
              <Splitter
                layout="vertical"
                style={{
                  height: "100vh",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  borderRight: "1px solid #181a1fff",
                }}
              >
                <Splitter.Panel>
                  <Navigator />
                </Splitter.Panel>

                <Splitter.Panel>
                  <Enviornment />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
          ) : null}

          <Splitter.Panel>
            <Splitter layout="vertical">
              <Splitter.Panel>
                <Splitter layout="horizontal">
                  <Splitter.Panel>
                    <ContentSection />
                    <div id="#editor"></div>
                  </Splitter.Panel>

                  {/* Right Side - New Panel */}
                  {/* <Splitter.Panel
                    defaultSize="25%"
                    min="10%"
                    max="50%"
                    style={{
                      borderLeft: "1px solid var(--border-color)",
                    }}
                  >
                    <AnantChat />
                  </Splitter.Panel> */}
                </Splitter>
              </Splitter.Panel>

              {/* Terminal at the Bottom */}
              {terminalActive && (
                <Splitter.Panel
                  defaultSize="30%"
                  min="10%"
                  max="50%"
                  className="terminal"
                  style={{
                    borderTop: "1px solid #181a1fff",
                  }}
                >
                  <BottomTabs />
                </Splitter.Panel>
              )}
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};
