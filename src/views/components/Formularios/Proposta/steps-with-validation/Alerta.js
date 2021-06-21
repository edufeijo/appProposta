import * as yup from 'yup'
import { Fragment, useState } from 'react'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { ALERTA_FOLLOWUP_CLIENTE, QTDADE_MIN_LETRAS_ALERTA, QTDADE_MAX_LETRAS_ALERTA, QTDADE_MAX_DIAS_PARA_ALERTA } from '../../../../../configs/appProposta'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup, InputGroupAddon, InputGroupText, CustomInput  } from 'reactstrap'
import moment from 'moment'
import { useHistory } from "react-router-dom"
import Erro from '../../../Erro'
import db from '../../../../../db'
import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast }  from '../../../Toasts/ToastTypes'

const Alerta = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)
  const history = useHistory()

  let msgToast = ''
  const notifySuccess = () => toast.success(<SuccessToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const SignupSchema = yup.object().shape({
    msgDoAlerta: yup.string().min(QTDADE_MIN_LETRAS_ALERTA).max(QTDADE_MAX_LETRAS_ALERTA),
    diasParaAlerta: yup.number().positive().integer().max(QTDADE_MAX_DIAS_PARA_ALERTA)
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
    console.log("proposta=", proposta)
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      [name]: value
    }))
  }

  const handleChangeSwitch = e => {
    const { name, value } = e.target
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      isAlertaLigado: !proposta.isAlertaLigado
    }))
  }

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
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
  )
}

export default Alerta
