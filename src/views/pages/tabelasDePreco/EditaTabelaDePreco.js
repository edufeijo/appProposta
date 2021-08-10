import { Fragment, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import FormularioDeTabelaDePrecos from '../../components/Formularios/TabelaDePrecos/FormularioDeTabelaDePrecos'
import { isUserLoggedIn } from '@utils'
import db from '../../../db'
import { VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA, VALORES_INICIAIS_DA_PROPOSTA, VALORES_INICIAIS_DA_TABELA_DE_PRECOS, VALORES_INICIAIS_DA_VERSAO_DA_TABELA_DE_PRECOS } from '../../../configs/appProposta'
import Erro from '../../components/Erro'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'

const EditaTabelaDePreco = () => {
  const { id, rascunho } = useParams()
  const [erro, setErro] = useState(null)
  const history = useHistory()
  
  // ITENS ABAIXO DEVEM SER EXCLUIDOS
  const [proposta, setProposta] = useState(Object.assign({}, VALORES_INICIAIS_DA_PROPOSTA))
  const [versaoDaProposta, setVersaoDaProposta] = useState(Object.assign({}, VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA))
  const VALORES_INICIAIS_DO_ITEM = { 
    nomeDoItem: '', 
    precoDoItem: null, 
    descricaoDoItem: '',
    erroNoFormulario: {
      nomeDoItem: true, 
      precoDoItem: true
    }
  }
  const [tabelaDeItens, setTabelaDeItens] = useState([Object.assign({}, VALORES_INICIAIS_DO_ITEM)])
  const [template, setTemplate] = useState(null)

  const VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS = { 
    nomeDoItem: ''/* , 
    precoDoItem: null, 
    descricaoDoItem: '',
    erroNoFormulario: {
      nomeDoItem: true, 
      precoDoItem: true
    } */
  }

  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)

  const [empresa, setEmpresa] = useState(null)
  const [tabelaDePrecos, setTabelaDePrecos] = useState(Object.assign({}, VALORES_INICIAIS_DA_TABELA_DE_PRECOS))
  const [versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos] = useState(Object.assign({}, VALORES_INICIAIS_DA_VERSAO_DA_TABELA_DE_PRECOS))
  const [itensDaTabelaDePrecos, setItensDaTabelaDePrecos] = useState([Object.assign({}, VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS)])
  const [operacao, setOperacao] = useState('Criar')

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, [])

  useEffect(() => {
    if (userDataCarregado) {
      if (rascunho === '1') { // rascunho da Tabela de Preços está gravada em Local Storage
        const tabelaDePrecosEmLocalStorage = JSON.parse(localStorage.getItem('@appproposta/tabeladeprecos'))
        if (tabelaDePrecosEmLocalStorage !==  null) {
          setTabelaDePrecos(tabelaDePrecosEmLocalStorage.tabelaDePrecos)
          setVersaoDaTabelaDePrecos(tabelaDePrecosEmLocalStorage.versaoDaTabelaDePrecos)
          setItensDaTabelaDePrecos(tabelaDePrecosEmLocalStorage.itensDaTabelaDePrecos)
          setEmpresa(propostasEmLocalStorage.empresa)
          setOperacao(propostasEmLocalStorage.operacao)  
          localStorage.removeItem('@appproposta/tabeladeprecos')
        } else history.push('/precos/list')
      } else {
        if (id !== undefined) { // Carrega a Tabela de Preços id
          if (id.length !== 24) {
            msgToast = 'Tabela de Preços não encontrada. Preencha o formulário para criar uma nova tabela'
            notifyError()
          } else {
            const query = {
              bd: "tabelasDePrecos",
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
                // O TRECHO ABAIXO DEVERÁ SER ADAPTADO PARA TABELA DE PRECOS

/*                 setProposta(resposta) 
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

                const copiaDaTabelaDeItens = Array.from(resposta.versoesDaProposta[resposta.versoesDaProposta.length - 1].itensDaVersaoDaProposta)
                const tabelaDeItensString = copiaDaTabelaDeItens.map((item, index, array) => {
                  const copiaDoItem = {}
                  copiaDoItem.nomeDoItem = item.nomeDoItem
                  copiaDoItem.precoDoItem = String(item.precoDoItem).replace(".", ",")
                  copiaDoItem.descricaoDoItem = item.descricaoDoItem
                  copiaDoItem.erroNoFormulario = {}
                  return copiaDoItem
                })  
                setTabelaDeItens(tabelaDeItensString)   */
              } else {
                msgToast = 'Tabela de Preços não encontrada. Preencha o formulário para criar uma nova tabela'
                notifyError()
              }
            })
            .catch((err) => {
  /*             setErro(err)
              setErro(null) */
            })  
          }
        }

        const queryEmpresa = { // Carrega es informações da empresa
          bd: "empresas",
          operador: "get",
          cardinalidade: "one",
          pesquisa: { 
            ['_id']: userData.idDaEmpresa 
          }
        } 
        db.getGenerico(queryEmpresa, false) 
        .then((resposta) => { 
          setEmpresa(resposta) 
          setTabelaDePrecos(registroAnterior => ({
            ...registroAnterior, 
            idDaEmpresa: userData.idDaEmpresa,
            nomeDaEmpresa: userData.nomeDaEmpresa
          })) 
          setVersaoDaTabelaDePrecos(registroAnterior => ({
            ...registroAnterior, 
            idDoUsuario: userData._id,
            nomeDoUsuario: userData.nomeDoUsuario
          }))
        })
        .catch((err) => {
/*           msgToast = 'Você está sem conexão com o servidor. Tente novamente mais tarde'
          notifyError() */
          history.push('/precos/list')
        }) 
      }
    }
  }, [userDataCarregado]) 
    
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <FormularioDeTabelaDePrecos 
            userData={userData} 
            empresa={empresa} 
            operacao={operacao}
            tabelaDePrecos={tabelaDePrecos}
            setTabelaDePrecos={setTabelaDePrecos}
            versaoDaTabelaDePrecos={versaoDaTabelaDePrecos}
            setVersaoDaTabelaDePrecos={setVersaoDaTabelaDePrecos}
            itensDaTabelaDePrecos={itensDaTabelaDePrecos}
            setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}

            // as props abaixo devem ser excluídas
            proposta={proposta} 
            setProposta={setProposta} 
            versaoDaProposta={versaoDaProposta}
            setVersaoDaProposta={setVersaoDaProposta}
            tabelaDeItens={tabelaDeItens}
            setTabelaDeItens={setTabelaDeItens}
            template={template}
          />
        </Col>
      </Row>
      <Erro erro={erro} />
    </Fragment>
  )
}
export default EditaTabelaDePreco
