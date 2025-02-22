import { useEffect, useState, useRef } from "react";

import { BarsOutlined, CaretRightOutlined } from "@ant-design/icons/lib";

import { useAppDispatch } from "../../../shared/hooks";
import { useAppSelector } from "../../../shared/hooks";

import { update_terminal_active } from "../../../shared/rdx-slice";
import { update_env_vars } from "../../../shared/rdx-slice";
import { update_current_bottom_tab } from "../../../shared/rdx-slice";

import "./header.css";

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const menuRef = useRef(null);

  const dispatch = useAppDispatch();
  const { active_file } = useAppSelector((state) => ({
    active_file: state.main.active_file,
  }));

  useEffect(() => {
    window.electron.getMenu().then((menu) => {
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
    const vars = await window.electron.get_variables(active_file.path);
    dispatch(update_terminal_active(true));
    dispatch(update_env_vars(vars));
    dispatch(update_current_bottom_tab(1));
    window.electron.run_code({
      path: active_file.path,
      script: "python",
    });
  };

  const handleMenuClick = (menuId: string) => {
    window.electron.ipcRenderer.send("menu-click", menuId);
  };

  window.electron.ipcRenderer.on("run-code-manual", () => {
    handleRun();
  });

  return (
    <div className="header-wrapper">
      <div className="props">
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
                          className={`submenu-item ${sub.type === "separator" && "separator"}`}
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
            <p>Anantam</p>
          </div>
        )}
      </div>
      <div className="controls">
        <button onClick={handleRun}>
          <CaretRightOutlined />
        </button>
      </div>
    </div>
  );
}
