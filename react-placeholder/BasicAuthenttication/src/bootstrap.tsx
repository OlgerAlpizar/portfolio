import './bootstrap.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { SecurityContextProvider } from './contexts/SecurityContext'
import App from './App'
import ReactDOM from 'react-dom/client'
import Toaster from './shared/components/toaster/Toaster'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
    <SecurityContextProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </SecurityContextProvider>
  </>
)
