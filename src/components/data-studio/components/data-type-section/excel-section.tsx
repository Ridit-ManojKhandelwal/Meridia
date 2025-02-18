import { Button, message, Steps, Table, Input } from "antd";
import { handleFileUpload } from "../../backend/functions";

interface ExcelSectionProps {
  fileData: any[];
  sheetName: string;
  setSheetName: (sheet: string) => void;
  skipRows: number;
  setSkipRows: (rows: number) => void;
  setFileData: (data: any) => void;
  setCurrentExcelStep: (step: number) => void;
  currentExcelSteps: number;
}

const columns = [
  {
    title: "Column Name",
    dataIndex: "columnName", // Adjust this based on your data
    key: "columnName",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

export const ExcelSection = ({
  fileData,
  sheetName,
  setSheetName,
  setSkipRows,
  skipRows,
  setFileData,
  setCurrentExcelStep,
  currentExcelSteps,
}: ExcelSectionProps) => {
  const excelSteps = [
    {
      title: "Import",
      content: (
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) =>
              handleFileUpload({ e, setFileData, setCurrentExcelStep, message })
            }
            title="Upload Excel File"
          />
        </div>
      ),
    },
    {
      title: "Preview",
      content: (
        <div>
          {fileData ? (
            <Table
              dataSource={fileData}
              columns={columns}
              rowKey={(record) => record.id || Math.random()}
            />
          ) : (
            <p>No data to preview. Please upload a file first.</p>
          )}
        </div>
      ),
    },
    {
      title: "Settings",
      content: (
        <div>
          <div>
            <Input
              placeholder="Sheet Name"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          </div>
          <div>
            <Input
              placeholder="Skip Rows"
              value={skipRows}
              onChange={(e: any) => setSkipRows(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div
      className="excel-section-content"
      style={{
        overflow: "visible",
        height: "fit-content",
        width: "90vw",
      }}
    >
      <Steps
        current={currentExcelSteps}
        items={excelSteps}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%" /* Full viewport height */,
          top: 0,
          left: 0 /* Align with the left edge */,
        }}
      />
      <div>{excelSteps[currentExcelSteps].content}</div>
      <div style={{ marginTop: 24 }}>
        {currentExcelSteps < excelSteps.length - 1 && (
          <Button
            type="primary"
            onClick={() => setCurrentExcelStep(currentExcelSteps + 1)}
            className="datatype-next-button"
          >
            Next
          </Button>
        )}
        {currentExcelSteps === excelSteps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {currentExcelSteps > 0 && (
          <Button
            onClick={() => setCurrentExcelStep(currentExcelSteps - 1)}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              margin: "16px",
            }}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};
