import { useEffect, useState, useRef, useCallback } from "react";

import { BarsOutlined, CaretRightOutlined } from "@ant-design/icons/lib";

import { useAppDispatch } from "../../../shared/hooks";
import { useAppSelector } from "../../../shared/hooks";

import Tooltip from "../../../../extensions/meridiaui/tooltip/Tooltip";

import { ReactComponent as PanelBottom } from "../../../assets/svg/layout-panel.svg";
import { ReactComponent as PanelBottomOff } from "../../../assets/svg/layout-panel-off.svg";

import { ReactComponent as PanelLeft } from "../../../assets/svg/layout-sidebar-left.svg";
import { ReactComponent as PanelLeftOff } from "../../../assets/svg/layout-sidebar-left-off.svg";

import { ReactComponent as Minimize } from "../../../assets/window-controls/minimize.svg";
import { ReactComponent as Maximize } from "../../../assets/window-controls/maximize.svg";
import { ReactComponent as Restore } from "../../../assets/window-controls/restore.svg";
import { ReactComponent as Close } from "../../../assets/window-controls/close.svg";

import {
  update_sidebar_active,
  update_bottom_panel_active,
} from "../../../shared/rdx-slice";
import { update_current_bottom_tab } from "../../../shared/rdx-slice";

import { debounce } from "lodash";

import Logo from "../../../assets/logo.png";

import "./header.css";

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [isMaximized, setIsMaximized] = useState<boolean | null>(true);

  const menuRef = useRef(null);
  const runRef = useRef<HTMLButtonElement>(null);

  const sidebar_active = useAppSelector((state) => state.main.sidebar_active);
  const bottom_panel_active = useAppSelector(
    (state) => state.main.bottom_panel_active
  );
  const current_bottom_tab = useAppSelector(
    (state) => state.main.current_bottom_tab
  );
  const dispatch = useAppDispatch();

  const folder_strucutre = useAppSelector(
    (state) => state.main.folder_structure
  );

  const { active_file } = useAppSelector((state) => ({
    active_file: state.main.active_file,
  }));

  useEffect(() => {
    window.electron.getMenu().then((menu: any) => {
      setMenuItems(menu || []);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
        setActiveSubmenu(null);
      }
    }

    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  const handleRun = async () => {
    dispatch(update_bottom_panel_active(true));
    dispatch(update_current_bottom_tab(1));
    window.electron.run_code({
      path: active_file.path,
      script: "python",
    });
  };

  useEffect(() => {
    if (active_file === undefined || active_file === null) {
      runRef.current.disabled = true;
    } else {
      runRef.current.disabled = false;
    }
  }, [runRef, active_file]);

  const handleMenuClick = (menuId: string) => {
    window.electron.ipcRenderer.send("menu-click", menuId);
  };

  window.electron.ipcRenderer.on("run-code-manual", () => {
    handleRun();
  });

  const toggleSidebar = useCallback(
    debounce(() => {
      dispatch(update_sidebar_active(!sidebar_active));
    }, 300),
    [sidebar_active]
  );

  const toggleBottomPanel = useCallback(
    debounce(({ state }: { state?: any }) => {
      if (state) {
        dispatch(update_bottom_panel_active(state));
      } else {
        dispatch(update_bottom_panel_active(!bottom_panel_active));
      }
    }, 300),
    [bottom_panel_active]
  );

  useEffect(() => {
    const openTerminal = () => {
      if (bottom_panel_active === true && current_bottom_tab === 2) {
        toggleBottomPanel({ state: false });
      } else {
        toggleBottomPanel({ state: true });
        dispatch(update_current_bottom_tab(2));
      }
    };

    window.electron.ipcRenderer.on("open-terminal", openTerminal);

    return () => {
      window.electron.ipcRenderer.removeListener("open-terminal", openTerminal);
    };
  }, [dispatch]);

  useEffect(() => {
    const openOutput = () => {
      if (bottom_panel_active && current_bottom_tab === 1) {
        toggleBottomPanel({ state: false });
      } else {
        toggleBottomPanel({ state: true });
        dispatch(update_current_bottom_tab(1));
      }
    };

    window.electron.ipcRenderer.on("open-output", openOutput);

    return () => {
      window.electron.ipcRenderer.removeListener("open-output", openOutput);
    };
  }, [dispatch]);

  useEffect(() => {
    window.electron.ipcRenderer.on("open-bottom-panel", () => {
      dispatch(update_bottom_panel_active(bottom_panel_active ? false : true));
    });

    return () =>
      window.electron.ipcRenderer.removeListener(
        "open-bottom-panel",
        update_bottom_panel_active
      );
  });

  useEffect(() => {
    window.electron.ipcRenderer.on("open-sidebar", () => {
      toggleSidebar();
    });

    return () =>
      window.electron.ipcRenderer.removeListener("open-sidebar", toggleSidebar);
  });

  useEffect(() => {
    window.electron.ipcRenderer.on("window-changed-to-maximized", () => {
      setIsMaximized(true);
    });

    window.electron.ipcRenderer.on("window-changed-to-restore", () => {
      setIsMaximized(false);
    });

    return () => {
      window.electron.ipcRenderer.removeListener(
        "window-changed-to-maximized",
        setIsMaximized
      );
      window.electron.ipcRenderer.removeListener(
        "window-changed-to-restore",
        setIsMaximized
      );
    };
  }, []);

  const handleWindowAction = (action: string) => {
    window.electron.ipcRenderer.invoke(action, "");
  };

  return (
    <div className="header-wrapper">
      <div className="props">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <button onClick={() => setMenuVisible((prev) => !prev)}>
          <BarsOutlined />
        </button>
        {menuVisible ? (
          <div className="menu-wrapper" ref={menuRef}>
            <div className="menu">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onMouseEnter={() => setActiveSubmenu(index)}
                  onClick={() => {
                    setActiveSubmenu((prev) => (prev === index ? null : index));
                    handleMenuClick(item.id);
                  }}
                >
                  <div className="menu-item-text">
                    {item.label}
                    {item.accelerator && (
                      <span className="shortcut">{item.accelerator}</span>
                    )}
                  </div>
                  {item.submenu && activeSubmenu === index && (
                    <div className="submenu">
                      {item.submenu.map((sub: any, subIndex: any) => (
                        <div
                          key={subIndex}
                          className={` ${sub.type === "separator" ? "separator" : "submenu-item"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(sub.id);
                            setActiveSubmenu(-1);
                          }}
                        >
                          {sub.label}
                          {sub.accelerator && (
                            <span className="shortcut">{sub.accelerator}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="project-info">
            {folder_strucutre?.name?.split(/[/\\]/).at(-1) ||
              "No Project Selected"}
          </div>
        )}
      </div>

      <div className="controls">
        <Tooltip text="Run ( F12 )">
          <button onClick={handleRun} ref={runRef} className="run-tool">
            <CaretRightOutlined />
          </button>
        </Tooltip>

        <button onClick={() => toggleBottomPanel({ state: null })}>
          {bottom_panel_active ? (
            <Tooltip text="Toggle Panel ( Ctrl + ` )">
              <PanelBottom />
            </Tooltip>
          ) : (
            <Tooltip text="Toggle Panel ( Ctrl + ` )">
              <PanelBottomOff />
            </Tooltip>
          )}
        </button>

        <button onClick={toggleSidebar}>
          {sidebar_active ? (
            <Tooltip text="Toggle Primary Sidebar ( Ctrl + B )">
              <PanelLeft />
            </Tooltip>
          ) : (
            <Tooltip text="Toggle Primary Sidebar ( Ctrl + B )">
              <PanelLeftOff />
            </Tooltip>
          )}
        </button>

        <div className="window-controls">
          <button onClick={() => handleWindowAction("minimize")}>
            <Minimize />
          </button>
          <button
            onClick={() =>
              handleWindowAction(isMaximized ? "restore" : "maximize")
            }
          >
            {isMaximized ? <Restore /> : <Maximize />}
          </button>
          <button onClick={() => handleWindowAction("close")}>
            <Close />
          </button>
        </div>
      </div>
    </div>
  );
}
