import { Button, Spinner } from 'react-bootstrap'
import { FC } from 'react'

type SubmitButtonProps = {
  submitting: boolean
  beforeLabel: string
  afterLabel: string
}

const SubmitButton: FC<SubmitButtonProps> = (props: SubmitButtonProps) => {
  const child = props.submitting ? (
    <span>
      {props.afterLabel}&nbsp;
      <Spinner
        animation="border"
        role="status"
        size="sm"
      />
    </span>
  ) : (
    <span>{props.beforeLabel}</span>
  )

  return (
    <Button
      variant="primary"
      type="submit"
      className={'primaryBtn'}
      disabled={props.submitting}
    >
      {child}
    </Button>
  )
}

export default SubmitButton
