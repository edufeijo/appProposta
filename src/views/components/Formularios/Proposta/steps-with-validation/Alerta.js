import * as yup from 'yup'
import { Fragment, useState } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { ALERTA_FOLLOWUP_CLIENTE, QTDADE_MIN_LETRAS_ALERTA, QTDADE_MAX_LETRAS_ALERTA, QTDADE_MAX_DIAS_PARA_ALERTA, DIAS_MAX_VALIDADE_DA_PROPOSTA } from '../../../../../configs/appProposta'
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
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'

const Alerta = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao, stepper, type }) => {
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
    msgDoAlerta: yup.string().min(QTDADE_MIN_LETRAS_ALERTA).max(QTDADE_MAX_LETRAS_ALERTA),
    diasParaAlerta: yup.number().positive().integer().max(QTDADE_MAX_DIAS_PARA_ALERTA),
    diasDeValidadeDaProposta: yup.number().positive().integer().max(DIAS_MAX_VALIDADE_DA_PROPOSTA)
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })  

  const salvaRascunhoPorErroDeConexao = () => {
    localStorage.setItem('@appproposta/propostas', JSON.stringify({ proposta, versaoDaProposta, empresa, operacao }))
  }

  const criarProposta = (idDoCliente) => {
    const novaVersaoDaProposta = versaoDaProposta

    novaVersaoDaProposta.dataDaVersaoDaProposta = moment().local().format()
    if (versaoDaProposta.dataDaProposta === null) novaVersaoDaProposta.dataDaProposta = moment().local().format()
    if (versaoDaProposta.diasDeValidadeDaProposta === null) novaVersaoDaProposta.venceEm = moment(novaVersaoDaProposta.dataDaProposta).add(empresa.config.diasDeValidadeDaProposta, 'days').format() 
    else novaVersaoDaProposta.venceEm = moment(novaVersaoDaProposta.dataDaProposta).add(parseInt(versaoDaProposta.diasDeValidadeDaProposta), 'days').format() 
    delete novaVersaoDaProposta.diasDeValidadeDaProposta
    novaVersaoDaProposta.valorDaProposta = parseFloat(versaoDaProposta.valorDaProposta.replace(",", "."))

    const propostaAtualizada = proposta 
    if (proposta.isAlertaLigado) {
      if (proposta.diasParaAlerta === null) propostaAtualizada.alertaEm = moment().local().add(empresa.config.diasParaAlerta, 'days').format()
      else propostaAtualizada.alertaEm = moment().local().add(proposta.diasParaAlerta, 'days').format()
      if (proposta.msgDoAlerta === null) propostaAtualizada.msgDoAlerta = ALERTA_FOLLOWUP_CLIENTE
    } else {
      propostaAtualizada.alertaEm = null
      delete propostaAtualizada.msgDoAlerta
    }

    if (moment(novaVersaoDaProposta.venceEm).isBefore(moment().local().format())) {
      propostaAtualizada.statusDaProposta = 'vencida'
      propostaAtualizada.alertaEm = null
      delete propostaAtualizada.msgDoAlerta
    } else propostaAtualizada.statusDaProposta = 'ativa'
    
    delete propostaAtualizada.diasParaAlerta
    delete propostaAtualizada.isAlertaLigado
    delete propostaAtualizada.isNewCliente
    delete propostaAtualizada.quemPediu

    propostaAtualizada.avatar = ''

    propostaAtualizada.versoesDaProposta.push(novaVersaoDaProposta)
    propostaAtualizada.idDoCliente = idDoCliente
    propostaAtualizada.valorDaProposta = novaVersaoDaProposta.valorDaProposta // O valor da proposta é duplicado no objeto
    propostaAtualizada.ultimaAtualizacao = novaVersaoDaProposta.dataDaVersaoDaProposta 

    if (operacao === 'Criar') {
      if (propostaAtualizada.idDoCliente !== null) {
        const regex = { $regex: "\\b\\d+\\b" } // equivamente a /\b\d+\b/, somente aceita números
        const procuraEOrdena = { // Encontra o id da última proposta criada
          bd: "propostas",
          operador: "sort",
          pesquisa: { idDaEmpresa: propostaAtualizada.idDaEmpresa, idDaProposta: regex }, 
          ordenadoPor: { idDaProposta: -1 }, // em ordem decrescente
          sortStringAsNumber: true, // ordena campo string (idDaProposta) como se forsse numérico
          cardinalidade: 1 // retorna somente 1 ocorrência
        } 
        db.getGenerico(procuraEOrdena, false) 
        .then(async (ultimaProposta) => {  
          if (!propostaAtualizada.idDaProposta) {
            if (ultimaProposta.length) propostaAtualizada.idDaProposta = String(parseInt(ultimaProposta[0].idDaProposta) + 1)
            else propostaAtualizada.idDaProposta = '1'
          }
  
          const novaProposta = { // Inclui a nova proposta
            bd: "propostas",
            operador: "post",
            objeto: propostaAtualizada
          } 
  
          db.getGenerico(novaProposta, false) 
          .then(async (proposta) => { 
            setBlock(false)
            localStorage.removeItem('@appproposta/propostas')
            msgToast = `Proposta ${propostaAtualizada.idDaProposta} para o cliente ${propostaAtualizada.nomeDoCliente} registrada com sucesso`
            notifySuccess()
            history.push('/proposta/list')
          })
          .catch((err) => {
/*             setErro(err)
            setErro(null) */
            history.push('/proposta/list')
          }) 
        })
        .catch((err) => {
/*           setErro(err)
          setErro(null) */
          history.push('/proposta/list')
        }) 
      } else {
        msgToast = 'Erro de conexão ao servidor. Tente novamente mais tarde (idDoCliente)'
        notifyError()
        history.push('/proposta/list')
      }
    } else {
      const idParaAtualizar = propostaAtualizada._id
      delete propostaAtualizada._id

      const objeto = { // Atualiza a proposta
        bd: "propostas",
        operador: "update",
        id: idParaAtualizar,
        objeto: propostaAtualizada
      } 

      db.getGenerico(objeto, false) 
      .then(async (proposta) => { 
        setBlock(false)
        localStorage.removeItem('@appproposta/propostas')
        msgToast = `Proposta ${propostaAtualizada.idDaProposta} para o cliente ${propostaAtualizada.nomeDoCliente} atualizada com sucesso`
        notifySuccess()
        history.push('/proposta/list')
      })
      .catch((err) => {
/*         setErro(err)
        setErro(null) */
        history.push('/proposta/list')
      }) 
    }
  }

  const criarCliente = () => {
    trigger()
    if (proposta.isNewCliente) {
      let contatosDoCliente = {}
      if (proposta.quemPediu.length !== 0) {
        contatosDoCliente = { [proposta.comoPediu]: proposta.quemPediu }
      }

      const novoCliente = { // Inclui o novo cliente
        bd: "clientes",
        operador: "post",
        objeto: {  
          nomeDoCliente: proposta.nomeDoCliente,
          idDaEmpresa: proposta.idDaEmpresa,
          dataDeRegistroDoCliente: moment().local().format(),
          idDoUsuario: userData._id,
          nomeDoUsuario: userData.nomeDoUsuario,
          contatos: contatosDoCliente
        }
      } 
      db.getGenerico(novoCliente, false) 
      .then(async (cliente) => {          
        criarProposta(cliente.insertedId) 
      })
      .catch((err) => {
/*         setErro(err)
        setErro(null) */
        history.push('/proposta/list')
      }) 
    } else {
      criarProposta(proposta.idDoCliente) 
    }
  }

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      setBlock(true)
      salvaRascunhoPorErroDeConexao()
      if (operacao === 'Criar') {
        criarCliente()
      } else {
        criarProposta(proposta.idDoCliente) 
      }
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    if (name !== 'diasDeValidadeDaProposta') {
      setProposta(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))
    } else {
      setVersaoDaProposta(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))  
    }
  }

  const handleChangeSwitch = e => {
    const { name, value } = e.target
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      isAlertaLigado: !proposta.isAlertaLigado
    }))
  }

  return (
    <UILoader blocking={block} loader={<Loader />}>
      <Fragment>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>

            <FormGroup tag={Col} md='9'>
              <Label className='form-label' for='dataDaProposta'>
                Data de emissão da proposta
              </Label>
              <Flatpickr
                value={picker}
                name='dataDaProposta'
                id='dataDaProposta'
                className='form-control'
                onChange={date => {
                  setPicker(date)  
                  setVersaoDaProposta(registroAnterior => ({
                    ...registroAnterior, 
                    dataDaProposta: moment(date[0]).local().format()
                  }))
                }
                }
                placeholder={moment(picker).format('DD/MM/YYYY')}
                options={{
                  altInput: true,
                  altFormat: 'd/m/Y',
                  dateFormat: 'd-m-Y',
                  maxDate: 'today',
                  minDate: '01.01.2021',
                  locale: Portuguese
                }}
              />
            </FormGroup> 

            {empresa && <FormGroup tag={Col} md='3'>
              <Label className='form-label' for='diasDeValidadeDaProposta'>
                Proposta válida por
              </Label>
              <InputGroup className='input-group-merge mb-2'>
                <Input
                  name='diasDeValidadeDaProposta'
                  id='diasDeValidadeDaProposta'
                  defaultValue={empresa.config.diasDeValidadeDaProposta}
                  autoComplete="off"
                  innerRef={register({ required: true })}
                  invalid={errors.diasDeValidadeDaProposta && true}
                  onChange={handleChange}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>dias</InputGroupText>
                </InputGroupAddon>
                {errors && errors.diasDeValidadeDaProposta && <FormFeedback>Deve ser um número maior que zero e menor que {DIAS_MAX_VALIDADE_DA_PROPOSTA}</FormFeedback>}
              </InputGroup>
            </FormGroup>}

            {operacao === 'Criar' && proposta && <FormGroup tag={Col} md='2'>
              <Label className='form-label' for='isAlertaLigado'>
                Alerta ligado?
              </Label>
              <div>
                <CustomInput
                  type='switch'
                  id='isAlertaLigado'
                  name='isAlertaLigado'
                  inline
                  defaultChecked
                  onChange={handleChangeSwitch}
                />
              </div>
            </FormGroup>}
            {operacao === 'Atualizar' && proposta && proposta.isAlertaLigado && <FormGroup tag={Col} md='2'>
              <Label className='form-label' for='isAlertaLigado'>
                Alerta ligado?
              </Label>
              <div>
                <CustomInput
                  type='switch'
                  id='isAlertaLigado'
                  name='isAlertaLigado'
                  inline
                  defaultChecked
                  onChange={handleChangeSwitch}
                />
              </div>
            </FormGroup>}
            {operacao === 'Atualizar' && proposta && !proposta.isAlertaLigado && <FormGroup tag={Col} md='2'>
              <Label className='form-label' for='isAlertaDesLigado'>
                Alerta ligado?
              </Label>
              <div>
                <CustomInput
                  type='switch'
                  id='isAlertaDesLigado'
                  name='isAlertaDesLigado'
                  inline
                  onChange={handleChangeSwitch}
                />
              </div>
            </FormGroup>}

            {operacao === 'Criar' && proposta && <FormGroup tag={Col} md='7'>
              <Label className='form-label' for='msgDoAlerta'>
                Mensagem do alerta
              </Label>
              <Input
                name='msgDoAlerta'
                id='msgDoAlerta'
                defaultValue={proposta.msgDoAlerta}
                autoComplete="off"
                innerRef={register({ required: true })}
                invalid={errors.msgDoAlerta && true}
                onChange={handleChange}
                disabled={!proposta.isAlertaLigado}
              />
              {errors && errors.msgDoAlerta && <FormFeedback>Mensagem do alerta com no mínimo {QTDADE_MIN_LETRAS_ALERTA} e no máximo {QTDADE_MAX_LETRAS_ALERTA} caracteres</FormFeedback>}
            </FormGroup>}
            {operacao === 'Atualizar' && proposta && <FormGroup tag={Col} md='7'>
              <Label className='form-label' for='msgDoAlerta'>
                Mensagem do alerta
              </Label>
              <Input
                name='msgDoAlerta'
                id='msgDoAlerta'
                value={proposta.msgDoAlerta}
                autoComplete="off"
                innerRef={register({ required: true })}
                invalid={errors.msgDoAlerta && true}
                onChange={handleChange}
                disabled={!proposta.isAlertaLigado}
              />
              {errors && errors.msgDoAlerta && <FormFeedback>Mensagem do alerta com no mínimo {QTDADE_MIN_LETRAS_ALERTA} e no máximo {QTDADE_MAX_LETRAS_ALERTA} caracteres</FormFeedback>}
            </FormGroup>}

            {proposta && empresa && <FormGroup tag={Col} md='3'>
              <Label className='form-label' for='diasParaAlerta'>
                Dias para alerta
              </Label>
              <InputGroup className='input-group-merge mb-2'>
                <Input
                  name='diasParaAlerta'
                  id='diasParaAlerta'
                  defaultValue={empresa.config.diasParaAlerta}
                  innerRef={register({ required: true })}
                  invalid={errors.diasParaAlerta && true} 
                  onChange={handleChange}
                  disabled={!proposta.isAlertaLigado}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>dias</InputGroupText>
                </InputGroupAddon>
                {errors && errors.diasParaAlerta && <FormFeedback>Deve ser um número maior que zero e menor que {QTDADE_MAX_DIAS_PARA_ALERTA}</FormFeedback>}
              </InputGroup>
            </FormGroup>}

          </Row>
          <div className='d-flex justify-content-between'>
            <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
            </Button.Ripple>
            <Button.Ripple type='submit' color='primary' className='btn-submit'>
              {operacao} proposta
            </Button.Ripple>
          </div>
        </Form>
        <Erro erro={erro} />
      </Fragment>
    </UILoader>
  )
}

export default Alerta
