import * as yup from 'yup'
import { Fragment, useState, useEffect } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { ALERTA_FOLLOWUP_CLIENTE, QTDADE_MIN_LETRAS_ALERTA, QTDADE_MAX_LETRAS_ALERTA, QTDADE_MAX_DIAS_PARA_ALERTA } from '../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup, InputGroupAddon, InputGroupText, CustomInput, CardText  } from 'reactstrap'
import moment from 'moment'
import { useHistory } from "react-router-dom"
import Erro from '../../../Erro'
import db from '../../../../../db'
import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast }  from '../../../Toasts/ToastTypes'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'

const ConfiguraTabelaDePrecos = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)
  const history = useHistory()
  const [block, setBlock] = useState(false)
  const [picker, setPicker] = useState(new Date())

  let msgToast = ''
  const notifySuccess = () => toast.success(<SuccessToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

  const Loader = () => {
    return (
      <Fragment>
        <Spinner color='primary' />
        <CardText className='mb-0 mt-3 text-white'>Aguarde...</CardText>
      </Fragment>
    )
  }

  const SignupSchema = yup.object().shape({

  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })  

  const salvaRascunhoPorErroDeConexao = () => {
    localStorage.setItem(
      '@appproposta/tabeladeprecos', 
      JSON.stringify({ 
        tabelaDePrecos, 
        versaoDaTabelaDePrecos, 
        itensDaTabelaDePrecos, 
        dadosInformativosObrigatorios,
        dadosInformativosOpcionais,
        empresa, 
        operacao 
      }))
  }

  const criarVersaoDatabelaDePrecos = () => {
    /* const copiaDaTabelaDeItens = tabelaDeItens.map((item, index, array) => {
      item.precoDoItem = parseFloat(item.precoDoItem.replace(",", "."))
      delete item.erroNoFormulario
      return item
    }) */
    
    const novaVersaoDaTabelaDePrecos = versaoDaTabelaDePrecos
    novaVersaoDaTabelaDePrecos.dataDaVersaoDaTabelaDePrecos = moment().local().format()
    novaVersaoDaTabelaDePrecos.dadosInformativosObrigatorios = Array.from(dadosInformativosObrigatorios)
    novaVersaoDaTabelaDePrecos.dadosInformativosOpcionais = Array.from(dadosInformativosOpcionais)
//    novaVersaoDaTabelaDePrecos.itensDaTabelaDePrecos = Array.from(copiaDaTabelaDeItens) Chamar esta função se alguma conversão for necessária

    const tabelaDePrecosAtualizada = tabelaDePrecos 
    if (tabelaDePrecosAtualizada.statusDaTabelaDePrecos === 'rascunho-temporario') tabelaDePrecosAtualizada.statusDaTabelaDePrecos = 'rascunho'
    else tabelaDePrecosAtualizada.statusDaTabelaDePrecos = 'ativa'

    novaVersaoDaTabelaDePrecos.statusDaVersaoDatabelaDePrecos = tabelaDePrecosAtualizada.statusDaTabelaDePrecos
    if (tabelaDePrecosAtualizada.versoesDaTabelaDePrecos) tabelaDePrecosAtualizada.versoesDaTabelaDePrecos.push(novaVersaoDaTabelaDePrecos)
    else tabelaDePrecosAtualizada.versoesDaTabelaDePrecos = [novaVersaoDaTabelaDePrecos]
    tabelaDePrecosAtualizada.ultimaAtualizacao = novaVersaoDaTabelaDePrecos.dataDaVersaoDaTabelaDePrecos
    
    if (operacao === 'Criar') {
      const novatabelaDePrecos = { // Inclui a nova tabelaDePrecos
        bd: "tabelasDePrecos",
        operador: "post",
        objeto: tabelaDePrecosAtualizada
      } 

      console.log("novatabelaDePrecos=", novatabelaDePrecos)

      db.getGenerico(novatabelaDePrecos, false) 
      .then(async (tabelaDePrecos) => { 
        setBlock(false)
        localStorage.removeItem('@appproposta/tabeladeprecos')
        msgToast = `Tabela de Preços ${tabelaDePrecosAtualizada.setor}/ ${tabelaDePrecosAtualizada.segmento}/ ${tabelaDePrecosAtualizada.servico} registrada com sucesso`
        notifySuccess()
        history.push('/precos/list')
      })
      .catch((err) => {
/*         setErro(err)
        setErro(null)  */
        history.push('/precos/list')
      })       
    } else {
      const idParaAtualizar = tabelaDePrecosAtualizada._id
      delete tabelaDePrecosAtualizada._id

      const objeto = { // Atualiza a tabelaDePrecos
        bd: "tabelasDePrecos",
        operador: "update",
        id: idParaAtualizar,
        objeto: tabelaDePrecosAtualizada
      } 

      db.getGenerico(objeto, false) 
      .then(async (tabelaDePrecos) => { 
        setBlock(false)
        localStorage.removeItem('@appproposta/tabeladeprecos')
        msgToast = `Tabela de Preços ${tabelaDePrecosAtualizada.setor}/ ${tabelaDePrecosAtualizada.segmento}/ ${tabelaDePrecosAtualizada.servico} atualizada com sucesso`
        notifySuccess()
        history.push('/precos/list')
      })
      .catch((err) => {
/*         setErro(err)
        setErro(null)  */
        history.push('/precos/list')
      }) 
    }
  }

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      setBlock(true)
      salvaRascunhoPorErroDeConexao()
      criarVersaoDatabelaDePrecos() 
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
/*     if (name !== 'diasDeValidadeDatabelaDePrecos') {
      settabelaDePrecos(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))
    } else {
      setVersaoDatabelaDePrecos(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))  
    } */
  }

  const handleChangeSwitch = e => {
    const { name, value } = e.target
/*     settabelaDePrecos(registroAnterior => ({
      ...registroAnterior, 
      isAlertaLigado: !tabelaDePrecos.isAlertaLigado
    })) */
  }

  useEffect(() => {
    if (tabelaDePrecos && tabelaDePrecos.statusDaTabelaDePrecos === 'rascunho-temporario') {
      salvaRascunhoPorErroDeConexao()
      criarVersaoDatabelaDePrecos() 
    } 
  }, [tabelaDePrecos.statusDaTabelaDePrecos])

  return (
    <UILoader blocking={block} loader={<Loader />}>
      {tabelaDePrecos && tabelaDePrecos.statusDaTabelaDePrecos !== 'rascunho-temporario' && <Fragment>
        <Form>
          <Row>
            <h1>Olá</h1>
          </Row>
          <div className='d-flex justify-content-between'>
            <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
            </Button.Ripple>
            <Button.Ripple color='primary' className='btn-next' onClick={() => onSubmit()}>
              {operacao} Tabela de Preços
            </Button.Ripple>
          </div>
        </Form>
        <Erro erro={erro} />
      </Fragment>}
    </UILoader>
  )
}

export default ConfiguraTabelaDePrecos
