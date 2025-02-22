import { useEffect, useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons/lib";
import { useAppSelector } from "../../shared/hooks";

import "./header.css";

export default function Header() {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    window.electron.getMenu().then((menu) => {
      setMenuItems(menu || []);
    });
  }, []);

  return (
    <div className="header-wrapper">
      <div className="props">
        <div className="project-info">
          <h1>
            {folder_structure?.root
              ? folder_structure.root.split(/[\\/]/).at(-1)
              : "main"}
          </h1>
        </div>
      </div>
      <div className="menu-wrapper">
          <div className="menu">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-item">
                {item.label}
                {/* {item.submenu && (
                //   <div className="submenu">
                //     {item.submenu.map((sub: any, subIndex: any) => (
                //       <div key={subIndex} className="submenu-item">
                //         {sub.label}
                //       </div>
                //     ))}
                //   </div>
                )} */}
              </div>
            ))}
          
        </div>
      </div>
      <div className="controls">
        <CaretRightOutlined />
      </div>
    </div>
  );
}
