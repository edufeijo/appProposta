import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import FormularioDeProposta from '../../components/Formularios/Proposta/FormularioDeProposta'
import { isUserLoggedIn } from '@utils'
import db from '../../../db'
import { ALERTA_FOLLOWUP_CLIENTE } from '../../../configs/appProposta'
import config from '../../../configs/comoPediuOptions'
import Erro from '../../components/Erro'

const EditaProposta = () => {
  const { id, rascunho } = useParams()

  const [erro, setErro] = useState(null)

  const [userData, setUserData] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)

  const valoresIniciaisDaProposta = { 
    // Valores que não dependem do usuário
    idDaEmpresa: null, 
    statusDaProposta: "ativa",
    isPropostaEnabled: true,
    propostaCriadaPor: "Documento externo",

    // STEP 1
    isNewCliente: true,
    idDoCliente: null,
    nomeDoCliente: "",
    comoPediu: config.COMO_PEDIU_OPTIONS[0].value,
    quemPediu: "",
    idDaProposta: null,
    comentarioDaProposta: '',

    // STEP 4
    isAlertaLigado: true,
    msgDoAlerta: ALERTA_FOLLOWUP_CLIENTE, 
    diasParaAlerta: null,

    // Armazena versões da proposta
    versoesDaProposta: []
  }

  const valoresIniciaisDaVersaoDaProposta = { 
    // Valores que não dependem do usuário
    idDoUsuario: null,
    dataDaVersaoDaProposta: null,

    // STEP 2
    valorDaProposta: null,
    dataDaProposta: null,
    diasDeValidadeDaProposta: null,

    // STEP 3
    arquivoDaProposta: null
  }
  
  const [proposta, setProposta] = useState(valoresIniciaisDaProposta)
  const [versaoDaProposta, setVersaoDaProposta] = useState(valoresIniciaisDaVersaoDaProposta)
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
        setEmpresa(propostasEmLocalStorage.empresa)
        setOperacao(propostasEmLocalStorage.operacao)
        localStorage.removeItem('@appproposta/propostas')
      } else {
        if (id !== undefined) { // Carrega a proposta id
          setOperacao('Atualizar')
          const query = {
            bd: "propostas",
            operador: "get",
            cardinalidade: "one",
            pesquisa: { 
              ['_id']: id
            }
          } 
          db.getGenerico(query, false) 
          .then((resposta) => { 
            setProposta(resposta) 
            setVersaoDaProposta(resposta.versoesDaProposta[resposta.versoesDaProposta.length - 1])
  
            let alertaLigado = false
            let msg = ALERTA_FOLLOWUP_CLIENTE
            if (resposta.hasOwnProperty('msgDoAlerta')) {
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
          })
          .catch((err) => {
            setErro(err)
            setErro(null)
          })  
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
/*           setErro(err)
          setErro(null) */
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
            operacao={operacao}
          />
        </Col>
      </Row>
      <Erro erro={erro} />
    </Fragment>
  )
}
export default EditaProposta
