interface HandleFileUploadProps {
  e: React.ChangeEvent<HTMLInputElement>;
  setFileData: (data: any) => void;
  setCurrentExcelStep: (step: number) => void;
  message: any;
}

export const handleFileUpload = ({
  e,
  setFileData,
  setCurrentExcelStep,
  message,
}: HandleFileUploadProps) => {
  const file = e.target.files?.[0];
  if (!file) {
    message.error("Please upload a valid file.");
    return;
  }

  // Check if the file is an Excel file
  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    message.error("Please upload a valid Excel file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = event.target?.result;
      if (!data) {
        throw new Error("Failed to read file data.");
      }

      // const workbook = XLSX.read(data, { type: "array" }); // Use 'array' for better compatibility
      // const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Use the first sheet by default
      // const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // setFileData(jsonData);
      setCurrentExcelStep(1); // Move to the Preview step after file is loaded
    } catch (error) {
      message.error(`Error reading the file: ${error.message}`);
    }
  };

  reader.onerror = (error) => {
    message.error(`File reading error: ${error}`);
  };

  reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer (modern method)
};
