import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/icon.png'

export default function Layout() {
  return (
    <Container fluid>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="PVORG"
            />
            &nbsp;&nbsp;PVORG
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#/">Random</Nav.Link>
              <Nav.Link href="#/videos">Videos</Nav.Link>
              <Nav.Link href="#/galleries">Galleries</Nav.Link>
              <Nav.Link href="#/tags">Tags</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </Container>
  )
}
