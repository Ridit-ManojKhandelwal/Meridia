import { useState, useEffect } from "react";

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
    <div className="package-manager">
      <div className="package-container">
        <div className="package-input-container">
          <input
            type="text"
            className="package-input"
            placeholder="Enter package name"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />

          <button className="package-button" onClick={handleSearchPyPi}>
            Search PyPI
          </button>
        </div>

        <pre className="package-output">{output}</pre>

        <div className="package-content">
          {isSearching ? (
            pypiPackage && (
              <div className="package-doc">
                <button className="package-button" onClick={handleInstall}>
                  Install
                </button>
                <h3 className="package-subtitle">PyPI Package</h3>
                <p>
                  <b>Name:</b> {pypiPackage.name}
                </p>
                <p>
                  <b>Version:</b> {pypiPackage.version}
                </p>
                <p>
                  <b>Summary:</b> {pypiPackage.summary}
                </p>
                <p>
                  <b>Documentation:</b> {pypiPackage.documentation || ""}
                </p>
              </div>
            )
          ) : (
            <div className="package-list-container">
              <h3 className="package-subtitle">Installed Packages</h3>
              <ul className="package-list">
                {installedPackages.map((pkg: any) => (
                  <li key={pkg.name} className="package-item">
                    {pkg.name} ({pkg.version}){" "}
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
          )}
        </div>
      </div>
    </div>
  );
}
