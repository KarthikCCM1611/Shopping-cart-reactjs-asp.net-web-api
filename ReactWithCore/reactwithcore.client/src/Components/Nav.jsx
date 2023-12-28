import React from 'react'
import { Link } from 'react-router-dom'
import Cart from './Cart'

const Nav = () => {
  return (
    <nav className='navbar bg-dark justify-content-center'>
      <Link className='navbar-brand' to="/">Cart</Link>
      <Link className='navbar-brand' to="/weatherforecasts">WeatherForecasts</Link>
    </nav>
  )
}

export default Nav
