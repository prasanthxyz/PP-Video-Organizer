import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Container, Flex } from '@chakra-ui/react'

export default function Layout() {
  return (
    <Container maxW="container.xl">
      <Flex h="100vh" py={20}>
        <div className="menu">
          <Link to="/">Home</Link>
          <br />
          <Link to="/videos">Videos</Link>
          <br />
          <Link to="/galleries">Galleries</Link>
          <br />
          <Link to="/tags">Tags</Link>
        </div>
        <Outlet />
      </Flex>
    </Container>
  )
}
