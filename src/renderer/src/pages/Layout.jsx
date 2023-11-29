import React from 'react'
import { Button, Container, Nav, Navbar, Stack } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'
import { useHotkeys } from 'react-hotkeys-hook'
import { Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/icon.png'

export default function Layout() {
  const navigate = useNavigate()

  useHotkeys('Shift+R', () => navigate('/'))
  useHotkeys('Shift+V', () => navigate('/videos'))
  useHotkeys('Shift+G', () => navigate('/galleries'))
  useHotkeys('Shift+T', () => navigate('/tags'))

  return (
    <Container fluid>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand>
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="PVORG" />
          &nbsp;&nbsp;PVORG
        </Navbar.Brand>
        <Stack direction="horizontal" className="me-auto ms-3">
          <Nav.Link className="me-2" href="#/">
            Random
          </Nav.Link>
          <Nav.Link className="me-2" href="#/videos">
            Videos
          </Nav.Link>
          <Nav.Link className="me-2" href="#/galleries">
            Galleries
          </Nav.Link>
          <Nav.Link className="me-2" href="#/tags">
            Tags
          </Nav.Link>
        </Stack>
        <Button size="sm" variant="dark" className="d-flex" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </Navbar>
      <Outlet />
    </Container>
  )
}
