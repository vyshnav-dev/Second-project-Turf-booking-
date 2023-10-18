import { Container, Row, Col } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
function FormContainer({ children }) {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={10} md={8} lg={6} className="card p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default FormContainer;

