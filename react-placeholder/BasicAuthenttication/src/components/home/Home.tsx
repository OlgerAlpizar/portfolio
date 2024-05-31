import { Button, Carousel, Col, Row } from 'react-bootstrap'
import { FC, useContext } from 'react'
import {
  authVerification,
  signIn,
  signOut,
} from '../../apis/AuthenticationService'
import { authenticationApi } from '../../configurations/settings'
import { parseCatchMessage } from '../../shared/utils/MessageHelper'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../../shared/hooks/AxiosHook'
import { useNavigate } from 'react-router-dom'
import AuthResponse from '../../apis/responses/AuthResponse'
import SecurityContext from '../../contexts/SecurityContext'
import SignInRequest from '../../apis/requests/SignInRequest'
import style from './Home.module.scss'
import defaultImage from '../../assets/default_image.png'

const news = [
  {
    title: 'Title 1',
    details: 'description 1',
    imgSrc: defaultImage,
  },
  {
    title: 'Title 2',
    details: 'description 2',
    imgSrc: defaultImage,
  },
  {
    title: 'Title 3',
    details: 'description 3',
    imgSrc: defaultImage
  },
]

const Home: FC = () => {
  const ctx = useContext(SecurityContext)
  const authApiInstance = useAxiosInstance(authenticationApi())
  const navigate = useNavigate()

  const onSignIn = () => {
    const request = new SignInRequest('olger@mail.com', '123asdAS!@', false)

    signIn(authApiInstance, request)
      .then((res: AuthResponse) => {
        ctx?.onBasicSignIn(res, 'Sign in completed')
        navigate('/')
      })
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
  }

  const onSignOut = () => {
    signOut(authApiInstance, ctx?.authenticator.currentUser?.email ?? '')
      .then(() => {
        ctx?.onBasicSignOut()
        navigate('/')
      })
      .then(() => toast.success('sign out success'))
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
  }

  const onAuthVerification = () => {
    authVerification(authApiInstance)
      .then(() =>
        toast.success(
          `user authenticated: ${ctx?.authenticator.currentUser.email}`
        )
      )
      .catch((err) => {
        toast.error(parseCatchMessage(err))
      })
  }

  return (
    <div>
      <Row>
        <Col>
          <Button
            onClick={onSignIn}
            className="primaryBtn float-end"
          >
            Sign In
          </Button>
        </Col>
        <Col>
          <Button
            onClick={onSignOut}
            className="primaryBtn float-end"
          >
            Sign out
          </Button>
        </Col>
        <Col>
          <Button
            onClick={onAuthVerification}
            className="primaryBtn float-end"
          >
            am I authenticated?
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>{ctx?.authenticator.accessToken.slice(-20)}</Col>
      </Row>

      <Row>
        <Col>
          <Carousel
            data-bs-theme="dark"
            className={style.carouselRow}
          >
            {news.map((item) => {
              return (
                <Carousel.Item key={item.title}>
                  <img
                    className={style.carouselImage}
                    src={item.imgSrc}
                    alt={item.title}
                  />
                  <Carousel.Caption>
                    <h3>{item.title}</h3>
                    <p>{item.details}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}
          </Carousel>
        </Col>
      </Row>
    </div>
  )
}

export default Home
