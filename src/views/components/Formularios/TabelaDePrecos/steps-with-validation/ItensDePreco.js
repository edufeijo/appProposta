import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Box, Calendar, Check, Copy, DollarSign, Edit, Eye, Facebook, Instagram, MoreVertical, Plus, PlusCircle, Twitch, Twitter } from 'react-feather'
import { Card, CardHeader, CardBody, CardTitle, CardText, Row, Col, Button, Badge, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, DropdownMenu, DropdownItem, FormFeedback } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM } from '../../../../../configs/appProposta'

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
  tipoDoComponente: null,
  erroNoFormulario: {
    nomeDoComponente: true,
    componenteInvalido: true,
    descricaoInvalida: true
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
        <Badge color='light-primary' pill>
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
        <Badge color={item.itemHabilitado ? 'primary' : 'light-secondary'} pill>
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

    if (isObjEmpty(errors)) delete temporaryarray[index].erroNoFormulario.nomeDoItem
    else temporaryarray[index].erroNoFormulario.nomeDoItem = true   
 
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

const PrecoDoItem = ({ indexItem, operacao, countComponente, setCountComponente, componentesDoItem, setComponentesDoItem, atualizaFormulario, setAtualizaFormulario }) => { 
  const [formModal, setFormModal] = useState(false)

  const tipoDoComponenteOptions = [
    { name: 'tipoDoComponente', value: 'Valor fixo', label: 'Valor fixo' },
    { name: 'tipoDoComponente', value: 'Tabela', label: 'Tabela' },
    { name: 'tipoDoComponente', value: 'Variável x valor fixo', label: 'Variável x valor fixo' }
  ]

  const variaveisOptions = [
    { name: 'variaveis', value: 'Quantidade de convidados', label: 'Quantidade de convidados' },
    { name: 'variaveis', value: 'Quantidade de fotógrafos', label: 'Quantidade de fotógrafos'},
    { name: 'variaveis', value: 'Local único', label: 'Local único' }
  ]

  const handleChangeSelect = e => { // PAREI AQUI!!!!!!!!!! ==========================
    const { name, label, value } = e
    console.log("value=", value)
/*     const temporaryarray = Array.from(componentesDoItem)
    temporaryarray[name].tipoDoComponente = value 
    setComponentesDoItem(temporaryarray)  */
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
      <p>O preço do item é a soma dos <code>componentes</code>:</p>
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
                    name={index}
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
                <Label className='form-label' for={`nomeDoComponente${index}`}>
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
                </InputGroup>
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
            <Col  md='6' sm='12'>
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
            </Col>
            <Col  md='6' sm='12'>
              <FormGroup tag={Col} md='12'>
                <Label>Valor do componente de preço</Label>
                <InputGroup className='input-group-merge mb-2'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>R$</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name='valor'
                    id='valor'
                    placeholder={"1000,00"}
                    autoComplete="off"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md='5' sm='5'>
              </Col>
            <Col md='1' sm='2'>
              <Button.Ripple className='btn-icon'  color='primary'>
                <Plus size={16} />
              </Button.Ripple>
            </Col>
            <Col md='6' sm='5'>
            </Col>
          </Row>
          <Row>
            <Col  md='6' sm='12'>
              <FormGroup tag={Col} md='12'>
                <Label>Tipo do componente de preço</Label>
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
            </Col>
            <Col  md='6' sm='12'>
              <FormGroup tag={Col} md='12'>
                <Label>Nome da variável</Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={variaveisOptions[0]}
                  options={variaveisOptions}
                  onChange={handleChangeSelect}
                  isClearable={false}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md='5' sm='5'>
              </Col>
            <Col md='1' sm='2'>
              <Button.Ripple className='btn-icon'  color='primary'>
                <Plus size={16} />
              </Button.Ripple>
            </Col>
            <Col md='6' sm='5'>
            </Col>
          </Row>
          <Row>
          <Button.Ripple color='primary' outline size='sm' className='btn-prev'>
            <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
            <span className='align-middle d-sm-inline-block d-none'>Componente do preço</span>
          </Button.Ripple>
          </Row>
        </div>
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

const ItemIndividual = ({ item, index, operacao, count, setCount, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, componentesDoItem, setComponentesDoItem, descricoesDoItem, setDescricoesDoItem, atualizaFormulario, setAtualizaFormulario }) => {
  const [activeHorizontal, setActiveHorizontal] = useState('A')

  const toggleHorizontal = tab => {
    setActiveHorizontal(tab)
  }

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

const ItensDePreco = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {
  const [activeVertical, setactiveVertical] = useState('1')
  const [atualizaFormulario, setAtualizaFormulario] = useState(0)

  const toggleVertical = tab => {
    setactiveVertical(tab) 
  }

  const [componentesDoItem, setComponentesDoItem] = useState([VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM])
  const [descricoesDoItem, setDescricoesDoItem] = useState([])

  const [count, setCount] = useState(itensDaTabelaDePrecos.length)
  useEffect(() => {
    setCount(itensDaTabelaDePrecos.length)
  }, [itensDaTabelaDePrecos.length]) 

  console.log("==================== No ItensDePreco")
/*   console.log("operacao=", operacao)
  console.log("todasAsTabelaDePrecos=", todasAsTabelaDePrecos)
  console.log("tabelaDePrecos=", tabelaDePrecos)
  console.log("versaoDaTabelaDePrecos=", versaoDaTabelaDePrecos)
  console.log("dadosInformativosOpcionais=", dadosInformativosOpcionais) 
  console.log("dadosInformativosObrigatorios=", dadosInformativosObrigatorios) */
  console.log("itensDaTabelaDePrecos=", itensDaTabelaDePrecos)  
  console.log("componentesDoItem=", componentesDoItem) 
  console.log("descricoesDoItem=", descricoesDoItem) 
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
                      componentesDoItem={componentesDoItem}
                      setComponentesDoItem={setComponentesDoItem}
                      descricoesDoItem={descricoesDoItem}
                      setDescricoesDoItem={setDescricoesDoItem}
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
