import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import FormularioDeProposta from '../../components/Formularios/Proposta/FormularioDeProposta'
import { isUserLoggedIn } from '@utils'
import db from '../../../db'
import { ALERTA_FOLLOWUP_CLIENTE, VALORES_INICIAIS_DO_ITEM, VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA, VALORES_INICIAIS_DA_PROPOSTA } from '../../../configs/appProposta'
import Erro from '../../components/Erro'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'

const EditaProposta = () => {
  const { id, rascunho } = useParams()
  const [erro, setErro] = useState(null)

  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)

  const [empresa, setEmpresa] = useState(null)
  const [proposta, setProposta] = useState(VALORES_INICIAIS_DA_PROPOSTA)
  const [versaoDaProposta, setVersaoDaProposta] = useState(VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA)
  const [tabelaDeItens, setTabelaDeItens] = useState([VALORES_INICIAIS_DO_ITEM])
  const [operacao, setOperacao] = useState('Criar')

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, [])

  useEffect(() => {
    if (userDataCarregado) {
      if (rascunho === '1') { // Proposta rascunho está gravada em Local Storage
        const propostasEmLocalStorage = JSON.parse(localStorage.getItem('@appproposta/propostas'))
        setProposta(propostasEmLocalStorage.proposta)
        setVersaoDaProposta(propostasEmLocalStorage.versaoDaProposta)
        setTabelaDeItens(propostasEmLocalStorage.tabelaDeItens)
        setEmpresa(propostasEmLocalStorage.empresa)
        setOperacao(propostasEmLocalStorage.operacao) 
        localStorage.removeItem('@appproposta/propostas')
      } else {
        if (id !== undefined) { // Carrega a proposta id
          if (id.length !== 24) {
            msgToast = 'Proposta não encontrada. Preencha o formulário para criar uma nova proposta'
            notifyError()
          } else {
            const query = {
              bd: "propostas",
              operador: "get",
              cardinalidade: "one",
              pesquisa: { 
                ['_id']: id, 
                idDaEmpresa: userData.idDaEmpresa
              }
            } 
            db.getGenerico(query, false) 
            .then((resposta) => { 
              if (resposta !== null) {
                setProposta(resposta) 
                setVersaoDaProposta(resposta.versoesDaProposta[resposta.versoesDaProposta.length - 1])
                setOperacao('Atualizar')
                let alertaLigado = false
                let msg = ALERTA_FOLLOWUP_CLIENTE
                if (resposta.alertaEm !== null) {
                  alertaLigado = true
                  msg = resposta.msgDoAlerta
                }
                setProposta(registroAnterior => ({
                  ...registroAnterior, 
                  isAlertaLigado: alertaLigado,
                  msgDoAlerta: msg,
                  diasParaAlerta: null,
                  isNewCliente: false
                }))              
                setVersaoDaProposta(registroAnterior => ({
                  ...registroAnterior, 
                  diasDeValidadeDaProposta: null,
                  dataDaProposta: null
                }))   

                const copiaDaTabelaDeItens = resposta.versoesDaProposta[resposta.versoesDaProposta.length - 1].itensDaVersaoDaProposta
                const tabelaDeItensString = copiaDaTabelaDeItens.map((item, index, array) => {
                  item.precoDoItem = String(item.precoDoItem).replace(".", ",")
                  item.erroNoFormulario = {}
                  return item
                })  
                setTabelaDeItens(tabelaDeItensString)  
              } else {
                msgToast = 'Proposta não encontrada. Preencha o formulário para criar uma nova proposta'
                notifyError()
              }
            })
            .catch((err) => {
  /*             setErro(err)
              setErro(null) */
            })  
          }
        }

        const query = { // Carrega es informações da empresa
          bd: "empresas",
          operador: "get",
          cardinalidade: "one",
          pesquisa: { 
            ['_id']: userData.idDaEmpresa 
          }
        } 
        db.getGenerico(query, false) 
        .then((resposta) => { 
          setEmpresa(resposta) 
          setProposta(registroAnterior => ({
            ...registroAnterior, 
            idDaEmpresa: userData.idDaEmpresa
          })) 
          setVersaoDaProposta(registroAnterior => ({
            ...registroAnterior, 
            idDoUsuario: userData._id,
            nomeDoUsuario: userData.nomeDoUsuario
          }))
        })
        .catch((err) => {
          setErro(err)
          setErro(null) 
        }) 
      }
    }
  }, [userDataCarregado]) 
    
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <FormularioDeProposta 
            userData={userData} 
            empresa={empresa} 
            proposta={proposta} 
            setProposta={setProposta} 
            versaoDaProposta={versaoDaProposta}
            setVersaoDaProposta={setVersaoDaProposta}
            tabelaDeItens={tabelaDeItens}
            setTabelaDeItens={setTabelaDeItens}
            operacao={operacao}
          />
        </Col>
      </Row>
      <Erro erro={erro} />
    </Fragment>
  )
}
export default EditaProposta
