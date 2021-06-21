import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col } from 'reactstrap'
import db from '../../db'
import TabelaDeEmpresas from '../components/Tabelas/TabelaDeEmpresas'
import TabelaDeUsuarios from '../components/Tabelas/TabelaDeUsuarios'
import QuantidadeDeEmpresas from '../components/Estatísticas/QuantidadeDeEmpresas'
import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast }  from '../components/Toasts/ToastTypes'
import { isUserLoggedIn } from '@utils'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'


const HomeMaster = () => {
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)

  const [empresas, setEmpresas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  let msgToast = ''

  const notifySuccess = () => toast.success(<SuccessToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const dispatch = useDispatch()

  useEffect(() => {
//    dispatch(handleLogout())
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setToken(localStorage.getItem('accessToken'))
      setUserDataCarregado(true)
    }
  }, [])

  useEffect(() => { 
    if (userDataCarregado) {
      db.getEmpresas(token) 
      .then((empresas) => {
        setEmpresas(empresas)
/*         msgToast = 'Tabela de Empresas carregada com sucesso'
        notifySuccess() */
      })
      .catch((err) => {
        msgToast = 'Não foi possível carregar a tabela de Empresas. Verifique sua conexão e tente novamente mais tarde'
        notifyError()
      }) 
    }
  }, [userDataCarregado])

  useEffect(() => { 
    if (userDataCarregado) {
      db.getUsuarios(token) 
      .then((usuarios) => {
        setUsuarios(usuarios)
/*         msgToast = 'Tabela de Usuários carregada com sucesso'
        notifySuccess() */
      })
      .catch((err) => {
        msgToast = 'Não foi possível carregar a tabela de Usuários. Verifique sua conexão e tente novamente mais tarde'
        notifyError()
      }) 
    }
  }, [userDataCarregado])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Empresas {(userData && userData.nomeDoUsuario)}</CardTitle>
        </CardHeader>
        <CardBody>
          <TabelaDeEmpresas empresas={empresas} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardBody>
          <TabelaDeUsuarios usuarios={usuarios} />
        </CardBody>
      </Card>

      <Card>
        <Row className='match-height'>
          <Col lg='6' md='3' xs='6'>
            <QuantidadeDeEmpresas quantidadeDeEmpresas={empresas.length} />
          </Col>
        </Row>
      </Card>      
    </div>
  )
}

export default HomeMaster
