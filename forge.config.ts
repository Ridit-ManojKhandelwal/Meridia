import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: "**/node_modules/node-pty/build/Release/*",
    },
    name: "Meridia",
    executableName: "Meridia",
    icon: "./src/assets/icon.ico",
  },

  makers: [
    new MakerZIP({}, ["linux", "win32"]), // ZIP archive
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}), // Handles native modules like node-pty
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./main/html/index.html",
            js: "./main/renderer/renderer.ts",
            name: "main_window",
            preload: {
              js: "./main/preload.ts",
            },
          },
          {
            html: "./main/html/toolsWindow.html",
            js: "./main/renderer/toolsRenderer.ts",
            name: "tools_window",
            preload: {
              js: "./main/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
