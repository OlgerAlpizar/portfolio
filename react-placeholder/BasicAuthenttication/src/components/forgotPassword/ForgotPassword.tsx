import { Card, Col, Form, Row } from 'react-bootstrap'
import { FC, SyntheticEvent, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { authenticationApi } from '../../configurations/settings'
import { emailValidator } from '../../shared/utils/TextHelper'
import { parseCatchMessage } from '../../shared/utils/MessageHelper'
import { resetPassword } from '../../apis/AuthenticationService'
import { textInputReducer } from '../../shared/utils/InputHelper'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../../shared/hooks/AxiosHook'
import InputState from '../../models/InputState'
import SubmitButton from '../../shared/components/submitButton/SubmitButton'
import cx from 'classnames'

const ForgotPassword: FC = () => {
  const authApiInstance = useAxiosInstance(authenticationApi())

  const emailReducer = (currentState: InputState, value: string) => {
    return textInputReducer(
      currentState,
      value,
      emailValidator(value),
      'Your email address is invalid. Please check!'
    )
  }

  const [email, dispatchEmail] = useReducer(emailReducer, new InputState())
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    setSubmitting(true)

    resetPassword(authApiInstance, email.value)
      .then(() =>
        toast.success('We send you and email to restore your account')
      )
      .catch((err: Error) => toast.error(parseCatchMessage(err)))
  }

  return (
    <Card className={'card-form'}>
      <Card.Header>
        <Col
          as="h5"
          className="float-start"
        >
          Forgot password
        </Col>
        <Col className="float-end">
          <Link
            to={'/sign-in'} //MF will return to the shell, on module ill redirect to default route
            className={'primaryIconBtn'}
          >
            &nbsp;Sign in
          </Link>
        </Col>
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
                id={'forgot-email'}
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
            className={cx('mb-3', 'text-center')}
          >
            <Col>
              <SubmitButton
                submitting={submitting}
                beforeLabel={'Submit'}
                afterLabel={'Submitting'}
              />
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ForgotPassword
