import React, { useState } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";

import { DataTypesSection } from "./components/sections/datatypes-section";
import { ChooseStepSection } from "./components/sections/choose-step-section";
import { ViewDataSection } from "./components/sections/view-data-section";
import { ExcelSection } from "./components/data-type-section/excel-section";
import { CSVSection } from "./components/data-type-section/csv-section";
import { JSONSection } from "./components/data-type-section/json-section";
import { VarInfo } from "./components/sections/data-var-info-section";

import "./styling/style.css";

const DataStudio = () => {
  const [step, setStep] = useState<number>(2);
  const [fileData, setFileData] = useState<any[]>([]);
  const [sheetName, setSheetName] = useState<string>("");
  const [skipRows, setSkipRows] = useState<number>(0);
  const [dataType, setDataType] = useState<string>("");
  const [currentExcelSteps, setCurrentExcelSteps] = useState<number>(0);
  const [data, setData] = useState<any[]>();

  const handleOptionClick = (type: string) => {
    window.electron.ipcRenderer.send("coming-soon-dialog", []);
  };

  return (
    <PerfectScrollBar
      style={{
        zIndex: 100,
      }}
    >
      <div className="data-studio">
        {step === 0 && <ChooseStepSection setStep={setStep} />}
        {step === 1 && (
          <DataTypesSection handleOptionClick={handleOptionClick} />
        )}
        {step === 2 && (
          <ViewDataSection
            setStep={(number) => setStep(number)}
            setData={(data) => setData(data)}
          />
        )}

        {dataType === "Excel" && (
          <ExcelSection
            fileData={fileData}
            setSheetName={setSheetName}
            setSkipRows={setSkipRows}
            sheetName={sheetName}
            skipRows={skipRows}
            setFileData={setFileData}
            setCurrentExcelStep={setCurrentExcelSteps}
            currentExcelSteps={currentExcelSteps}
          />
        )}

        {dataType === "CSV" && <CSVSection />}
        {dataType === "JSON" && <JSONSection />}
        {dataType === "SQL" && (
          <div>
            <h3>SQL Data Import</h3>
          </div>
        )}
        {dataType === "PostgreSQL" && (
          <div>
            <h3>PostgreSQL Data Import</h3>
          </div>
        )}
        {dataType === "MySQL" && <h3>MySQL Data Import</h3>}
        {step === 3 && <VarInfo data={data} />}
      </div>
    </PerfectScrollBar>
  );
};

export default DataStudio;
