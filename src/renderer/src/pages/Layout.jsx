import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <div className="menu">
        <Link to="/">Home</Link>
      </div>
      <Outlet />
    </div>
  )
}
