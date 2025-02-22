import { useState } from "react";
import { Tools } from "../tools";
import { Terminal } from "../terminal-section";

import PerfectScrollbar from "react-perfect-scrollbar";
import { ExportOutlined, ImportOutlined } from "@ant-design/icons/lib";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  update_current_bottom_tab,
  update_tools_window_state,
} from "../../shared/rdx-slice";
import { Tabs } from "../../anantui/index";
import Output from "../output-section";
import PackageManager from "../package-manager";

export const BottomTabs = () => {
  const currentTab = useAppSelector((state) => state.main.current_bottom_tab);
  const dispatch = useAppDispatch();

  const tabs = [
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
    {
      key: 3,
      name: "Python Packages",
      content: <PackageManager />,
      closable: false,
      onTabClick: () => dispatch(update_current_bottom_tab(3)),
    },
  ];
  // const tools_in_a_window = useAppSelector(
  //   (state) => state.main.tools_in_a_window
  // );

  return (
    <PerfectScrollbar>
      <div className="bottom-wrapper">
        <Tabs items={tabs} />
        <div className="tab-content">
          {tabs.map((tab) => tab.key === currentTab && tab.content)}
        </div>
      </div>
    </PerfectScrollbar>
  );
};
