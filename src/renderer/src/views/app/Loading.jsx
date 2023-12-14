import { Col, Container, Row } from 'react-bootstrap'

export default function Loading() {
  return (
    <Container fluid>
      <Row className="d-flex align-items-center" style={{ height: '90vh' }}>
        <Col className="text-center">
          <div>Loading...</div>
        </Col>
      </Row>
    </Container>
  )
}
