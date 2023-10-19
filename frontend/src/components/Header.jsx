import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import Default from "./Default";
import "../css/header.css";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("hesder", userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="header1class">
      <Navbar
        className="firnav"
        style={{ height: "80px", width: "100%" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <div className="sitename">
          <LinkContainer style={{ marginLeft: "-68px" }} to="/">
            <Navbar.Brand  style={{ marginLeft: "5px" }} href="/">
              <span style={{ color: "green", fontSize: "2rem" }}>G</span>
              reenGlide
            </Navbar.Brand>
          </LinkContainer>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo && userInfo.verified ? (
                <>
                  <Search />
                  <Default />

                  <LinkContainer
                    style={{ marginRight: "4rem", fontWeight: "bold" }}
                    to="/"
                  >
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  <LinkContainer
                    style={{ marginRight: "4rem", fontWeight: "bold" }}
                    to="/about"
                  >
                    <Nav.Link>About</Nav.Link>
                  </LinkContainer>

                  <LinkContainer
                    style={{ marginRight: "4rem", fontWeight: "bold" }}
                    to="/venue"
                  >
                    <Nav.Link>Venues</Nav.Link>
                  </LinkContainer>
                  <LinkContainer
                    style={{ marginRight: "4rem", fontWeight: "bold" }}
                    to="/history"
                  >
                    <Nav.Link>Bookings</Nav.Link>
                  </LinkContainer>

                  <NavDropdown
                    style={{ marginLeft: "-34px" }}
                    title={userInfo.name}
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {/* <Col xs={6} md={4}> */}
                  <Image
                    style={{ width: "50px", marginRight: "-80px" }}
                    src={
                      userInfo.image
                        ? `https://spexcart.online/Images/${userInfo.image}`
                        : "https://cdn.vectorstock.com/i/preview-1x/99/94/default-avatar-placeholder-profile-icon-male-vector-23889994.jpg"
                    }
                    roundedCircle
                  />
                  {/* </Col> */}
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt />
                      Sign In
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/register">
                    <Nav.Link>{/* <FaSignOutAlt/>Sign Up */}</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
