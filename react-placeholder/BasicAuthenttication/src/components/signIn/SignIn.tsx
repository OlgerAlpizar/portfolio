import { Card, Col, Form, Row } from 'react-bootstrap'
import { FC, SyntheticEvent, useContext, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authenticationApi } from '../../configurations/settings'
import { emailValidator, noEmptyValidator } from '../../shared/utils/TextHelper'
import { parseCatchMessage } from '../../shared/utils/MessageHelper'
import { signIn } from '../../apis/AuthenticationService'
import { textInputReducer } from '../../shared/utils/InputHelper'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../../shared/hooks/AxiosHook'
import AuthResponse from '../../apis/responses/AuthResponse'
import FormSocialManager from '../socialLinks/SocialLinks'
import InputState from '../../models/InputState'
import SecurityContext from '../../contexts/SecurityContext'
import SignInRequest from '../../apis/requests/SignInRequest'
import SocialNetworkEvent from '../../models/SocialNetworkEvent'
import SubmitButton from '../../shared/components/submitButton/SubmitButton'
import cx from 'classnames'

const SignIn: FC = () => {
  const ctx = useContext(SecurityContext)
  const authApiInstance = useAxiosInstance(authenticationApi())
  const navigate = useNavigate()

  const emailReducer = (currentState: InputState, value: string) => {
    return textInputReducer(
      currentState,
      value,
      emailValidator(value),
      'Your email address is invalid. Please check!'
    )
  }

  const passwordReducer = (currentState: InputState, value: string) => {
    return textInputReducer(
      currentState,
      value,
      noEmptyValidator(value, 10),
      'Your password address is invalid. Please check! (should be at least 8 characters)'
    )
  }

  const [email, dispatchEmail] = useReducer(emailReducer, new InputState())
  const [password, dispatchPassword] = useReducer(
    passwordReducer,
    new InputState()
  )
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const request = new SignInRequest(email.value, password.value, rememberMe)

    signIn(authApiInstance, request)
      .then((res: AuthResponse) => {
        ctx?.onBasicSignIn(res, 'Sign in completed')
        navigate('/')
      })
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
      .finally(() => setSubmitting(false))
  }

  return (
    <Card className={'card-form'}>
      <Card.Header>
        <Row>
          <Col as="h5">Sign In</Col>
          <Col className={cx('float-start')}>
            <Link
              to={'/sign-up'}
              className={cx('primaryIconBtn', 'float-end')}
            >
              &nbsp;Not a member yet
            </Link>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group
            as={Row}
            className={cx('mb-3')}
          >
            <Col>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type={'email'}
                value={email.value}
                placeholder={'your@email.com'}
                onChange={(e) => dispatchEmail(e.target.value as string)}
                onBlur={() => dispatchEmail(email.value)}
                required
                isInvalid={!email.valid}
                autoComplete="off"
                id={'login-email'}
                minLength={7}
                maxLength={20}
              />
              <Form.Control.Feedback type="invalid">
                {email.error}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={cx('mb-3')}
          >
            <Col>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type={'password'}
                value={password.value}
                placeholder={'**********'}
                onChange={(e) => dispatchPassword(e.target.value as string)}
                onBlur={() => dispatchPassword(password.value)}
                required
                isInvalid={!password.valid}
                autoComplete="off"
                id={'login-password'}
                minLength={10}
                maxLength={10}
              />
              <Form.Control.Feedback type="invalid">
                {password.error}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3'}
          >
            <Col>
              <Form.Check.Input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={cx('primaryCheck', 'float-start')}
                id={'singIn-remember'}
              />
              &nbsp;remember me&nbsp;
              <Link
                to={'/forgot-password'}
                className={cx('primaryIconBtn', 'float-end')}
              >
                &nbsp;Forgot Password?
              </Link>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={cx('mb-3', 'text-center')}
          >
            <Col>
              <SubmitButton
                submitting={submitting}
                beforeLabel={'Sign in'}
                afterLabel={'Signing in'}
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={cx('mb-3', 'text-center')}
          >
            <Form.Label> Or sign in with:</Form.Label>
          </Form.Group>

          <Form.Group
            as={Row}
            className={cx('mb-3', 'text-center')}
          >
            <FormSocialManager socialEvent={SocialNetworkEvent.SIGN_IN} />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SignIn
