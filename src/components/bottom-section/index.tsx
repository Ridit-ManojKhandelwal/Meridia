import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  update_current_bottom_tab,
  update_terminal_active,
} from "../../shared/rdx-slice";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Tabs } from "../../meridiaui/index";
import Output from "../output-section";

import { Terminal } from "../terminal-section";
import { CloseOutlined } from "@ant-design/icons/lib";

export const BottomTabs = () => {
  const currentTab = useAppSelector((state) => state.main.current_bottom_tab);
  const dispatch = useAppDispatch();

  const historyRef: any = useRef({
    output: [],
    terminal: [],
    packageManager: [],
  });

  const updateHistory = (tab: any, data: any) => {
    historyRef.current[tab].push(data);
  };

  const tabInstances = {
    output: (
      <Output
        history={historyRef.current.output}
        updateHistory={updateHistory}
      />
    ),
    terminal: (
      <Terminal
        history={historyRef.current.terminal}
        updateHistory={updateHistory}
      />
    ),
  };

  const tabs = [
    {
      key: 1,
      name: "Output",
      content: tabInstances.output,
      closable: false,
      onTabClick: () => dispatch(update_current_bottom_tab(1)),
    },
    {
      key: 2,
      name: "Terminal",
      content: tabInstances.terminal,
      closable: false,
      onTabClick: () => dispatch(update_current_bottom_tab(2)),
    },
  ];

  return (
    <PerfectScrollbar>
      <div
        className="bottom-wrapper"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Tabs
          items={tabs}
          customButtons={[
            <button onClick={() => dispatch(update_terminal_active(false))}>
              <CloseOutlined />
            </button>,
          ]}
          customButtonsTooltip={["Hide"]}
          activeManualTab={currentTab}
        />
        <PerfectScrollbar>
          <div className="tab-content" style={{ flex: 1, overflow: "hidden" }}>
            {tabs.map((tab) =>
              tab.key === currentTab ? (
                <div key={tab.key}>{tab.content}</div>
              ) : null
            )}
          </div>
        </PerfectScrollbar>
      </div>
    </PerfectScrollbar>
  );
};
