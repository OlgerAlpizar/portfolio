import { FC } from 'react'
import cx from 'classnames'

type IconButtonProps = {
  type: 'button' | 'submit' | 'reset'
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event: any) => void
  children?: React.ReactNode
}

const IconButton: FC<IconButtonProps> = (props: IconButtonProps) => {
  return (
    <button
      type="button"
      className={cx('btn', 'btn-md')}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

export default IconButton
