/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ERenderer } from "./preload";

declare global {
  interface Window {
    electron: ERenderer;
    set_folder_data: Function;
  }

  declare module "*.svg" {
    import React from "react";
    import { SVGProps } from "react";
    export const ReactComponent: React.FunctionComponent<
      SVGProps<SVGSVGElement>
    >;
  }
  declare module "*.py" {
    const content: string;
    export default content;
  }
}
