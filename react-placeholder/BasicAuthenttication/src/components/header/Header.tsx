import { AiOutlineUser } from 'react-icons/ai'
import { Container, NavDropdown, Navbar } from 'react-bootstrap'
import { FC, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authenticationApi } from '../../configurations/settings'
import { getUserAvatar } from '../../shared/utils/UserHelper'
import { parseCamelCase } from '../../shared/utils/TextHelper'
import { parseCatchMessage } from '../../shared/utils/MessageHelper'
import { signOut } from '../../apis/AuthenticationService'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../../shared/hooks/AxiosHook'
import SecurityContext from '../../contexts/SecurityContext'
import coffeeCup from '../../assets/coffee_cup.png'
import cx from 'classnames'
import style from './Header.module.scss'

const Header: FC = () => {
  const ctx = useContext(SecurityContext)
  const authApiInstance = useAxiosInstance(authenticationApi())
  const navigate = useNavigate()

  const onSignOut = () => {
    signOut(authApiInstance, ctx?.authenticator.currentUser?.email ?? '')
      .then(() => {
        ctx?.onBasicSignOut()
        navigate('/')
      })
      .then(() => toast.success('sign out success'))
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
  }

  const getUser = () => {
    return `${parseCamelCase(ctx?.authenticator.currentUser?.firstName)} 
    ${parseCamelCase(ctx?.authenticator.currentUser?.lastName)}`
  }

  const loginNav = () => {
    return ctx?.authenticator.isAuthenticated ? (
      <>
        <img
          src={getUserAvatar(ctx?.authenticator.currentUser?.avatar)}
          className={cx('rounded-circle', style.avatar)}
          alt="account"
        ></img>
        <NavDropdown
          title={getUser()}
          align="end"
        >
          <NavDropdown.Item href="#action/3.1">My account</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={onSignOut}>Sign Out</NavDropdown.Item>
        </NavDropdown>
      </>
    ) : (
      !location.pathname.includes('sign-in') && (
        <Link
          to={'sign-in'}
          className={cx('primaryIconBtn', style.singIn)}
        >
          <AiOutlineUser
            title="Sing in"
            size={20}
          />
          &nbsp;Sing In
        </Link>
      )
    )
  }

  const restrictedNav = () => {
    return ctx?.authenticator.isAuthenticated ? (
      <Link
        to={'user'}
        className={cx(
          'primaryIconBtn',
          'me-auto',
          'my-2 my-lg-0',
          style.navItem
        )}
      >
        &nbsp;Users
      </Link>
    ) : (
      <></>
    )
  }

  return (
    <div>
      <Navbar
        expand="lg"
        className={cx('bg-body-tertiary', style.headerContainer)}
      >
        <Container fluid>
          <Navbar.Brand>
            <Link
              to={'/'}
              className={style.brand}
            >
              <img
                src={coffeeCup}
                alt="Logo"
                className={style.imageBrand}
              />
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse
            id="navbarScroll"
            className="justify-content-end"
          >
            {restrictedNav()}
            {loginNav()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header
