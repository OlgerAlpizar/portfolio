import { FC } from 'react'
import cx from 'classnames'
import style from './Footer.module.scss'

const Footer: FC = () => {
  return (
    <footer
      className={cx(
        style.footer,
        'justify-content-between align-items-center text-body-secondary '
      )}
    >
      <p className="justify-content-start">
        &copy; 2023 Olger Alpizar Chaves, Inc
      </p>
    </footer>
  )
}

export default Footer
