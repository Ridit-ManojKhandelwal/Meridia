/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ReactComponent as GitFileIcon } from "../assets/svg/git.svg";
import { ReactComponent as HTMLFileIcon } from "../assets/svg/html.svg";
import { ReactComponent as CSSFileIcon } from "../assets/svg/css.svg";
import { ReactComponent as JSFileIcon } from "../assets/svg/javascript.svg";
import { ReactComponent as JSONFileIcon } from "../assets/svg/json.svg";
import { ReactComponent as MarkdownFileIcon } from "../assets/svg/markdown.svg";
import { ReactComponent as TSFileIcon } from "../assets/svg/ts-1.svg";
import { ReactComponent as TTFFileIcon } from "../assets/svg/ttf.svg";
import { ReactComponent as SVGFileIcon } from "../assets/svg/svg.svg";
import { ReactComponent as PythonFileIcon } from "../assets/svg/py.svg";
import { ReactComponent as UnknownFileIcon } from "../assets/svg/unknown.svg";
import { ReactComponent as ExcelFileIcon } from "../assets/svg/excel.svg";
import { ReactComponent as CSVFileIcon } from "../assets/svg/csv.svg";
import { ReactComponent as SettingsIcon } from "../assets/svg/settings.svg";
import { ReactComponent as StudioIcon } from "../assets/svg/remote.svg";

const FileIcon = ({ type }: { type: string }) => {
  const typeIcon = {
    gitignore: GitFileIcon,
    html: HTMLFileIcon,
    css: CSSFileIcon,
    js: JSFileIcon,
    jsx: JSFileIcon,
    json: JSONFileIcon,
    md: MarkdownFileIcon,
    ts: TSFileIcon,
    tsx: TSFileIcon,
    ttf: TTFFileIcon,
    svg: SVGFileIcon,
    py: PythonFileIcon,
    unknown: UnknownFileIcon,
    excel: ExcelFileIcon,
    csv: CSVFileIcon,
    settings: SettingsIcon,
    Studio: StudioIcon,
  };

  const IconComponent =
    typeIcon[type as keyof typeof typeIcon] || typeIcon["unknown"];
  return <IconComponent />;
};

export default FileIcon;
