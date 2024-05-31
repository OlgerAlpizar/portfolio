import { BsInfoCircle } from 'react-icons/bs'
import {
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Popover,
  PopoverBody,
  Row,
} from 'react-bootstrap'
import { FC, SyntheticEvent, useContext, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authenticationApi } from '../../configurations/settings'
import {
  conformPasswordValidator,
  emailValidator,
  noEmptyOrSpecialValidator,
  passwordValidator,
} from '../../shared/utils/TextHelper'
import { parseCatchMessage } from '../../shared/utils/MessageHelper'
import { signUp } from '../../apis/AuthenticationService'
import { textInputReducer } from '../../shared/utils/InputHelper'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../../shared/hooks/AxiosHook'
import AuthResponse from '../../apis/responses/AuthResponse'
import CreateAccountRequest from '../../apis/requests/CreateAccountRequest'
import FormSocialManager from '../socialLinks/SocialLinks'
import InputState from '../../models/InputState'
import SecurityContext from '../../contexts/SecurityContext'
import SocialNetworkEvent from '../../models/SocialNetworkEvent'
import SubmitButton from '../../shared/components/submitButton/SubmitButton'
import TermsConditions from '../termsConditions/TermsConditions'

const SignUp: FC = () => {
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
      passwordValidator(value),
      'Your password is invalid. Please check! (should be at least 8 characters)'
    )
  }

  const conformPasswordReducer = (currentState: InputState, value: string) => {
    return textInputReducer(
      currentState,
      value,
      conformPasswordValidator(value, password.value),
      'Your password does not match'
    )
  }

  const regularStringReducer = (currentState: InputState, value: string) => {
    return textInputReducer(
      currentState,
      value,
      noEmptyOrSpecialValidator(value),
      'Invalid value (Avoid special characters)'
    )
  }

  const [email, dispatchEmail] = useReducer(emailReducer, new InputState())
  const [password, dispatchPassword] = useReducer(
    passwordReducer,
    new InputState()
  )
  const [confirmPassword, dispatchConfirmPassword] = useReducer(
    conformPasswordReducer,
    new InputState()
  )
  const [firstName, dispatchFirstName] = useReducer(
    regularStringReducer,
    new InputState()
  )
  const [lastName, dispatchLastName] = useReducer(
    regularStringReducer,
    new InputState()
  )
  const [agreement, setAgreement] = useState(false)
  const [allowNotifications, setAllowNotifications] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const request = new CreateAccountRequest(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
      allowNotifications
    )

    signUp(authApiInstance, request)
      .then((res: AuthResponse) => {
        ctx?.onBasicSignIn(res, 'The account has been created')
        navigate('/')
      })
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
      .finally(() => setSubmitting(false))
  }

  const popOver = (key: string) => {
    const dictionary: { [key: string]: string } = {
      text: 'Just numbers and letters',
      email: 'Format example: your@email.com',
      password:
        'Should contains: 10 characters, at least 2 numbers, at least 2 numbers, at least 2 uppercase, at least 3 lowercase and at least 1 special character',
    }

    return (
      <Popover>
        <PopoverBody>{dictionary[key]}</PopoverBody>
      </Popover>
    )
  }

  const overLay = (key: string) => {
    return (
      <OverlayTrigger
        trigger={['hover', 'hover']}
        placement="top"
        defaultShow={false}
        overlay={popOver(key)}
      >
        <span className={'float-end'}>
          <BsInfoCircle className={'primaryIconBtn'} />
        </span>
      </OverlayTrigger>
    )
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <Card className={'card-form'}>
      <Card.Header>
        <Col
          as="h5"
          className="float-start"
        >
          Create account
        </Col>
        <Col className="float-end">
          <Link
            to={'/sign-in'}
            className={'primaryIconBtn'}
          >
            &nbsp;Already a member!
          </Link>
        </Col>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group
            as={Row}
            className={'mb-3'}
          >
            <Col sm={6}>
              <Form.Label>First name</Form.Label>
              {overLay('text')}
              <Form.Control
                type={'text'}
                value={firstName.value}
                placeholder={'First name'}
                onChange={(e) => dispatchFirstName(e.target.value as string)}
                onBlur={() => dispatchFirstName(firstName.value)}
                required
                isInvalid={!firstName.valid}
                autoComplete="off"
                id={'register-first-name'}
                minLength={3}
                maxLength={10}
              />
              <Form.Control.Feedback type="invalid">
                {firstName.error}
              </Form.Control.Feedback>
            </Col>

            <Col sm={6}>
              <Form.Label>Last name</Form.Label>
              {overLay('text')}
              <Form.Control
                type={'text'}
                value={lastName.value}
                placeholder={'Last name'}
                onChange={(e) => dispatchLastName(e.target.value as string)}
                onBlur={() => dispatchLastName(lastName.value)}
                required
                isInvalid={!lastName.valid}
                autoComplete="off"
                id={'register-last-name'}
                minLength={3}
                maxLength={10}
              />
              <Form.Control.Feedback type="invalid">
                {lastName.error}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3'}
          >
            <Col>
              <Form.Label>Email</Form.Label>
              {overLay('email')}
              <Form.Control
                type={'email'}
                value={email.value}
                placeholder={'your@email.com'}
                onChange={(e) => dispatchEmail(e.target.value as string)}
                onBlur={() => dispatchEmail(email.value)}
                required
                isInvalid={!email.valid}
                autoComplete="off"
                id={'register-email'}
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
            className={'mb-3'}
          >
            <Col>
              <Form.Label>Password</Form.Label>
              {overLay('password')}
              <Form.Control
                type={'password'}
                value={password.value}
                placeholder={'**********'}
                onChange={(e) => dispatchPassword(e.target.value as string)}
                onBlur={() => dispatchPassword(password.value)}
                required
                isInvalid={!password.valid}
                autoComplete="off"
                id={'register-password'}
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
              <Form.Label>Confirm password</Form.Label>
              {overLay('password')}
              <Form.Control
                type={'password'}
                value={confirmPassword.value}
                placeholder={'**********'}
                onChange={(e) =>
                  dispatchConfirmPassword(e.target.value as string)
                }
                onBlur={() => dispatchConfirmPassword(confirmPassword.value)}
                required
                isInvalid={!confirmPassword.valid}
                autoComplete="off"
                id={'register-confirm-password'}
                minLength={10}
                maxLength={10}
              />
              <Form.Control.Feedback type="invalid">
                {confirmPassword.error}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3'}
          >
            <Col>
              <Form.Check.Input
                type={'checkbox'}
                required
                className={'primaryCheck'}
                onChange={(e) => setAgreement(e.target.checked)}
                checked={agreement}
                id={'register-agreement'}
              />
              &nbsp;I have read and agree all the Fenrir Cup&nbsp;
              <Button
                onClick={() => setShowModal(true)}
                className={'primaryIconBtn'}
                variant="link"
              >
                Terms and conditions
              </Button>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3'}
          >
            <Col>
              <Form.Check.Input
                type="checkbox"
                checked={allowNotifications}
                onChange={(e) => setAllowNotifications(e.target.checked)}
                className={'primaryCheck'}
                id={'register-notifications'}
              />
              &nbsp;Yes, I`d like to receive notifications and offers
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3 text-center'}
          >
            <Col>
              <SubmitButton
                submitting={submitting}
                beforeLabel={'Create'}
                afterLabel={'Creating'}
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3 text-center'}
          >
            <Form.Label> Or register with:</Form.Label>
          </Form.Group>

          <Form.Group
            as={Row}
            className={'mb-3 text-center'}
          >
            <FormSocialManager socialEvent={SocialNetworkEvent.SIGN_UP} />
          </Form.Group>
        </Form>
        <TermsConditions
          show={showModal}
          onClose={closeModal}
        />
      </Card.Body>
    </Card>
  )
}

export default SignUp
