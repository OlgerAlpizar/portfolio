import { Col, Container, Row } from 'react-bootstrap'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Router from './routing/Router'
import style from './app.module.scss'

const App: FC = () => {
  return (
    <Container className={style.mainContainer}>
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>

      <Row className={style.rowBody}>
        <Col>
          <Router />
        </Col>
      </Row>

      <Row>
        <Col>
          <Footer />
        </Col>
      </Row>
    </Container>
  )
}

export const AppLayout: FC = () => {
  return <Outlet />
}

export default App
