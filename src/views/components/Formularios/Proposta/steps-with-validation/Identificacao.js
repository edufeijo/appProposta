import * as yup from 'yup'
import { Fragment, useState } from 'react'
import { isObjEmpty, selectThemeColors, capitalizeFirst } from '@utils'
import { useForm  } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, InputGroup } from 'reactstrap'
import { QTDADE_MIN_LETRAS_NOME_DO_USUARIO, QTDADE_MAX_LETRAS_NOME_DO_USUARIO, QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA, QTDADE_MIN_LETRAS_QUEM_PEDIU, QTDADE_MAX_LETRAS_QUEM_PEDIU, QTDADE_MAX_CARACTERES_COMENTARIOS_DA_PROPOSTA } from '../../../../../configs/appProposta'
import config from '../../../../../configs/comoPediuOptions'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../../Toasts/ToastTypes'
import { NomeDoClientePesquisado } from '../../../AutoComplete/NomeDoClientePesquisado'

const NomeDoNovoCliente = ({ proposta, setProposta }) => {
  const SignupSchema = yup.object().shape({
    nomeDoCliente: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_USUARIO).max(QTDADE_MAX_LETRAS_NOME_DO_USUARIO).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const valueCapitalized = capitalizeFirst(value)
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      [name]: valueCapitalized
    }))
  }

  return (
    <div>
      <Label className='form-label' for='nomeDoCliente'>
        Nome do cliente
      </Label>
      <Input
        name='nomeDoCliente'
        id='nomeDoCliente'
        placeholder='Nome do cliente'
        defaultValue={proposta.nomeDoCliente}
        autoComplete="off"
        innerRef={register({ required: true })}
        invalid={errors.nomeDoCliente && true}
        onChange={handleChange}
      />
      {errors && errors.nomeDoCliente && <FormFeedback>Nome do cliente com no mínimo {QTDADE_MIN_LETRAS_NOME_DO_USUARIO} e no máximo {QTDADE_MAX_LETRAS_NOME_DO_USUARIO} caracteres</FormFeedback>}
    </div>
  ) 
}

const Identificacao = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const clienteOptions = [
    { value: true, name: 'isNewCliente', label: 'Novo cliente' },
    { value: false, name: 'isNewCliente', label: 'Sim, cliente cadastrado' }
  ]

  const [labelDeQuemPediu, setLabelDeQuemPediu] = useState(config.COMO_PEDIU_OPTIONS[0].quemPediu)

  const SignupSchema = yup.object().shape({
    idDaProposta: yup.string().max(QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA),
    quemPediu: yup.string().max(QTDADE_MAX_LETRAS_QUEM_PEDIU),
    comentarioDaProposta: yup.string().max(QTDADE_MAX_CARACTERES_COMENTARIOS_DA_PROPOSTA)
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = () => {
    trigger()    
    if (isObjEmpty(errors)) {
      if (proposta.isNewCliente) {
        if (proposta.nomeDoCliente.length < QTDADE_MIN_LETRAS_NOME_DO_USUARIO || proposta.nomeDoCliente.length > QTDADE_MAX_LETRAS_NOME_DO_USUARIO) {
          msgToast = 'Digite o nome do cliente'
          notifyError()  
        } else stepper.next()
      } else {
        if (proposta.idDoCliente === null) {
          msgToast = 'Escolha o cliente cadastrado ou altere para Novo cliente'
          notifyError()
        } else stepper.next()
      }
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      [name]: value
    }))
  }

  const handleChangeSelect = e => {
    const { name, value, quemPediu } = e
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      [name]: value
    }))
    if (name !== 'isNewCliente') setLabelDeQuemPediu(quemPediu)
  }

  return (   
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row> 
          {(operacao === 'Criar') && <FormGroup tag={Col} md='3'>
            <Label>Cliente já cadastrado?</Label>
            <Select
              name='isNewCliente'
              id='isNewCliente'
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              value={proposta.isNewCliente ? clienteOptions[0] : clienteOptions[1]}
              options={clienteOptions}
              isClearable={false}
              onChange={handleChangeSelect}
              disabled={proposta.idDoCliente}
            />
          </FormGroup>}

          {(operacao === 'Criar') && proposta.isNewCliente && <FormGroup tag={Col} md='9'>
            <NomeDoNovoCliente 
              proposta={proposta} 
              setProposta={setProposta} 
            />
          </FormGroup>}
          {(operacao === 'Criar') && !proposta.isNewCliente && <FormGroup tag={Col} md='9'>
            <NomeDoClientePesquisado 
              proposta={proposta} 
              setProposta={setProposta} 
              label='Cliente a ser pesquisado'
              placeHolder='Digite para procurar'
            />
          </FormGroup>}

          {(operacao === 'Criar') && <FormGroup tag={Col} md='12'>
            <Label className='form-label' for='idDaProposta'>
              Identificador da proposta
            </Label>
            <Input
              name='idDaProposta'
              id='idDaProposta'
              placeholder={"Deixe em branco para usar o padrão. Ou digite o identificador da proposta"}
              defaultValue={proposta.idDaProposta}
              autoComplete="off"
              innerRef={register({ required: true })}
              invalid={errors.idDaProposta && true}
              onChange={handleChange}
            />
            {errors && errors.idDaProposta && <FormFeedback>Identificador da proposta com no máximo {QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA} caracteres</FormFeedback>}
          </FormGroup>}

          {(operacao === 'Atualizar') && <FormGroup tag={Col} md='9'>
            <Label className='form-label' for='nomeDoCliente'>
              Nome do cliente
            </Label>
            <Input
              name='nomeDoCliente'
              id='nomeDoCliente'
              value={proposta.nomeDoCliente}
              disabled
            />
          </FormGroup>}
          
          {(operacao === 'Atualizar') && <FormGroup tag={Col} md='3'>
            <Label className='form-label' for='idDaProposta'>
              Identificador da proposta
            </Label>
            <Input
              name='idDaProposta'
              id='idDaProposta'
              defaultValue={proposta.idDaProposta}
              disabled
            />
          </FormGroup>}

          <FormGroup tag={Col} md='3'>
            <Label>Pedido de proposta recebido por:</Label>
            <Select
              name='comoPediu'
              id='comoPediu'
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              options={config.COMO_PEDIU_OPTIONS}
              value={config.COMO_PEDIU_OPTIONS[config.COMO_PEDIU_OPTIONS.findIndex(element => element.value === proposta.comoPediu)]}
              isClearable={false}
              innerRef={register({ required: true })}
              invalid={errors.comoPediu && true}
              onChange={handleChangeSelect}
              autoComplete="off"
            /> 
          </FormGroup>

          {operacao === 'Criar' && labelDeQuemPediu && <FormGroup tag={Col} md='9'>
            <Label className='form-label' for='quemPediu'>
              {config.COMO_PEDIU_OPTIONS[config.COMO_PEDIU_OPTIONS.findIndex(element => element.value === proposta.comoPediu)].quemPediu}
            </Label>
            <Input
              name='quemPediu'
              id='quemPediu'
              placeholder={config.COMO_PEDIU_OPTIONS[config.COMO_PEDIU_OPTIONS.findIndex(element => element.value === proposta.comoPediu)].quemPediu}
              defaultValue={proposta.quemPediu}
              autoComplete="off"
              innerRef={register({ required: true })}
              invalid={errors.quemPediu && true}
              onChange={handleChange}
            />
            {errors && errors.quemPediu && <FormFeedback>Use entre {QTDADE_MIN_LETRAS_QUEM_PEDIU} e {QTDADE_MAX_LETRAS_QUEM_PEDIU} caracteres</FormFeedback>}
          </FormGroup>}

          <FormGroup tag={Col} md='12'>
            <Label className='form-label' for='comentarioDaProposta'>
              Comentários (não aparecem na proposta)
            </Label>
            <InputGroup className='input-group-merge'>
              <Input 
                name='comentarioDaProposta'
                id='comentarioDaProposta'
                defaultValue={proposta.comentarioDaProposta}
                innerRef={register({ required: true })}
                invalid={errors.comentarioDaProposta && true}
                onChange={handleChange}
                type='textarea' 
                placeholder='Comentários sobre a proposta'
              />
              {errors && errors.comentarioDaProposta && <FormFeedback>Máximo de {QTDADE_MAX_CARACTERES_COMENTARIOS_DA_PROPOSTA} caracteres</FormFeedback>}
            </InputGroup>
          </FormGroup>

        </Row>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button.Ripple>
          <Button.Ripple color='primary' className='btn-next' type='submit'>
            <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default Identificacao
