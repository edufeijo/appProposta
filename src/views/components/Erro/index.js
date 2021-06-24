import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'

const Erro = props => {
  const { erro } = props
  const dispatch = useDispatch()
  const history = useHistory()

  let msgToast = ''
  const notifyError = () => {
    toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })
  }

  const str = String(erro)

  if (erro) {
    if (str.match(/401/)) {   
      dispatch(handleLogout())
      history.push('/login')
      msgToast = 'Usuário deve fazer login antes de continuar'
    } else {
      msgToast =  'Erro de acesso ao servidor. Verifique sua conexão e tente novamente mais tarde'
    }
    notifyError()
  }

  return (
    <div></div>
  )
}

export default Erro
