import { useState, useEffect, Fragment } from 'react'
import { ArrowLeft, ArrowRight, Upload, Plus, Save, Trash } from 'react-feather'
import { Button, Label, Input, Row, Col, FormFeedback, Form, InputGroup, InputGroupAddon, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, CardText, FormGroup } from 'reactstrap'
import '@styles/react/apps/app-invoice.scss'
import Erro from '../../../../Erro'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM } from '../../../../../../configs/appProposta'
import { isObjEmpty } from '@utils'
import PropostaExterna from './PropostaExterna'
import Repeater from '@components/repeater'
import { SlideDown } from 'react-slidedown'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../../../Toasts/ToastTypes'

const NomeDoNovoItem = ({ index, tabelaDeItens, setTabelaDeItens }) => {
  const SignupSchema = yup.object().shape({
    [`nomeDoItem${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(tabelaDeItens)
    temporaryarray[index].nomeDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoFormulario.nomeDoItem
    else temporaryarray[index].erroNoFormulario.nomeDoItem = true   
 
    setTabelaDeItens(temporaryarray)
  }

  const defaultValue = tabelaDeItens[index].nomeDoItem

  return (
    <div>
      <Label className='form-label' for={`nomeDoItem${index}`}>
        Nome do item
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <Input
          name={`nomeDoItem${index}`}
          id={`nomeDoItem${index}`}
          placeholder='Nome do item'
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`nomeDoItem${index}`] && true}
          onChange={handleChange}
        />
      {errors && errors[`nomeDoItem${index}`] && <FormFeedback>Nome do item com no mínimo {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e no máximo {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</FormFeedback>}
      </InputGroup>
    </div>
  ) 
}

const PrecoDoNovoItem = ({ index, tabelaDeItens, setTabelaDeItens }) => {
  const SignupSchema = yup.object().shape({
    [`precoDoItem${index}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(tabelaDeItens)
    temporaryarray[index].precoDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoFormulario.precoDoItem
    else temporaryarray[index].erroNoFormulario.precoDoItem = true   

    setTabelaDeItens(temporaryarray)
  }

  const defaultValue = tabelaDeItens[index].precoDoItem

  return (
    <div>
      <Label className='form-label' for={`precoDoItem${index}`}>
        Preço do item
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <Input
          name={`precoDoItem${index}`}
          id={`precoDoItem${index}`}
          placeholder={"1000,00"}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`precoDoItem${index}`] && true}
          onChange={handleChange}
        />
        {errors && errors[`precoDoItem${index}`] && <FormFeedback>Exemplos: 1244 ou 283,15, máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } dígitos</FormFeedback>}
      </InputGroup>
      </div>
  )
}

const DescricaoDoNovoItem = ({ index, tabelaDeItens, setTabelaDeItens })  => {
  const SignupSchema = yup.object().shape({
    [`descricaoDoItem${index}`]: yup.string().max(QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM)
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(tabelaDeItens)
    temporaryarray[index].descricaoDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoFormulario.descricaoDoItem
    else temporaryarray[index].erroNoFormulario.descricaoDoItem = true   

    setTabelaDeItens(temporaryarray)
  }

  const defaultValue = tabelaDeItens[index].descricaoDoItem

  return (
    <div>
      <Label className='form-label' for={`descricaoDoItem${index}`}>
        Descrição do item
      </Label>
      <InputGroup className='input-group-merge'>
        <Input 
          name={`descricaoDoItem${index}`}
          id={`descricaoDoItem${index}`}
          defaultValue={defaultValue}
          innerRef={register({ required: true })}
          invalid={errors[`descricaoDoItem${index}`] && true}
          onChange={handleChange}
          type='textarea' 
          placeholder='Descrição do item'
        />
        {errors && errors[`descricaoDoItem${index}`] && <FormFeedback>Máximo de {QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM} caracteres</FormFeedback>}
      </InputGroup>
    </div>
  ) 
}

const LinhaALinha = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)

  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const [active, setActive] = useState('1')
  const toggle = tab => {
    setActive(tab)
  }

  const valoresIniciaisItem = { 
    id: 0,
    nomeDoItem: '', 
    precoDoItem: null, 
    descricaoDoItem: '',
    erroNoFormulario: {
      nomeDoItem: true, 
      precoDoItem: true
    }
  }

  if (tabelaDeItens.length === 0) tabelaDeItens.push(valoresIniciaisItem)
  const [count, setCount] = useState(tabelaDeItens.length)

  const increaseCount = () => {
    const erroNoFormulario = tabelaDeItens.reduce((erroNoFormulario, item) => erroNoFormulario || (!isObjEmpty(item.erroNoFormulario)), false)
    if (!erroNoFormulario) {
      tabelaDeItens.push(valoresIniciaisItem)
      setCount(count + 1)
    } else {
      msgToast = 'Nome e preço do item são de preenchimento obrigatório'
      notifyError()  
    }
  }

  const deleteForm = (i) => {
    if (tabelaDeItens.length > 1) {
      const itensCopy = Array.from(tabelaDeItens)
      itensCopy.splice(i, 1)
      setTabelaDeItens(itensCopy)
      setCount(count - 1)
    }
  }

  const onSubmit = () => {
    const erroNoFormulario = tabelaDeItens.reduce((erroNoFormulario, item) => erroNoFormulario || (!isObjEmpty(item.erroNoFormulario)), false)
    if (!erroNoFormulario) {
      stepper.next()
    } else {
      msgToast = 'Nome e preço do item são de preenchimento obrigatório'
      notifyError()  
    }
  }

  let precoTotal = 0
  const calculaPreco = () => {
    const zero = 0
    precoTotal =  tabelaDeItens.reduce((total, item) => total + (item.precoDoItem === null ? 0 : parseFloat(item.precoDoItem.replace(",", "."))), 0)
    if (isNaN(precoTotal)) return zero.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})
    else {
      precoTotal = precoTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})
      return precoTotal
    }
  }

  return (
    <Fragment>
      <Nav className='justify-content-end' pills>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Itens
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Salvar
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Carregar
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <Row>
            <Col md={6}>
              <div key={precoTotal}>
                <Label className='form-label' for='qtdadedeitens'>
                  Quantidade de itens da proposta
                </Label>
                <Input
                  name='qtdadedeitens'
                  id='qtdadedeitens'
                  defaultValue={tabelaDeItens.length}
                  disabled
                />
              </div>
            </Col>
            <Col md={6}>
              <div key={precoTotal}>
                <Label className='form-label' for='precototal'>
                  Preço total da proposta
                </Label>
                <InputGroup className='input-group-merge mb-2'>
                  <Input
                    name='precototal'
                    id='precototal'
                    defaultValue={calculaPreco()}
                    disabled
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Repeater count={count}>
            {i => {
              const Tag = i === 0 ? 'div' : SlideDown
              return (
                <Tag key={i}>
                  <Form>
                    <Row className='justify-content-between align-items-center'>
                      <Col sm={12}>
                        <div className='divider'>
                          <div className='divider-text'><h4>{`Item ${i + 1}`}</h4></div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div key={tabelaDeItens.length}>
                          <NomeDoNovoItem 
                            index={i}
                            tabelaDeItens={tabelaDeItens}
                            setTabelaDeItens={setTabelaDeItens}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div key={tabelaDeItens.length}>
                          <PrecoDoNovoItem 
                            index={i}
                            tabelaDeItens={tabelaDeItens}
                            setTabelaDeItens={setTabelaDeItens}
                          />
                        </div>
                      </Col>
                      <Col md={2}>
                        <Button.Ripple block color='danger' className='text-nowrap px-1' onClick={() => deleteForm(i)} outline>
                          <Trash size={14} className='mr-50' />
                          <span>Excluir</span>
                        </Button.Ripple>
                      </Col>
                      <Col md={12}>
                        <div key={tabelaDeItens.length}>
                          <DescricaoDoNovoItem 
                            index={i}
                            tabelaDeItens={tabelaDeItens}
                            setTabelaDeItens={setTabelaDeItens}
                          />
                        </div>
                      </Col>
                      <Col sm={12}>
                        <hr />
                      </Col>
                    </Row>
                  </Form>
                </Tag>
              )
            }}
          </Repeater>
          <Button.Ripple 
            block 
            outline 
            className='btn-icon' 
            color='primary' 
            onClick={increaseCount}
          >
            <Plus size={14} />
            <span className='align-middle ml-25'>Novo item</span>
          </Button.Ripple>
          <Col sm={12}>
            <hr />
          </Col>
        </TabPane>
        <TabPane tabId='2'>
          <p>
            Pudding candy canes sugar plum cookie chocolate cake powder croissant. Carrot cake tiramisu danish candy
            cake muffin croissant tart dessert. Tiramisu caramels candy canes chocolate cake sweet roll liquorice icing
            cupcake.Bear claw chocolate chocolate cake jelly-o pudding lemon drops sweet roll sweet candy. Chocolate
            sweet chocolate bar candy chocolate bar chupa chups gummi bears lemon drops.
          </p>
        </TabPane>
        <TabPane tabId='3'>
          <PropostaExterna
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
        </TabPane>
      </TabContent>

      <Form>
        <div className='d-flex justify-content-between'>
          <Button.Ripple 
            color='primary' 
            className='btn-prev' 
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button.Ripple>
          <Button.Ripple 
            color='primary' 
            className='btn-next'
            onClick={onSubmit}
          >
            <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>

      <Erro erro={erro} />
    </Fragment>
  )
}

export default LinhaALinha
