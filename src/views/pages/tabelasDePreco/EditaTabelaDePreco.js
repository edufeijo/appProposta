import { Fragment, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import FormularioDeTabelaDePrecos from '../../components/Formularios/TabelaDePrecos/FormularioDeTabelaDePrecos'
import { isUserLoggedIn } from '@utils'
import db from '../../../db'
import Erro from '../../components/Erro'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../components/Toasts/ToastTypes'
import { VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA, VALORES_INICIAIS_DA_PROPOSTA } from '../../../configs/appProposta'

const EditaTabelaDePreco = () => {
  const { id, rascunho } = useParams()
  const [erro, setErro] = useState(null)
  const history = useHistory()

  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

  const VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS = { 
    nomeDoItem: null,
    itemHabilitado: true,
    itemObrigatorioNaProposta: false,
    itemAbertoNoFormulario: true,
    errors: {
      nomeDoItem: true
    } 
  }

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)

  const [empresa, setEmpresa] = useState(null)
  const [todasAsTabelaDePrecos, setTodasAsTabelaDePrecos] = useState([])
  const [tabelaDePrecos, setTabelaDePrecos] = useState({})
  const [versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos] = useState({})  
  const [dadosInformativosOpcionais, setDadosInformativosOpcionais] = useState([])
  const [dadosInformativosObrigatorios, setDadosInformativosObrigatorios] = useState([])
  const [itensDaTabelaDePrecos, setItensDaTabelaDePrecos] = useState([VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS])
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
          setDadosInformativosObrigatorios(tabelaDePrecosEmLocalStorage.dadosInformativosObrigatorios)
          setDadosInformativosOpcionais(tabelaDePrecosEmLocalStorage.dadosInformativosOpcionais)
          setEmpresa(tabelaDePrecosEmLocalStorage.empresa)
          setOperacao(tabelaDePrecosEmLocalStorage.operacao)  
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
                setTabelaDePrecos(resposta) 
                setVersaoDaTabelaDePrecos(resposta.versoesDaTabelaDePrecos[resposta.versoesDaTabelaDePrecos.length - 1]) 
                setDadosInformativosObrigatorios(resposta.versoesDaTabelaDePrecos[resposta.versoesDaTabelaDePrecos.length - 1].dadosInformativosObrigatorios)
                setDadosInformativosOpcionais(resposta.versoesDaTabelaDePrecos[resposta.versoesDaTabelaDePrecos.length - 1].dadosInformativosOpcionais)
                setOperacao('Atualizar')

/*                 const copiaDaTabelaDeItens = Array.from(resposta.versoesDaProposta[resposta.versoesDaProposta.length - 1].itensDaVersaoDaProposta)
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
          if (id === undefined) {
            setTabelaDePrecos(registroAnterior => ({
              ...registroAnterior, 
              setor: null,
              segmento: null,
              servico: null,
              setorCustomizado: false,
              segmentoCustomizado: false,
              servicoCustomizado: false
            })) 
          }
          setVersaoDaTabelaDePrecos(registroAnterior => ({
            ...registroAnterior, 
            idDoUsuario: userData._id,
            nomeDoUsuario: userData.nomeDoUsuario
          }))
        })
        .catch((err) => {
          history.push('/precos/list')
        }) 
      }
      const queryTabelas = { 
        bd: "tabelasDePrecos",
        operador: "get",
        cardinalidade: "all",
        pesquisa: { 
          idDaEmpresa: userData.idDaEmpresa 
        }
      } 
      db.getGenerico(queryTabelas, false) 
      .then((resposta) => { 
        setTodasAsTabelaDePrecos(resposta)
        localStorage.removeItem('@appproposta/tabeladeprecos')
      })
      .catch((err) => {
        history.push('/precos/list')
      }) 
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
            todasAsTabelaDePrecos={todasAsTabelaDePrecos}
            tabelaDePrecos={tabelaDePrecos}
            setTabelaDePrecos={setTabelaDePrecos}
            versaoDaTabelaDePrecos={versaoDaTabelaDePrecos}
            setVersaoDaTabelaDePrecos={setVersaoDaTabelaDePrecos}
            itensDaTabelaDePrecos={itensDaTabelaDePrecos}
            setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}
            dadosInformativosOpcionais={dadosInformativosOpcionais}
            setDadosInformativosOpcionais={setDadosInformativosOpcionais}
            dadosInformativosObrigatorios={dadosInformativosObrigatorios}
            setDadosInformativosObrigatorios={setDadosInformativosObrigatorios}
          />
        </Col>
      </Row>
      <Erro erro={erro} />
    </Fragment>
  )
}
export default EditaTabelaDePreco
