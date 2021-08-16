import * as yup from 'yup'
import { Fragment, useState, useEffect } from 'react'
import { isObjEmpty, selectThemeColors, capitalizeFirst } from '@utils'
import { useForm  } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Label, Input, FormGroup, Row, Col, Button, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, InputGroup } from 'reactstrap'
import { QTDADE_MIN_LETRAS_NOME_DO_USUARIO, QTDADE_MAX_LETRAS_NOME_DO_USUARIO, QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA, QTDADE_MIN_LETRAS_QUEM_PEDIU, QTDADE_MAX_LETRAS_QUEM_PEDIU, SETOR_SEGMENTO_SERVICO } from '../../../../../configs/appProposta'
import config from '../../../../../configs/comoPediuOptions'
import Select, { components } from 'react-select'
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

const Segmentacao = ({ userData, empresa, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, template, operacao, stepper, type }) => {
  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const [active, setActive] = useState('1')
  const toggle = tab => {
    setActive(tab)
  }

  const preencheArrayToSelect = (arrayToSelect, tipo) => {
    const SELECIONE_OPCAO =   {
      name: `${tipo}`,
      label: `Selecione o ${tipo} do seu negócio`,
      value: `Selecione o ${tipo} do seu negócio`,
      type: `nao-escolhido`
    }
    const CRIA_OPCAO =   {
      name: `${tipo}`,
      label: `Crie um ${tipo} específico para o seu negócio`,
      value: `Crie um ${tipo} específico para o seu negócio`,
      type: `customizado`
    }
    let arrayTemporary = []

    arrayTemporary.push(SELECIONE_OPCAO)
    arrayTemporary = arrayTemporary.concat(arrayToSelect)
    arrayTemporary.push(CRIA_OPCAO)
    return arrayTemporary
  }

  const [arrayToSelectSetor, setArrayToSelectSetor] = useState([])
  const [arrayToSelectSegmento, setArrayToSelectSegmento] = useState([])
  const [arrayToSelectServico, setArrayToSelectServico] = useState([])

  useEffect(() => {
    if (arrayToSelectSetor.length === 0) {
      const temporaryArray = preencheArrayToSelect(SETOR_SEGMENTO_SERVICO, "setor")
      setArrayToSelectSetor(temporaryArray)
    }
  }, [])

  const SignupSchema = yup.object().shape({
    idDaProposta: yup.string().max(QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA),
    quemPediu: yup.string().max(QTDADE_MAX_LETRAS_QUEM_PEDIU)
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

  const handleChangeSelect = e => {
    const { name, label, value, type } = e
    if (type === "opcao") {
      setTabelaDePrecos(registroAnterior => ({
        ...registroAnterior, 
        [name]: value
      }))
      if (name === 'setor') {
        const index = arrayToSelectSetor.findIndex(element => element.label === label)
        const temporaryArray = preencheArrayToSelect(arrayToSelectSetor[index].segmentos, "segmento")
        setArrayToSelectSegmento(temporaryArray)
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          segmento: null,
          servico: null,
          setorCustomizado: false
        }))
      } else 
      if (name === 'segmento') {
        const index = arrayToSelectSegmento.findIndex(element => element.label === label)
        const temporaryArray = preencheArrayToSelect(arrayToSelectSegmento[index].servicos, "servico")
        setArrayToSelectServico(temporaryArray) 
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          servico: null,
          segmentoCustomizado: false
        }))
      } else 
      if (name === 'servico') {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          servicoCustomizado: false
        }))
      }
    } else {
      let customizado = false
      if (type === 'customizado') customizado = true
      
      if (name === 'setor') {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          setor: null,
          setorCustomizado: customizado,
          segmento: null,
          servico: null
        }))
      }  
      if (name === 'segmento') {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          segmento: null,
          segmentoCustomizado: customizado,
          servico: null
        }))
      }  
      if (name === 'servico') {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          servico: null,
          servicoCustomizado: customizado
        }))
      }
    }
  }

  const onFill = () => {
    toggle('1')
  }

  const onTabelaExterna = () => {
    toggle('2')
  }

  console.log("==================== No Segmentacao")
  console.log("tabelaDePrecos=", tabelaDePrecos)
  console.log("versaoDaTabelaDePrecos=", versaoDaTabelaDePrecos)
  console.log("itensDaTabelaDePrecos=", itensDaTabelaDePrecos) 
  console.log("arrayToSelectSetor=", arrayToSelectSetor) 
  console.log("arrayToSelectSegmento=", arrayToSelectSegmento) 
  console.log("arrayToSelectServico=", arrayToSelectServico) 

  return (   
    <Fragment>
      <Nav className='justify-content-end' pills>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              onFill()
            }}
          >
            Segmentar
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              onTabelaExterna()
            }}
          >
            Usar tabela externa
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
            <FormGroup tag={Col} md='6'>
              <Label>Setor:</Label>
              <Select
                name='setor'
                id='setor'
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={arrayToSelectSetor}
                isClearable={false}
                value={tabelaDePrecos.setorCustomizado ? arrayToSelectSetor[arrayToSelectSetor.length - 1] :  tabelaDePrecos.setor === null ? arrayToSelectSetor[0] : arrayToSelectSetor[arrayToSelectSetor.findIndex(element => element.label === tabelaDePrecos.setor)]}
                innerRef={register({ required: true })}
                invalid={errors.comoPediu && true}
                onChange={handleChangeSelect}
                autoComplete="off"
              /> 
            </FormGroup>
            {tabelaDePrecos.setor && <FormGroup tag={Col} md='6'>
              <div key={tabelaDePrecos.setor}>
                <Label>Segmento:</Label>
                <Select
                  name='segmento'
                  id='segmento'
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={arrayToSelectSegmento}
                  isClearable={false}
                  value={tabelaDePrecos.segmentoCustomizado ? arrayToSelectSegmento[arrayToSelectSegmento.length - 1] : tabelaDePrecos.segmento === null ? arrayToSelectSegmento[0] : arrayToSelectSegmento[arrayToSelectSegmento.findIndex(element => element.label === tabelaDePrecos.segmento)]}
                  innerRef={register({ required: true })}
                  invalid={errors.comoPediu && true}
                  onChange={handleChangeSelect}
                  autoComplete="off"
                /> 
              </div>
            </FormGroup>}
            {tabelaDePrecos.setor && tabelaDePrecos.segmento && <FormGroup tag={Col} md='6'>
              <div key={tabelaDePrecos.segmento}>            
                <Label>Serviço:</Label>
                <Select
                  name='servico'
                  id='servico'
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={arrayToSelectServico}
                  isClearable={false}
                  value={tabelaDePrecos.servicoCustomizado ? arrayToSelectServico[arrayToSelectServico.length - 1] : tabelaDePrecos.servico === null ? arrayToSelectServico[0] : arrayToSelectServico[arrayToSelectServico.findIndex(element => element.label === tabelaDePrecos.servico)]}
                  innerRef={register({ required: true })}
                  invalid={errors.comoPediu && true}
                  onChange={handleChangeSelect}
                  autoComplete="off"
                /> 
              </div>
            </FormGroup>}

        </TabPane>
        <TabPane tabId='2'>
          Parametriza como tabela externa
        </TabPane>
      </TabContent>

      <Form onSubmit={handleSubmit(onSubmit)}>
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

export default Segmentacao
