import React, { useState, useEffect } from "react";
import { FakeDataType, useDataFetching } from "./useFetchTable";

const DEFAULT_RECORDS_PER_PAGE = 25; // number of maximum records to be displayed on each page

const Table = () => {
  const [filteredData, setFilteredData] = useState<FakeDataType[]>([]); // filtered data after search
  const [currentData, setCurrentData] = useState<FakeDataType[]>([]); // data to be displayed on current page
  const [selectedRows, setSelectedRows] = useState<FakeDataType[]>([]); // selected rows
  const [currentPage, setCurrentPage] = useState(1); // current page number
  const [numberOfPages, setNumberOfPages] = useState(0); // total number of pages in pagination
  const [sortColumn, setSortColumn] = useState<keyof FakeDataType | null>(null); // column to be sorted

  // fetch data
  const { data, loading } = useDataFetching();

  useEffect(() => {
    // initialize filtered data with all fetched data
    setFilteredData(data);
  }, [data]);

  const handlePageChange = (newPage: number) => {
    // simply set new page number
    setCurrentPage(newPage);
  };

  const handleSort = (column: keyof FakeDataType) => {
    if (sortColumn === column) {
      // reverse sorting order if same column is clicked
      setFilteredData([...filteredData].reverse());
      return;
    } else {
      // set new sorting column
      setSortColumn(column);
      // set new sorted data
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[column] < b[column]) {
          return -1;
        }
        if (a[column] > b[column]) {
          return 1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1); // reset page number to 1
    // filter data based on search query
    setFilteredData(
      data.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleRowSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: FakeDataType
  ) => {
    // check if row is selected or not then update selected rows
    if (e.target.checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      // assuming email is unique
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.email !== row.email)
      );
    }
  };

  useEffect(() => {
    // update current data to be displayed on current page
    setNumberOfPages(Math.ceil(filteredData.length / DEFAULT_RECORDS_PER_PAGE));
    const indexOfLastRecord = currentPage * DEFAULT_RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - DEFAULT_RECORDS_PER_PAGE;
    setCurrentData(filteredData.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [filteredData, currentPage]);

  // convert selected rows to JSON string for display
  const selectedRowsJSON = JSON.stringify(selectedRows);

  return (
    <div>
      {loading && <div>Loading...</div>}
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th></th>
              <th onClick={() => handleSort("name")}>Name</th>
              <th onClick={() => handleSort("phone")}>Phone</th>
              <th onClick={() => handleSort("email")}>Email</th>
              <th onClick={() => handleSort("address")}>Address</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.email}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleRowSelection(e, row)}
                  />
                </td>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td>{row.email}</td>
                <td>{row.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === numberOfPages}
          >
            Next
          </button>
          <div>
            Page {currentPage}/{numberOfPages}
          </div>
        </div>
      </div>
      <div>Selected rows: {selectedRowsJSON}</div>
    </div>
  );
};

export default Table;
