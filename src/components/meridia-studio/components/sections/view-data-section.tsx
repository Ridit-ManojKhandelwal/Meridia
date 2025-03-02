import { useState } from "react";
import { useEffect } from "react";
import { ReactComponent as SearchIcon } from "../../../../assets/svg/search.svg";
import { tags } from "../../backend/tags";
import { types } from "../../backend/types";

interface ViewDataSectionProps {
  setStep: (step: number) => void;
  setData: (data: any) => void;
}

export const ViewDataSection = ({ setStep, setData }: ViewDataSectionProps) => {
  const [vars, setVars] = useState<any[]>([]);
  const [currentType, setCurrentType] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const getVars = async () => {
    const vars = await window.electron.get_data_studio_variables();
    console.log("got vars", vars);
    setVars(vars || []); // Ensure vars is an array
  };

  useEffect(() => {
    window.electron.set_data_studio_variables([
      {
        name: "One",
        type: "excel",
        path: "/home/ridit/Downloads/Financial Sample.xlsx",
        skip_rows: 24,
        sheet: "sheet1",
      },
      {
        name: "Two",
        type: "csv",
        path: "/home/ridit/Downloads/",
      },
      {
        name: "Three",
        type: "sql",
        path: "/home/ridit/Downloads/Financial Sample.xlsx",
        skip_rows: 24,
        sheet: "sheet1",
      },
      {
        name: "Four",
        type: "postgresql",
        path: "/home/ridit/Downloads/",
      },
      {
        name: "Five",
        type: "mysql",
        path: "/home/ridit/Downloads/Financial Sample.xlsx",
        skip_rows: 24,
        sheet: "sheet1",
      },
      {
        name: "Six",
        type: "json",
        path: "/home/ridit/Downloads/",
      },
    ]);
    getVars();

    console.log("got vars", vars);
  }, []);

  useEffect(() => {
    const types = document.querySelectorAll(".type");

    types.forEach((type) => {
      type.addEventListener("click", () => {
        if (type.innerHTML.toLowerCase() === "all") {
          setCurrentType("");
          return;
        }
        setCurrentType(type.innerHTML.toLowerCase());
      });
    });
  }, []);

  useEffect(() => {
    console.log(searchQuery);
  }, [searchQuery]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        overflow: "hidden",
        width: "90vw",
        justifyContent: "center",
      }}
    >
      <div
        className="filters"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Filter's</h1>
        <div className="types">
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "12px",
            }}
          >
            <li className="type">Excel</li>
            <li className="type">CSV</li>
            <li className="type">SQL</li>
            <li className="type">PostGreSQL</li>
            <li className="type">MySQL</li>
            <li className="type">JSON</li>
            <li className="type">All</li>
          </ul>
        </div>
        <div className="view">
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "12px",
            }}
          >
            <li onClick={() => alert("Coming soon!")}>Grid</li>
            <li>List</li>
          </ul>
        </div>
        <div
          className="search"
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--file-list-bg)",
            width: "30vh",
            height: "3vh",
            padding: "7px",
            border: "none",
            borderRadius: "1.5vh",
          }}
        >
          <SearchIcon />
          <input
            type="type"
            style={{
              width: "100%",
              height: "100%",
              outline: "none",
              border: "none",
              color: "var(--main-text-color)",
              background: "transparent",
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "90vw",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {vars.map((value) => {
          if (currentType && value.type === currentType) {
            return (
              <div
                className="view-datatype"
                onClick={() => {
                  setStep(3);
                  setData(value);
                }}
              >
                <div>
                  <span>{types.map((type: any) => type[value.type])}</span>
                  <p>{value.name}</p>
                </div>
                <p>{tags.map((tag: any) => tag[value.type])}</p>
              </div>
            );
          }

          if (
            searchQuery.length === 1
              ? searchQuery.startsWith(value.name[0])
              : searchQuery.length === value.name.length
                ? searchQuery.startsWith(value.name[0]) &&
                  searchQuery.endsWith(value.name[-1])
                : searchQuery.endsWith(value.name[-1])
          ) {
            return (
              <div
                className="view-datatype"
                onClick={() => {
                  setStep(3);
                  setData(value);
                }}
              >
                <h1>Result</h1>
                <div>
                  <span>{types.map((type: any) => type[value.type])}</span>
                  <p>{value.name}</p>
                </div>
                <p>{tags.map((tag: any) => tag[value.type])}</p>
              </div>
            );
          }

          if (!currentType) {
            return (
              <div
                className="view-datatype"
                onClick={() => {
                  setStep(3);
                  setData(value);
                }}
              >
                <div>
                  <span>{types.map((type: any) => type[value.type])}</span>
                  <p>{value.name}</p>
                </div>
                <p>{tags.map((tag: any) => tag[value.type])}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
