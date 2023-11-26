import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
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
    </div>
  )
}
