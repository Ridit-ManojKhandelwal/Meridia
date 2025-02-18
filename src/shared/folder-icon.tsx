/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { ReactComponent as Default } from "../assets/icons/default_folder.svg";
import { ReactComponent as DefaultOpen } from "../assets/icons/default_folder_opened.svg";
import { ReactComponent as VsCode } from "../assets/icons/folder_type_vscode.svg";
import { ReactComponent as VsCodeOpen } from "../assets/icons/folder_type_vscode_opened.svg";
import { ReactComponent as Src } from "../assets/icons/folder_type_src.svg";
import { ReactComponent as SrcOpen } from "../assets/icons/folder_type_src_opened.svg";

interface FolderIconProps {
  name: string;
  expanded: boolean;
}

const FolderIcon: React.FC<FolderIconProps> = ({ name, expanded }) => {
  const types: any = {
    vscode: <VsCode />,
    src: <Src />,
    unknown: <Default />,
  };

  const openTypes: any = {
    vscode: <VsCodeOpen />,
    src: <SrcOpen />,
    unknown: <DefaultOpen />,
  };

  return expanded
    ? openTypes[name] || openTypes["unknown"]
    : types[name] || types["unknown"];
};

export default FolderIcon;
