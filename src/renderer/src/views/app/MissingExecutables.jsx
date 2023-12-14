import * as React from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'

export default function MissingExecutables({ packagesToInstall }) {
  return (
    <Container fluid>
      <Row className="d-flex align-items-center" style={{ height: '90vh' }}>
        <Col>
          <Row>
            <Col className="d-flex justify-content-center">
              <div className="mb-3">Please ensure these are installed and available in PATH</div>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col xs={5}>
              <Table>
                <tbody>
                  {packagesToInstall.map(([name, instr, type]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>
                        {type === 'code' ? <code>{instr}</code> : <a href={instr}>{instr}</a>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
