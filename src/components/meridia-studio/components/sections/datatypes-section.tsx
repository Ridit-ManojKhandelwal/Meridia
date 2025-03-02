import { ReactComponent as ExcelIcon } from "../../../../assets/svg/excel.svg";
import { ReactComponent as CSVIcon } from "../../../../assets/svg/csv.svg";
import { ReactComponent as SQLIcon } from "../../../..//assets/svg/sql.svg";
import { ReactComponent as PostGreSQLIcon } from "../../../../assets/svg/postgresql.svg";
import { ReactComponent as MySQLIcon } from "../../../../assets/svg/mysql.svg";
import { ReactComponent as JSONIcon } from "../../../../assets/svg/json.svg";

interface dataTypesSectionProps {
  handleOptionClick: (dataType: string) => void;
}

export const DataTypesSection = ({
  handleOptionClick,
}: dataTypesSectionProps) => {
  return (
    <div className="option-grid">
      <div className="heading-area">
        <h1>Choose data file type.</h1>
      </div>
      <div
        className="option-area"
        style={{
          display: "flex",
        }}
      >
        <div className="datatype" onClick={() => handleOptionClick("Excel")}>
          <div
            className="datatype-option"
            style={{
              background: "#C8E9D6",
            }}
          >
            <ExcelIcon />
          </div>
          <div className="datatype-option-text">Import data from Excel</div>
        </div>
        <div className="datatype" onClick={() => handleOptionClick("CSV")}>
          <div
            className="datatype-option"
            style={{
              background: "#EEF5FB",
            }}
          >
            <CSVIcon />
          </div>
          <div className="datatype-option-text">Import data from CSV</div>
        </div>
        <div className="datatype" onClick={() => handleOptionClick("JSON")}>
          <div
            className="datatype-option"
            style={{
              background: "#EEF5FB",
            }}
          >
            <JSONIcon />
          </div>
          <div className="datatype-option-text">Import data from JSON</div>
        </div>
        <div className="datatype" onClick={() => handleOptionClick("SQL")}>
          <div
            className="datatype-option"
            style={{
              background: "#FCFCF4",
            }}
          >
            <SQLIcon />
          </div>
          <div className="datatype-option-text">Import data from SQL</div>
        </div>
        <div
          className="datatype"
          onClick={() => handleOptionClick("PostgreSQL")}
        >
          <div
            className="datatype-option"
            style={{
              background: "#EEF5FB",
            }}
          >
            <PostGreSQLIcon />
          </div>
          <div className="datatype-option-text">
            Import data from PostgreSQL
          </div>
        </div>
        <div className="datatype" onClick={() => handleOptionClick("MySQL")}>
          <div
            className="datatype-option"
            style={{
              background: "#FCFCF4",
            }}
          >
            <MySQLIcon />
          </div>
          <div className="datatype-option-text">Import data from MySQL</div>
        </div>
      </div>
    </div>
  );
};
