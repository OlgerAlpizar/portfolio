import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap'
import { FC } from 'react'
import cx from 'classnames'
import style from './Loading.module.scss'

type LoadingProps = {
  moduleName: string
}

const Loading: FC<LoadingProps> = (props: LoadingProps) => {
  return (
    <Row>
      <Col>
        <Modal
          show={true}
          centered
          contentClassName={style.modal}
          backdrop={true}
        >
          <Modal.Body>
            <Container className={cx(style.container)}>
              <>
                <p>{props.moduleName}</p>
                <Spinner
                  as="span"
                  animation="grow"
                  role="status"
                  aria-hidden="true"
                />
              </>
            </Container>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  )
}

export default Loading
