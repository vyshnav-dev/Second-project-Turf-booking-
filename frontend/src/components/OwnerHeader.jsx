

import { Navbar, Nav, Container, NavDropdown, Image, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from "../ownerSlice/ownerApiSlice";
import { logout } from "../ownerSlice/ownerSlice";
import { useNavigate } from "react-router-dom";

const OwnerHeader = () => {
    const { ownerInfo } = useSelector((state) => state.owner);
    console.log("looo",ownerInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/owner/login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <header style={{position:'relative'}}>
            <Navbar style={{ backgroundColor: '#00008b', height: '80px', width: '100%' }} variant="dark" expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/owner'>
                        <Navbar.Brand style={{ marginLeft: '5px' }} href="/"><span style={{color:'green',fontSize:'2rem'}}>G</span>reenGlide <span></span>[OWNER]</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {ownerInfo ? (
                                <>
                                    
                                    <LinkContainer style={{ marginRight: "4rem" ,fontWeight:'bold' }} to='/owner/dashbord'>
                                        <Nav.Link>
                                            Dashbord
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer style={{ marginRight: "4rem" ,fontWeight:'bold' }} to='/owner'>
                                        <Nav.Link>
                                            Details
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer style={{ marginRight: "4rem",fontWeight:'bold' }} to='/owner/booking'>
                                        <Nav.Link>
                                            Bookings
                                        </Nav.Link>
                                    </LinkContainer>
                                    
                                    <NavDropdown title={ownerInfo.name} id='username'>
                                        <LinkContainer to='/owner/profile'>
                                            <NavDropdown.Item>
                                                Profile
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <Col xs={6} md={4}>
                                        <Image style={{ width: "50px", marginRight: "-94px" }} src= { ownerInfo.image ?`http://localhost:5000/Images/${ownerInfo.image}`:'https://cdn.vectorstock.com/i/preview-1x/99/94/default-avatar-placeholder-profile-icon-male-vector-23889994.jpg'} roundedCircle />
                                    </Col>
                                   
                                </>
                            ) : (
                                <>
                                    <LinkContainer to='/owner/login'>
                                        <Nav.Link>
                                            Sign In
                                        </Nav.Link>
                                    </LinkContainer>

                                    {/* <LinkContainer to='/ownerregister'>
                                        <Nav.Link>
                                            Sign Up
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/about'>
                                        <Nav.Link>
                                            About
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/home'>
                                        <Nav.Link>
                                            Home
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/booking'>
                                        <Nav.Link>
                                            Booking
                                        </Nav.Link>
                                    </LinkContainer> */}
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default OwnerHeader;










// import { Navbar,Nav,Container,NavDropdown,Image,Col } from "react-bootstrap";
// // import {FaSignInAlt,FaSignOutAlt} from 'react-icons/fa';
// import { useDispatch,useSelector } from "react-redux";
// import{LinkContainer} from 'react-router-bootstrap'
// import { useLogoutMutation } from "../ownerSlice/ownerApiSlice";
// import { logout } from "../ownerSlice/ownerSlice";
// import { useNavigate } from "react-router-dom";
// const OwnerHeader = () =>{

//         const {ownerInfo} = useSelector((state) => state.owner)
       

//         const dispatch=useDispatch();
//         const navigate= useNavigate();

//         const [logoutApiCall] = useLogoutMutation();

//         const logoutHandler = async () =>{
//                 try {
//                     await logoutApiCall().unwrap();
//                     dispatch(logout());
//                     navigate('/ownerlogin')
//                 } catch (err) {
//                     console.log(err);
//                 }
//         }

//     return(
//         <header>
//             <Navbar style={{backgroundColor:'#0F122A',height:'80px',width:'100%' }}  variant="dark" expand='lg' collapseOnSelect>
//                 <Container>
//                     <LinkContainer to='/'>
//                     <Navbar.Brand style={{marginLeft:'5px'}} href="/">GreenGlide</Navbar.Brand>
//                     </LinkContainer>
//                     <Navbar.Toggle aria-controls="basic-navbar-nav"/>
//                     <Navbar.Collapse id="basic-navbar-nav">
//                         <Nav className="ms-auto">
//                             { ownerInfo ? (
//                                 <>
//                                 <Col xs={6} md={4}>
//                                     <Image style={{width:"50px",marginRight:"20px"}} src={`http://localhost:5000/Images/${ownerInfo.image}`} roundedCircle />
//                                  </Col>
//                                 <NavDropdown title={ownerInfo.name} id='username'>
//                                     <LinkContainer to='/profile'>
//                                         <NavDropdown.Item>
//                                         Profile
//                                         </NavDropdown.Item>
//                                     </LinkContainer>
//                                     <NavDropdown.Item onClick={ logoutHandler }>
//                                         Logout
//                                     </NavDropdown.Item>
//                                 </NavDropdown>
//                                 </>
//                             ) : (
//                                 <>
//                                 <LinkContainer to='/ownerlogin'>
//                             <Nav.Link >
//                                 {/* <FaSignInAlt/>Sign In */}
//                             </Nav.Link>
//                             </LinkContainer>
                            
//                             <LinkContainer to='/ownerregister'>
//                             <Nav.Link >
//                                 {/* <FaSignOutAlt/>Sign Up */}
//                             </Nav.Link>
//                             </LinkContainer>
//                                 </>
//                             ) }
                            
//                         </Nav>
//                     </Navbar.Collapse>

//                 </Container>
//             </Navbar>

//         </header>
//     );
// };

// export default OwnerHeader;