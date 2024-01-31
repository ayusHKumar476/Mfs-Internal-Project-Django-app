import { useState, useEffect } from "react";
import "./Myform.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const MainApp = () => {
  const [availableWebsites, setAvailableWebsites] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

  useEffect(() => {
    const getAvailableWebsites = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/available_websites/`,
          {
            method: "GET",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          alert("Something went wrong: ", response.error);
        } else {
          setAvailableWebsites(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching available websites:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    };

    getAvailableWebsites();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnClick = async () => {
    if (!inputValue) {
      alert("Enter something before clicking submit button !!");
    } else {
      const data = {
        company_name: inputValue,
      };

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/available_websites/`,
          {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const responseData = await response.json();

        if (responseData.message == "success" && (responseData.data).length > 0) {
          setTableData(responseData.data);
          setSubmitted(true);
          setAvailableWebsites([]);
        } else {
          alert("No data found for the selected company");
        }
      } catch (error) {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const getSliceOfData = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return tableData.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <Card className="mx-auto text-center" style={{ width: "75%" }}>
        <Card.Header>View your sample data here !!</Card.Header>
        <Card.Body>
          <input
            id="userInput"
            type="text"
            className="form-control d-inline"
            aria-describedby="button-addon2"
            value={inputValue}
            onChange={handleInputChange}
            list="availableList"
            placeholder="Please select from any available website"
            style={{ width: "65%", marginRight: "10px" }}
          ></input>
          <Button
            className="btn btn-outline-secondary d-inline"
            type="button"
            id="button-addon2"
            onClick={handleOnClick}
          >
            Search
          </Button>
          <datalist id="availableList">
            {availableWebsites.map((website, index) => (
              <option key={index} value={website.company_name} />
            ))}
          </datalist>
        </Card.Body>
        {submitted && (
          <>
            <Card.Body>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">Company</th>
                    <th scope="col">Latitude</th>
                    <th scope="col">Zip Code</th>
                    <th scope="col">City Name</th>
                    <th scope="col">Longitude</th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Store Address</th>
                  </tr>
                </thead>
                <tbody>
                  {getSliceOfData().map((row, index) => (
                    <tr key={index}>
                      <td>{row.data.state}</td>
                      <td>{row.data.company}</td>
                      <td>{row.data.latitude}</td>
                      <td>{row.data.zip_code}</td>
                      <td>{row.data.city_name}</td>
                      <td>{row.data.longitude}</td>
                      <td>{row.data.store_name}</td>
                      <td>{row.data.phone_number}</td>
                      <td>{row.data.store_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
            <Card.Footer className="text-muted">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <Button
                    className="btn btn-info"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={{ marginRight: '10px' }}
                  >
                    Previous
                  </Button>
                  <span>Page {currentPage}</span>
                  <Button
                    className="btn btn-info"
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= Math.ceil(tableData.length / postsPerPage)
                    }
                    style={{ marginLeft: '10px' }}
                  >
                    Next
                  </Button>
                </div>
                <Button className="btn btn-link" variant="link">
                  Send the full data to your email
                </Button>
              </div>
            </Card.Footer>
          </>
        )}
      </Card>
    </>
  );
};
export default MainApp;
