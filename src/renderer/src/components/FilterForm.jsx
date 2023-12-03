import * as React from 'react'
import { Col, Form, Row } from 'react-bootstrap'

export default function FilterForm({ setFilterText }) {
  return (
    <Col className="d-flex justify-content-center">
      <Form.Group as={Row}>
        <Form.Label column xs="2">
          Filter
        </Form.Label>
        <Col>
          <Form.Control type="text" onChange={(e) => setFilterText(e.target.value.toLowerCase())} />
        </Col>
      </Form.Group>
    </Col>
  )
}
