import { FC } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Toaster: FC = () => {
  return (
    <ToastContainer
      autoClose={5000}
      position={toast.POSITION.BOTTOM_RIGHT}
      pauseOnFocusLoss={false}
      newestOnTop={true}
      limit={5}
    />
  )
}

export default Toaster
