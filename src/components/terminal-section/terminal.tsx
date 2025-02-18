import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "@xterm/xterm/css/xterm.css";

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    const term = new XTerminal({
      cursorBlink: true,
      fontFamily: "Ubuntu Mono, monospace",
      fontSize: 16,
      letterSpacing: 1.1,
      lineHeight: 1.4,
      theme: {
        background: "#21252bff",
        foreground: "#cdd6f4",
        cursor: "#f38ba8",
        black: "#45475a",
        red: "#f38ba8",
        green: "#a6e3a1",
        yellow: "#f9e2af",
        blue: "#89b4fa",
        magenta: "#cba6f7",
        cyan: "#94e2d5",
        white: "#bac2de",
      },
    });

    const fit = new FitAddon();
    fitAddon.current = fit;
    term.loadAddon(fit);

    term.open(terminalRef.current);
    term.write("Anantam builtin terminal >>");

    terminalInstance.current = term;

    const handleIncomingData = (_event: any, data: string) => {
      term.write(data);
    };

    window.electron.ipcRenderer.on("terminal.incomingData", handleIncomingData);

    term.onData((data) => {
      window.electron.ipcRenderer.send("terminal.keystroke", data);
    });

    return () => {
      term.dispose();

      window.electron.ipcRenderer.removeListener(
        "terminal.incomingData",
        handleIncomingData,
      );
      terminalInstance.current = null;
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={terminalRef} className="terminal" />
    </div>
  );
};
