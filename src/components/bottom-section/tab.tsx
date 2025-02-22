import { useState } from "react";
import { Tools } from "../tools";
import { Terminal } from "../terminal-section/terminal";

import PerfectScrollbar from "react-perfect-scrollbar";
import { ExportOutlined, ImportOutlined } from "@ant-design/icons/lib";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  update_current_bottom_tab,
  update_tools_window_state,
} from "../../shared/rdx-slice";
import { Tabs } from "../../anantui/index";
import Output from "../output-section/output";

export const BottomTabs = () => {
  const currentTab = useAppSelector((state) => state.main.current_bottom_tab);
  const dispatch = useAppDispatch();

  const tabs = [
    // {
    //   key: 0,
    //   name: "Tools",
    //   content: <Tools />,
    //   closable: false,
    //   onTabClick: () => dispatch(update_current_bottom_tab(0)),
    // },
    {
      key: 1,
      name: "Output",
      content: <Output />,
      closable: false,
      onTabClick: () => dispatch(update_current_bottom_tab(1)),
    },
    {
      key: 2,
      name: "Terminal",
      content: <Terminal />,
      closable: false,
      onTabClick: () => dispatch(update_current_bottom_tab(2)),
    },
  ];
  const tools_in_a_window = useAppSelector(
    (state) => state.main.tools_in_a_window
  );

  return (
    <PerfectScrollbar>
      <div className="bottom-wrapper">
        <Tabs
          items={tabs}
          customButtons={
            currentTab === 0 && [
              <button
                onClick={() =>
                  dispatch(
                    update_tools_window_state(tools_in_a_window ? false : true)
                  )
                }
              >
                {tools_in_a_window ? <ImportOutlined /> : <ExportOutlined />}
              </button>,
            ]
          }
          customButtonsTooltip={currentTab === 0 && ["Open In a New Window"]}
          defaultTabActive={currentTab}
        />
        <div className="tab-content">
          {tabs.map((tab) => tab.key === currentTab && tab.content)}
        </div>
      </div>
    </PerfectScrollbar>
  );
};
