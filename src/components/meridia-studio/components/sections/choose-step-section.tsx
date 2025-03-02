import { ReactComponent as ExcelIcon } from "../../../../assets/svg/excel.svg";
import { ReactComponent as JSONIcon } from "../../../../assets/svg/json.svg";

interface chooseStepSectionProps {
  setStep: (step: number) => void;
}

export const ChooseStepSection = ({ setStep }: chooseStepSectionProps) => {
  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        overflow: "hidden",
        width: "90vw",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>Welcome to Meridia Studio</h1>
        <h2>Choose a option to continue.</h2>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        <div className="datatype" onClick={() => setStep(1)}>
          <div
            className="datatype-option"
            style={{
              background: "#C8E9D6",
            }}
          >
            <ExcelIcon />
          </div>
          <div className="datatype-option-text">Add Data</div>
        </div>
        <div className="datatype" onClick={() => setStep(2)}>
          <div
            className="datatype-option"
            style={{
              background: "#EEF5FB",
            }}
          >
            <JSONIcon />
          </div>
          <div className="datatype-option-text">View Data</div>
        </div>
      </div>
    </div>
  );
};
