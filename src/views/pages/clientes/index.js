import { useEffect, useState, Fragment } from 'react'
import { Card, Button, Row, Col } from 'reactstrap'
import db from '../../../db'
import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast }  from '../../components/Toasts/ToastTypes'
import { isUserLoggedIn } from '@utils'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import { Link, useHistory } from "react-router-dom"
import { Edit, Upload } from 'react-feather'
import TabelaDeClientes from '../../components/Tabelas/TabelaDeClientes'

const Clientes = () => {
  let msgToast = ''
  const notifySuccess = () => toast.success(<SuccessToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [clientes, setClientes] = useState()

  const dispatch = useDispatch()
  const history = useHistory()

  const tratarErro = (err) => {
    console.log("err=", err)
    const str = String(err)
    if (str.match(/401/)) {   
      dispatch(handleLogout())
      msgToast = 'Usuário deve fazer login antes de continuar'
      history.push('/login')
    } else {
      msgToast = 'Erro de acesso ao servidor. Verifique sua conexão e tente novamente mais tarde'
    }
    notifyError()
  }

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, []) 

  useEffect(() => {
    if (userDataCarregado) {
      const pesquisaClientes = {
        bd: "clientes",
        operador: "get",
        cardinalidade: "all",
        pesquisa: { 
          ['idDaEmpresa']: userData.idDaEmpresa 
        }
      } 
      db.getGenerico(pesquisaClientes, false) 
      .then((clientes) => { 
        setClientes(clientes) 
      })
      .catch((err) => {
        tratarErro(err)
      }) 
    }
  }, [userDataCarregado]) 

  const CustomHeader = () => {
    return (
      <div className='d-flex justify-content-between'>
        <Button.Ripple tag={Link} to='/apps/invoice/add' color='primary' >
          <Edit size={14} />
          <span className='align-middle ml-25'>Criar Proposta</span>
        </Button.Ripple>
        <Button.Ripple tag={Link} to='/proposta-externa' color='primary'>
          <Upload size={14} />
          <span className='align-middle ml-25'>Carregar Proposta</span>
        </Button.Ripple>
      </div>
    )
  }    

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <Card>
            <CustomHeader />          
              {(clientes && <TabelaDeClientes clientes={clientes} />)}  
          </Card>
        </Col>
      </Row>
    </Fragment> 
  )
  }

export default Clientes

