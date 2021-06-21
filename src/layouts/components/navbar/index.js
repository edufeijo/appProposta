// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'

const NavbarAppProposta = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  return (
    <Fragment>
      <NavbarUser skin={skin} setSkin={setSkin} setMenuVisibility={setMenuVisibility} />
    </Fragment>
  )
}

export default NavbarAppProposta
