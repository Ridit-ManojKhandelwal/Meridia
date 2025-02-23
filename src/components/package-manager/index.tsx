import { useState, useEffect } from "react";

import { SearchOutlined } from "@ant-design/icons/lib";

import PerfectScrollbar from "react-perfect-scrollbar";

import "./index.css";

export default function PackageManager() {
  const [packageName, setPackageName] = useState("");
  const [output, setOutput] = useState("");
  const [installedPackages, setInstalledPackages] = useState([]);
  const [pypiPackage, setPyPiPackage] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadInstalledPackages();
  }, []);

  const loadInstalledPackages = async () => {
    const packages = await window.electron.getInstalledPackages();
    setInstalledPackages(packages);
  };

  const handleInstall = async () => {
    if (!packageName) return;
    const result = await window.electron.installPackage(packageName);
    setOutput(result);
    setIsSearching(false);
    loadInstalledPackages();
  };

  const handleUninstall = async (pkgName: string) => {
    const result = await window.electron.uninstallPackage(pkgName);
    setOutput(result);
    loadInstalledPackages();
  };

  const handleSearchPyPi = async () => {
    if (!packageName) return;
    const result = await window.electron.searchPyPiPackages(packageName);
    setPyPiPackage(result);
    setIsSearching(true);
  };

  return (
    <div className="package-wrapper">
      <div className="props">
        <div className="section">
          <div className="prop">
            <input
              type="text"
              className="package-input"
              placeholder="Enter package name"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              onSubmit={handleSearchPyPi}
              onKeyUp={(e) => e.key === "Enter" && handleSearchPyPi()}
            />

            <button onClick={handleSearchPyPi}>
              <SearchOutlined />
            </button>
          </div>

          {isSearching && (
            <button className="package-button" onClick={handleInstall}>
              Install
            </button>
          )}
        </div>
      </div>

      <pre className="package-output">{output}</pre>

      <div className="props">
        <div className="package-content">
          <PerfectScrollbar>
            <div className="package-list-container">
              <h3 className="package-subtitle">Installed Packages</h3>
              <ul className="package-list">
                {installedPackages.map((pkg: any) => (
                  <li key={pkg.name} className="package-item">
                    <div className="info">
                      {pkg.name} ({pkg.version}){" "}
                    </div>
                    <button
                      className="package-remove-button"
                      onClick={() => handleUninstall(pkg.name)}
                    >
                      Uninstall
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </PerfectScrollbar>
        </div>

        <div className="package-info">
          {isSearching && (
            <div className="package-doc">
              <h3 className="package-subtitle">PyPI Package</h3>
              <p>
                <b>Name:</b> {pypiPackage.name || "pdnas"}
              </p>
              <p>
                <b>Version:</b> {pypiPackage.version || "pdnas"}
              </p>
              <p>
                <b>Summary:</b> {pypiPackage.summary || "pdnas"}
              </p>
              <p>
                <b>Documentation:</b> {pypiPackage.documentation || ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
