import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Box, Calendar, Check, Copy, DollarSign, Edit, Eye, Facebook, Instagram, MoreVertical, Plus, PlusCircle, Twitch, Twitter } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Badge, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import CurrencyInput from 'react-currency-input-field'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } from '../../../../../configs/appProposta'

const erroQuantidadeDeCaracteres = (campo, min, max) => {
  /*  retorna:
      0 se campo está correto
      1 se campo é null e não precisa mostrar msg de erro
      2 se campo não está preenchido corretamente  
  */
  if (campo === null) return 1
  else if (campo.length < min || campo.length > max) return 2
  else return 0
}

const VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM = {
  id: 1,
  nomeDoComponente: 'Componente 1',
  tipoDoComponente: 'Valor fixo',
  erroNoComponente: {
    precoFixoDoComponente: true
  } 
}

const HeaderDoComponente = ({ componente, indexComponente, countComponente, setCountComponente, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, componentesDoItem, setComponentesDoItem, atualizaFormulario, setAtualizaFormulario }) => {                           
  const criaComponente = () => { 
    const item = VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM
    let id = 0
    if (componentesDoItem.length === 1) id = componentesDoItem[0].id + 1
    else {
      const numbers = Array.from(componentesDoItem)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.nomeDoComponente = `Componente ${id}`
    componentesDoItem.push(Object.assign({}, item))
    setCountComponente(countComponente + 1)
  }

  const excluiComponente = (i) => {
    if (componentesDoItem.length > 1) {
      const itensCopy = Array.from(componentesDoItem)
      itensCopy.splice(i, 1)
      setComponentesDoItem(itensCopy)
      setCountComponente(countComponente - 1)
    } else {
      const item = VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM
      const id = componentesDoItem[0].id + 1
      item.id = id
      setComponentesDoItem([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(componente.erroNoComponente) ? 'light-primary' : 'light-danger'}  pill>
          {componente.nomeDoComponente}
        </Badge>
        <div className='column-action d-flex align-items-center'>
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaComponente()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar componente</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar componente</span>
              </DropdownItem>                    
{/*               <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Renomear componente</span>
              </DropdownItem>  */}                     
              <DropdownItem className='w-100' onClick={() => excluiComponente(indexComponente)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir componente</span>
              </DropdownItem>
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Simular preço</span>
              </DropdownItem>                
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const HeaderDoItem = ({ item, index, count, setCount, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, atualizaFormulario, setAtualizaFormulario }) => {                           
  const abreItemNoFormulario = (toOpen) => {
    const copia = itensDaTabelaDePrecos
    copia[index].itemAbertoNoFormulario = toOpen
    setItensDaTabelaDePrecos(copia)
    setAtualizaFormulario(atualizaFormulario + 1)
  }

  const VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS = { 
    id: 0,
    nomeDoItem: null,
    itemHabilitado: true,
    itemObrigatorioNaProposta: false,
    itemAbertoNoFormulario: true,
    erroNoFormulario: {
      nomeDoItem: true
    } 
  }

  const criaItemNoFormulario = () => {
    const item = VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS
    let id = 0
    if (itensDaTabelaDePrecos.length === 1) id = itensDaTabelaDePrecos[0].id + 1
    else {
      const numbers = Array.from(itensDaTabelaDePrecos)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    itensDaTabelaDePrecos.push(Object.assign({}, item))
    setCount(count + 1)
  }

  const excluiItemNoFormulario = (i) => {
    if (itensDaTabelaDePrecos.length > 1) {
      const itensCopy = Array.from(itensDaTabelaDePrecos)
      itensCopy.splice(i, 1)
      setItensDaTabelaDePrecos(itensCopy)
      setCount(count - 1)
    } else {
      const item = VALORES_INICIAIS_DO_ITEM_DA_TABELA_DE_PRECOS
      const id = itensDaTabelaDePrecos[0].id + 1
      item.id = id
      setItensDaTabelaDePrecos([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(item.erroNoItem) ? item.itemHabilitado ? 'primary' : 'light-secondary' : 'light-danger' } pill>
          {item.nomeDoItem}
        </Badge>
        <div className='column-action d-flex align-items-center'>
          <UncontrolledDropdown>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              {!item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(true)} >
                <Eye size={14} className='mr-50' />
                <span className='align-middle'>Abrir item</span>
              </DropdownItem>}
              {item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(false)} >
                <Box size={14} className='mr-50' />
                <span className='align-middle'>Fechar item</span>
              </DropdownItem>}
              <DropdownItem className='w-100' onClick={() => criaItemNoFormulario()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar item</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar item</span>
              </DropdownItem>                      
              <DropdownItem className='w-100' onClick={() => excluiItemNoFormulario(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir item</span>
              </DropdownItem>
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Simular preço</span>
              </DropdownItem>  
              <DropdownItem className='w-100'>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Salvar tabela</span>
              </DropdownItem>                
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const NomeDoItem = ({ index, itensDaTabelaDePrecos, setItensDaTabelaDePrecos }) => {
  const SignupSchema = yup.object().shape({
    [`nomeDoItem${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  }) 

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].nomeDoItem = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoItem.nomeDoItem
    else temporaryarray[index].erroNoItem.nomeDoItem = true   
 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const handleChangeItemHabilitado = e => {
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].itemHabilitado = !temporaryarray[index].itemHabilitado 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const handleChangeItemObrigatorioNaProposta = e => {
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].itemObrigatorioNaProposta = !temporaryarray[index].itemObrigatorioNaProposta 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const defaultValue = itensDaTabelaDePrecos[index].nomeDoItem
  const defaultCheckedItemHabilitado = itensDaTabelaDePrecos[index].itemHabilitado 
  const defaultCheckedItemObrigatorioNaProposta = itensDaTabelaDePrecos[index].itemObrigatorioNaProposta

  return (
    <div>
      <p></p>
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
          onChange={handleChange}
          innerRef={register({ required: true })}
          invalid={errors[`nomeDoItem${index}`] && true} 
        />
       {errors && errors[`nomeDoItem${index}`] && <FormFeedback>Use entre {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</FormFeedback>} 
      </InputGroup>
      <CustomInput
        name={`itemHabilitado${index}`}
        id={`itemHabilitado${index}`}
        type='checkbox'
        className='custom-control-success'
        label='Item habilitado?'
        defaultChecked={defaultCheckedItemHabilitado}
        inline
        onChange={handleChangeItemHabilitado}
      />
      <CustomInput
        name={`itemObrigatorioNaProposta${index}`}
        id={`itemObrigatorioNaProposta${index}`}
        type='checkbox'
        className='custom-control-success'
        label='Item obrigatório na proposta?'
        defaultChecked={defaultCheckedItemObrigatorioNaProposta}
        inline
        onChange={handleChangeItemObrigatorioNaProposta}
      />
    </div>
  ) 
}

// =============================== PAREIU AQUI EM BAIXO COM VARIOS ERROS
const VariávelXValorFixo = ({ index, input, componentesDoItem, setComponentesDoItem, variaveisDoSistema, variaveisInternas, setVariaveisInternas }) => { 
  const SignupSchema = yup.object().shape({
    [`precoFixoDoComponente${index}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = 'Valor fixo'
    temporaryarray[index].precoFixoDoComponente = value

/*     if (isObjEmpty(errors)) delete temporaryarray[index].erroNoComponente.precoFixoDoComponente
    else temporaryarray[index].erroNoComponente.precoFixoDoComponente = true    */
  
    setComponentesDoItem(temporaryarray)
  }

  const variaveis = variaveisDoSistema.concat(variaveisInternas)

  let defaultValue = null
  if (componentesDoItem[index].hasOwnProperty('precoFixoDoComponente')) defaultValue = componentesDoItem[index].precoFixoDoComponente

  const setTipoDoComponente = (tipoDoComponente) => { 
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = tipoDoComponente  
    setComponentesDoItem(temporaryarray)
  }
  useEffect(() => {
    if (input === 'Variável x valor fixo') setTipoDoComponente('Variável x valor fixo')
  }, [input]) 

  const handleChangeSelect = e => { 
    const { name, value } = e.target
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = 'Variável x valor fixo'

/*     if (isObjEmpty(errors)) delete temporaryarray[index].erroNoComponente.precoFixoDoComponente
    else temporaryarray[index].erroNoComponente.precoFixoDoComponente = true    */
  
    setComponentesDoItem(temporaryarray)
  }

  return (
    <div>
      <FormGroup>
        <Label>Escolha a variável:</Label>
        <Select
          id={`escolhaDeVariavel${index}`}               
          theme={selectThemeColors}
          className='react-select'
          classNamePrefix='select'
          defaultValue={variaveis[0]}
          options={variaveis}
          onChange={handleChangeSelect}
          isClearable={false}
        />
      </FormGroup>
    </div>
  )
}

const PrecoFixoDoComponente = ({ index, input, componentesDoItem, setComponentesDoItem }) => { 
  const SignupSchema = yup.object().shape({
    [`precoFixoDoComponente${index}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^\d*,?\d{2}$/).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const setTipoDoComponente = (tipoDoComponente) => { 
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = tipoDoComponente  
    setComponentesDoItem(temporaryarray)
  }
  useEffect(() => {
    if (input === 'Valor fixo') setTipoDoComponente('Valor fixo')
  }, [input]) 

  const handleChange = e => {
    const { name, value } = e.target
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[index].tipoDoComponente = 'Valor fixo'
    temporaryarray[index].precoFixoDoComponente = value

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoComponente.precoFixoDoComponente
    else temporaryarray[index].erroNoComponente.precoFixoDoComponente = true   
 
    setComponentesDoItem(temporaryarray)
  }

  let defaultValue = null
  if (componentesDoItem[index].hasOwnProperty('precoFixoDoComponente')) defaultValue = componentesDoItem[index].precoFixoDoComponente

  return (
    <div>
      <Label className='form-label' for={`precoFixoDoComponente${index}`}>
        Valor
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <Input
          name={`precoFixoDoComponente${index}`}
          id={`precoFixoDoComponente${index}`}
          placeholder={"1000,00"}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`precoFixoDoComponente${index}`] && true}
          onChange={handleChange}
        />
        {errors && errors[`precoFixoDoComponente${index}`] && <FormFeedback>Exemplos: 1244 ou 283,15, máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } dígitos</FormFeedback>}
      </InputGroup>
    </div>
  )
}

const PrecoDoItem = ({ indexItem, operacao, countComponente, setCountComponente, componentesDoItem, setComponentesDoItem, itensDaTabelaDePrecos, variaveisDoSistema, variaveisInternas, setVariaveisInternas, atualizaFormulario, setAtualizaFormulario }) => { 
  const [formModal, setFormModal] = useState(false)

  const tipoDoComponenteOptions = [
    { name: 'tipoDoComponente', value: 'Valor fixo', label: 'Valor fixo' },
    { name: 'tipoDoComponente', value: 'Variável x valor fixo', label: 'Variável x valor fixo' },
    { name: 'tipoDoComponente', value: 'Tabela', label: 'Tabela' }
  ]

  const variaveisOptions = [
    { name: 'variaveis', value: 'Quantidade de convidados', label: 'Quantidade de convidados' },
    { name: 'variaveis', value: 'Quantidade de fotógrafos', label: 'Quantidade de fotógrafos'},
    { name: 'variaveis', value: 'Local único', label: 'Local único' }
  ]

  const [input, setInput] = useState('Valor fixo')
  const handleChangeSelect = e => { 
    const { value } = e
    setInput(value)
  }

  const handleChange = e => {
    const { value, name } = e.target
    const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[name].nomeDoComponente = value 
    setComponentesDoItem(temporaryarray) 
  }

  return ( 
    <Fragment>
      <p></p>
      <p>O preço do item <b>{itensDaTabelaDePrecos && itensDaTabelaDePrecos[indexItem].nomeDoItem}</b> é a soma dos <code>componentes</code> abaixo:</p>
      <ReactSortable className='row sortable-row' list={componentesDoItem} setList={setComponentesDoItem}>
        {componentesDoItem.map((componente, index) => (
          <Col className='draggable' xl='4' md='6' sm='12' key={componente.id}>
            <Card className={`draggable-cards`}>
              <CardHeader>
                <HeaderDoComponente
                  componente={componente}
                  indexComponente={index}
                  operacao={operacao}
                  countComponente={countComponente}
                  setCountComponente={setCountComponente}
                  componentesDoItem={componentesDoItem}  
                  setComponentesDoItem={setComponentesDoItem} 
                  atualizaFormulario={atualizaFormulario}
                  setAtualizaFormulario={setAtualizaFormulario}   
                />
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>Tipo do componente de preço:</Label>
                  <Select
                    id={`tipoDoComponente${index}`}               
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    defaultValue={tipoDoComponenteOptions[0]}
                    options={tipoDoComponenteOptions}
                    onChange={handleChangeSelect}
                    isClearable={false}
                  />
                </FormGroup>
                {input === 'Valor fixo' && 
                  <PrecoFixoDoComponente 
                    index={index}
                    input={input}
                    componentesDoItem={componentesDoItem}
                    setComponentesDoItem={setComponentesDoItem}
                  />}

                  {input === 'Variável x valor fixo' && 
                  <VariávelXValorFixo 
                    index={index}
                    input={input}
                    componentesDoItem={componentesDoItem}
                    setComponentesDoItem={setComponentesDoItem}
                    variaveisDoSistema={variaveisDoSistema}
                    variaveisInternas={variaveisInternas} 
                    setVariaveisInternas={setVariaveisInternas} 
                  />}
{/*                 <Label className='form-label' for={`nomeDoComponente${index}`}>
                  Nome do componente (opcional)
                </Label>
                <InputGroup className='input-group-merge mb-2'>
                  <Input
                    id={`nomeDoComponente${index}`}
                    name={index}
                    placeholder='Nome do componente'
                    defaultValue={componente.nomeDoComponente}
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </InputGroup> */}
              </CardBody>
{/*               <div>
          <Row>
            <FormGroup tag={Col} md='12'>
                <div>
                  <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader toggle={() => setFormModal(!formModal)}>Login Form</ModalHeader>
                    <ModalBody>
                      <FormGroup tag={Col} md='12'>
                        <Label>Tipo do componente de preço:</Label>
                        <Select
                          theme={selectThemeColors}
                          className='react-select'
                          classNamePrefix='select'
                          defaultValue={tipoDoComponenteOptions[0]}
                          options={tipoDoComponenteOptions}
                          onChange={handleChangeSelect}
                          isClearable={false}
                        />
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button color='primary' onClick={() => setFormModal(!formModal)}>
                        Login
                      </Button>{' '}
                    </ModalFooter>
                  </Modal>
                </div>
              </div>
            </FormGroup>
              </CardBody> */}
            </Card>
          </Col>
        ))}
      </ReactSortable>
    </Fragment>
  )
}

const DescricaoDoItem = ({ item, descricoesDoItem, setDescricoesDoItem }) => {
  const descricaoOptions = [
    { name: 'descricao', value: 'Texto fixo', label: 'Texto fixo' },
    { name: 'descricao', value: 'Texto variável', label: 'Texto variável' }
  ]
  
  const handleChangeSelect = e => {
    const { name, label, value } = e
  }

  return (
    <Fragment>
      <Label>Descrição do item</Label>
      <Button.Ripple color='primary' outline size='sm' className='btn-prev'>
        <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
        <span className='align-middle d-sm-inline-block d-none'>Descrição adicional</span>
      </Button.Ripple>
      <p>Descrição 1</p>
      <Select
        theme={selectThemeColors}
        className='react-select'
        classNamePrefix='select'
        defaultValue={descricaoOptions[0]}
        options={descricaoOptions}
        onChange={handleChangeSelect}
        isClearable={false}
      />
      <p>Descrição 2</p>
      <Select
        theme={selectThemeColors}
        className='react-select'
        classNamePrefix='select'
        defaultValue={descricaoOptions[1]}
        options={descricaoOptions}
        onChange={handleChangeSelect}
        isClearable={false}
      />
    </Fragment>
  )
}

const ItemIndividual = ({ item, index, operacao, count, setCount, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, variaveisDoSistema, variaveisInternas, setVariaveisInternas, atualizaFormulario, setAtualizaFormulario }) => {
  const [activeHorizontal, setActiveHorizontal] = useState('A')

  const toggleHorizontal = tab => {
    setActiveHorizontal(tab)
  }

  const [componentesDoItem, setComponentesDoItem] = useState([VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM])
  const [descricoesDoItem, setDescricoesDoItem] = useState([])
  console.log("componentesDoItem=", componentesDoItem) 
  console.log("descricoesDoItem=", descricoesDoItem) 

  const [countComponente, setCountComponente] = useState(componentesDoItem.length)
  useEffect(() => {
    setCountComponente(componentesDoItem.length)
  }, [componentesDoItem.length]) 

  return (
    <Fragment>
      <HeaderDoItem 
        item={item} 
        index={index}
        count={count}
        setCount={setCount}
        itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
        atualizaFormulario={atualizaFormulario}
        setAtualizaFormulario={setAtualizaFormulario}                      
      />
      {item.itemAbertoNoFormulario && <Row>
        <Col md='12' sm='12'>
          <div className='nav-vertical'>
            <Nav tabs className='nav-left'>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'A'}
                  onClick={() => {
                    toggleHorizontal('A')
                  }}
                >
                  Nome
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'B'}
                  onClick={() => {
                    toggleHorizontal('B')
                  }}
                >
                  Preço
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeHorizontal === 'C'}
                  onClick={() => {
                    toggleHorizontal('C')
                  }}
                >
                  Descrição
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeHorizontal}>
              <TabPane tabId='A'>
                <NomeDoItem 
                  index={index} 
                  itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
                  setItensDaTabelaDePrecos={setItensDaTabelaDePrecos} 
                />
              </TabPane>
              <TabPane tabId='B'>
                <PrecoDoItem 
                  indexItem={index}
                  operacao={operacao}
                  countComponente={countComponente}
                  setCountComponente={setCountComponente}
                  componentesDoItem={componentesDoItem}
                  setComponentesDoItem={setComponentesDoItem} 
                  itensDaTabelaDePrecos={itensDaTabelaDePrecos}
                  variaveisDoSistema={variaveisDoSistema}
                  variaveisInternas={variaveisInternas}
                  setVariaveisInternas={setVariaveisInternas}
                  atualizaFormulario={atualizaFormulario}
                  setAtualizaFormulario={setAtualizaFormulario}                      
                /> 
              </TabPane>
              <TabPane tabId='C'>
                <DescricaoDoItem descricoesDoItem={descricoesDoItem} setDescricoesDoItem={setDescricoesDoItem} />
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </Row>}
    </Fragment>
  )
}

const ItensDePreco = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, variaveisDoSistema, setVariaveisDoSistema, variaveisInternas, setVariaveisInternas, operacao, stepper, type }) => {
  const [activeVertical, setactiveVertical] = useState('1')
  const [atualizaFormulario, setAtualizaFormulario] = useState(0)

  const toggleVertical = tab => {
    setactiveVertical(tab) 
  }

  const [count, setCount] = useState(itensDaTabelaDePrecos.length)
  useEffect(() => {
    setCount(itensDaTabelaDePrecos.length)
  }, [itensDaTabelaDePrecos.length]) 

  console.log("==================== No ItensDePreco")
/*   console.log("operacao=", operacao)
  console.log("todasAsTabelaDePrecos=", todasAsTabelaDePrecos)
  console.log("versaoDaTabelaDePrecos=", versaoDaTabelaDePrecos) */
  console.log("tabelaDePrecos=", tabelaDePrecos)
  console.log("dadosInformativosOpcionais=", dadosInformativosOpcionais) 
  console.log("dadosInformativosObrigatorios=", dadosInformativosObrigatorios)  
  console.log("variaveisDoSistema=", variaveisDoSistema) 
  console.log("itensDaTabelaDePrecos=", itensDaTabelaDePrecos)  
  console.log("atualizaFormulario=", atualizaFormulario) 

  return (
    <Fragment>    
      <Nav className='justify-content-end' pills>
        <NavItem>
          <NavLink
            active={activeVertical === '1'}
            onClick={() => {
              toggleVertical('1')
            }}
          >
            Itens de preço
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeVertical === '2'}
            onClick={() => {
              toggleVertical('2')
            }}
          >
            Variáveis
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeVertical === '3'}
            onClick={() => {
              toggleVertical('3')
            }}
          >
            Descrições
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={activeVertical}>
        <TabPane tabId='1'>
          <div key={atualizaFormulario}>
            <h4 tag='h4'>Itens de preço</h4>
            <p><code>Itens de preço</code> são bla bla bla.</p>
            <ReactSortable
              tag='ul'
              className='list-group'
              list={itensDaTabelaDePrecos}
              setList={setItensDaTabelaDePrecos}
            >
              {itensDaTabelaDePrecos.map((item, index) => {
                return (
                  <ListGroupItem key={item.id}>
                    <ItemIndividual 
                      item={item}
                      index={index}
                      operacao={operacao}
                      count={count}
                      setCount={setCount}
                      itensDaTabelaDePrecos={itensDaTabelaDePrecos}
                      setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}
                      variaveisDoSistema={variaveisDoSistema}
                      variaveisInternas={variaveisInternas}
                      setVariaveisInternas={setVariaveisInternas}
                      atualizaFormulario={atualizaFormulario}
                      setAtualizaFormulario={setAtualizaFormulario}
                    />
                  </ListGroupItem>
                )
              })}
            </ReactSortable>
          </div>
        </TabPane>

        <TabPane tabId='2'>
          Pendências:
          - definição de variáveis calculadas
            - Quantidade de fotógrafos
            - 
        </TabPane>
        
        <TabPane tabId='3'>
          Quais são as opções?
          - salvar proposta (habilitar se tem pelo menos 1 item de preço) 
          - visualizar parâmetros
          - visualizar tabela de preços 
          -simular preços
        </TabPane>
      </TabContent>

      <div className='d-flex justify-content-between'>
        <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
        </Button.Ripple>
        <Button.Ripple color='primary' className='btn-next' onClick={() => stepper.next()}>
          <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button.Ripple>
      </div>
    </Fragment>
  )
}

export default ItensDePreco
