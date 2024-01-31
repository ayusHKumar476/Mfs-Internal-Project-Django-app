import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const CustomNavbar = () => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  const navigate = useNavigate();
  const logoutUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/logout/`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      console.log(responseData);

      if (!response.ok) {
        console.log("api failed");
        alert(`Validation error:\n${responseData.message}`);
      } else {
        alert(responseData.message);

        sessionStorage.clear();

        navigate("/");
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Navbar expand="lg" className="bg-secondary">
      <Container>
        <Navbar.Brand href="/" style={{ color: "white" , marginLeft: "-300px" }}>Internal Project</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto"  style={{ marginRight: "-300px" }}>
            <div>
              {isAuthenticated ? (
                <button className="btn btn-primary" onClick={logoutUser}>
                  Logout
                </button>
              ) : (
                <Link to="/" className="btn btn-primary">
                  {"Login"}
                </Link>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
