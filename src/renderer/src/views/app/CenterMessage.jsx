import { Col, Container, Row } from 'react-bootstrap'

export default function CenterMessage({ msg }) {
  return (
    <Container fluid>
      <Row className="d-flex align-items-center" style={{ height: '90vh' }}>
        <Col className="text-center">
          <div>{msg}</div>
        </Col>
      </Row>
    </Container>
  )
}
