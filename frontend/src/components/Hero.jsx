import { Container, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">Welcome </h1>
          <h4 className="text-center mb-4"></h4>

          {!userInfo ? (
            <div className="d-flex">
              <LinkContainer to="/login">
                <Button variant="primary" className="me-3">
                  Sign In
                </Button>
              </LinkContainer>

              <LinkContainer to="/register">
                <Button variant="secondary">Sign Up</Button>
              </LinkContainer>
            </div>
          ) : (
            <h4>{userInfo.name}</h4>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
