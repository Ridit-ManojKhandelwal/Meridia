import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppSelector } from "../../shared/hooks";

import "../tools/styling/table.css";

const Environment = React.memo(() => {
  const rawData: any = useAppSelector((state) => state.main.env_vars.vars);
  const data = Array.isArray(rawData) ? rawData : [rawData];

  return (
    <PerfectScrollbar className="scroller">
      <div className="environment-container">
        <div className="content-list-outer-container">
          <div>
            <span>ENVOIRNMENT</span>
          </div>
          <DataTable
            value={data}
            resizableColumns
            showGridlines
            tableStyle={{ minWidth: "10rem" }}
            style={{
              overflow: "hidden",
            }}
          >
            <Column field="name" header="Name"></Column>
            <Column field="value" header="Value"></Column>
            <Column field="type" header="Type"></Column>
          </DataTable>
        </div>
      </div>
    </PerfectScrollbar>
  );
});

export default Environment;
