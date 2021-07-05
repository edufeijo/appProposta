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

const NomeDoNovoItem = ({ index, tabelaDeItens, setTabelaDeItens, erroNoFormulario, setErroNoFormulario }) => {
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
    setTabelaDeItens(temporaryarray)
    
    if (isObjEmpty(errors)) setErroNoFormulario(false)
    else setErroNoFormulario(true)
  }

  console.log("================ No NomeDoNovoItem")
  console.log("tabelaDeItens=", tabelaDeItens)
  console.log("errors=", errors)
  console.log("erroNoFormulario=", erroNoFormulario)

  const defaultValue = tabelaDeItens === null ? null : tabelaDeItens[index].nomeDoItem

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

const PrecoDoNovoItem = ({ item, setItem, errors, register }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setItem(registroAnterior => ({
      ...registroAnterior, 
      precoDoItem: value
    }))  
  }

  return (
    <div>
      <Label className='form-label' for='precoDoItem'>
        Preço do item
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <Input
          name='precoDoItem'
          id='precoDoItem'
          placeholder={"1000,00"}
          defaultValue={item.precoDoItem}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors.precoDoItem && true}
          onChange={handleChange}
        />
        {errors && errors.precoDoItem && <FormFeedback>Exemplos: 1244 ou 283,15</FormFeedback>}
      </InputGroup>
      </div>
  )
}

const DescricaoDoNovoItem = ({ item, setItem, errors, register }) => {
  const handleChange = e => {
    const { name, value } = e.target
    setItem(registroAnterior => ({
      ...registroAnterior, 
      descricaoDoItem: value
    }))
  }

  return (
    <div>
      <Label className='form-label' for='descricaoDoItem'>
        Descrição do item
      </Label>
      <InputGroup className='input-group-merge'>
        <Input 
          name='descricaoDoItem'
          id='descricaoDoItem'
          defaultValue={item.descricaoDoItem}
          innerRef={register({ required: true })}
          invalid={errors.descricaoDoItem && true}
          onChange={handleChange}
          type='textarea' 
          placeholder='Descrição do item'
        />
        {errors && errors.descricaoDoItem && <FormFeedback>Máximo de {QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM} caracteres</FormFeedback>}
      </InputGroup>
    </div>
  ) 
}

const LinhaALinha = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)
  const [erroNoFormulario, setErroNoFormulario] = useState(false)

  const SignupSchema = yup.object().shape({
    precoDoItem: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required(),
    descricaoDoItem: yup.string().max(QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM)
  })
  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const [active, setActive] = useState('1')
  const toggle = tab => {
    setActive(tab)
  }

  const valoresIniciaisItem = { 
    id: 0,
    nomeDoItem: '', 
    precoDoItem: null, 
    descricaoDoItem: '' 
  }

  const [count, setCount] = useState(1)
  const [item, setItem] = useState(valoresIniciaisItem)

  if (tabelaDeItens.length === 0) tabelaDeItens.push(valoresIniciaisItem)

  const increaseCount = () => {
    trigger()    
    if (!erroNoFormulario) {
      tabelaDeItens.push(valoresIniciaisItem)
      setCount(count + 1)
    } 
  }

  const deleteForm = (i) => {
    console.log('----------------------------- No deleteForm')
    console.log("====== i=", i)
    if (tabelaDeItens.length > 0) {
      if (tabelaDeItens.length !== i) {
        const itensCopy = Array.from(tabelaDeItens)
        itensCopy.splice(i, 1)
        setTabelaDeItens(itensCopy)
      } else {
        setCount(count - 1)
      }
    }
  }

  const onSubmit = () => {
    trigger()    
    console.log("===================== No onSubmit")
    console.log("errors=", errors)

    if (isObjEmpty(errors)) {
      console.log("Não há erros")
      if (tabelaDeItens.length) item.id = tabelaDeItens[tabelaDeItens.length - 1].id + 1
      else item.id = 1
      tabelaDeItens.push(item)
      setItem(valoresIniciaisItem)
    } else console.log("===================== Tem erros")
  }

  console.log("======================= No LinhaALinha")
  console.log("tabelaDeItens=", tabelaDeItens)
  console.log("Na raiz: errors=", errors)
  console.log("count=", count)
  console.log("erroNoFormulario=", erroNoFormulario)

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
          <Repeater count={count}>
            {i => {
              const Tag = i === 0 ? 'div' : SlideDown
              console.log("i=", i)

              return (
                <Tag key={i}>
                  <Form>
                    <Row className='justify-content-between align-items-center'>
                      <Col md={6}>
                        <NomeDoNovoItem 
                          index={i}
                          tabelaDeItens={tabelaDeItens}
                          setTabelaDeItens={setTabelaDeItens}
                          erroNoFormulario={erroNoFormulario}
                          setErroNoFormulario={setErroNoFormulario}
                        />
                      </Col>
                      <Col md={4}>
                        <PrecoDoNovoItem 
                          item={item}
                          setItem={setItem}
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={2}>
                        <Button.Ripple block color='danger' className='text-nowrap px-1' onClick={() => deleteForm(i)} outline>
                          <Trash size={14} className='mr-50' />
                          <span>Excluir</span>
                        </Button.Ripple>
                      </Col>
                      <Col md={12}>
                        <DescricaoDoNovoItem 
                          item={item}
                          setItem={setItem}
                          errors={errors}
                          register={register}
                        />
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
          <Button.Ripple block outline className='btn-icon' color='primary' onClick={handleSubmit(increaseCount)}>
            <Plus size={14} />
            <span className='align-middle ml-25'>Novo item</span>
          </Button.Ripple>
          <Col sm={12}>
            <hr />
          </Col>


{/*           
                        <FormGroup>
                          <Label for={`animation-price-${i}`}>Price</Label>
                          <input
                            className='form-control-plaintext'
                            type='number'
                            id={`animation-price-${i}`}
                            value='$32'
                            placeholder='$32'
                            readOnly
                            disabled
                          />
                        </FormGroup>

<NomeDoNovoItem 
            item={item}
            setItem={setItem}
            errors={errors}
            register={register}
          />
          <DescricaoDoNovoItem 
            item={item}
            setItem={setItem}
            errors={errors}
            register={register}
          />
          <PrecoDoNovoItem 
            item={item}
            setItem={setItem}
            errors={errors}
            register={register}
          /> */}
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

      <Form onSubmit={handleSubmit(onSubmit)}>
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
