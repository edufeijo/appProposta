import { Fragment, useState } from 'react'
import { ArrowLeft, ArrowRight, Box, Calendar, Check, Copy, DollarSign, Edit, Eye, Facebook, Instagram, MoreVertical, Plus, PlusCircle, Twitch, Twitter } from 'react-feather'
import { Row, Col, Button, Badge, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, DropdownMenu, DropdownItem } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
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

const HeaderDoItem = ({ item, index, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, atualizaFormulario, setAtualizaFormulario }) => {
  const abreItemNoFormulario = (toOpen) => {
    const copia = itensDaTabelaDePrecos
    copia[index].itemAbertoNoFormulario = toOpen
    setItensDaTabelaDePrecos(copia)
    setAtualizaFormulario(atualizaFormulario + 1)
  }
  return (
    <Fragment>
      <Row>
        <Col md='11' sm='12'>
          <Badge color={item.itemHabilitado ? 'primary' : 'light-secondary'} pill>
            {item.nomeDoItem}
          </Badge>
        </Col>
        <Col md='1' sm='12'>
          <div className='column-action d-flex align-items-center'>
            <UncontrolledDropdown>
              <DropdownToggle tag='span'>
                <MoreVertical size={17} className='cursor-pointer' />
              </DropdownToggle>
              <DropdownMenu right>
                {!item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(true)} >
                  <Eye size={14} className='mr-50' />
                  <span className='align-middle'>Abrir</span>
                </DropdownItem>}
                {item.itemAbertoNoFormulario && <DropdownItem className='w-100' onClick={() => abreItemNoFormulario(false)} >
                  <Box size={14} className='mr-50' />
                  <span className='align-middle'>Fechar item</span>
                </DropdownItem>}
                <DropdownItem className='w-100'>
                  <Edit size={14} className='mr-50' />
                  <span className='align-middle'>Criar item</span>
                </DropdownItem>               
                <DropdownItem className='w-100'>
                  <Edit size={14} className='mr-50' />
                  <span className='align-middle'>Duplicar item</span>
                </DropdownItem>                      
                <DropdownItem className='w-100'>
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
        </Col>
      </Row>
    </Fragment>
  )
}

const ItemDePrecoFechado = ({ item, index, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, atualizaFormulario, setAtualizaFormulario }) => {
  return (
    <HeaderDoItem 
      item={item} 
      index={index}
      itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
      setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
      atualizaFormulario={atualizaFormulario}
      setAtualizaFormulario={setAtualizaFormulario}                      
    />
  )
}

const NomeDoItem = ({ index, itensDaTabelaDePrecos, setItensDaTabelaDePrecos }) => {
/*   const SignupSchema = yup.object().shape({
    [`nomeDoItem${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  }) */

  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].nomeDoItem = value

/*     if (isObjEmpty(errors)) delete temporaryarray[index].erroNoFormulario.nomeDoItem
    else temporaryarray[index].erroNoFormulario.nomeDoItem = true    */
 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  const defaultValue = itensDaTabelaDePrecos[index].nomeDoItem
/*   innerRef={register({ required: true })}
  invalid={errors[`nomeDoItem${index}`] && true} */

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
          onChange={handleChange}
        />
{/*       {errors && errors[`nomeDoItem${index}`] && <FormFeedback>Nome do item com no mínimo {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e no máximo {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</FormFeedback>} */}
      </InputGroup>
    </div>
  ) 
}

const ConfiguracaoDoItem = ({ item, index, operacao, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, atualizaFormulario, setAtualizaFormulario }) => {
  const defaultValue = itensDaTabelaDePrecos[index].nomeDoItem
  
  const handleChange = e => {
    const { value } = e.target
    const temporaryarray = Array.from(itensDaTabelaDePrecos)
    temporaryarray[index].nomeDoItem = value

/*     if (isObjEmpty(temporaryarray[index].errors)) delete temporaryarray[index].erroNoFormulario.nomeDoItem
    else temporaryarray[index].errors.nomeDoItem = true   */ 
 
    setItensDaTabelaDePrecos(temporaryarray)
  }

  return (
    <div>     
      {(operacao === 'Criar') && <FormGroup tag={Col} md='6'>
        <Label className='form-label' for={`nomeDoItem${index}`}>
          Nome do item:
        </Label>
        <InputGroup className='input-group-merge mb-2'>
          <Input
            name={`nomeDoItem${index}`}
            id={`nomeDoItem${index}`}
            placeholder='Nome do item'
            defaultValue={defaultValue}
            autoComplete="off"
            onChange={handleChange}
          />
        </InputGroup>
{/*         {erroQuantidadeDeCaracteres(item.nomeDoItem, QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_NOME_DO_ITEM} e {QTDADE_MAX_LETRAS_NOME_DO_ITEM} caracteres</Alert>}  */}
      </FormGroup>}
      <CustomInput
        type='checkbox'
        className='custom-control-success'
        id='primary'
        label='Item habilitado?'
        defaultChecked
        inline
      />
      <CustomInput
        type='checkbox'
        className='custom-control-success'
        id='primary'
        label='Item obrigatório na proposta?'
        defaultChecked
        inline
      />
    </div>
  )
}

const PrecoDoItem = ({ item, componentesDoPrecoDoItem, setComponentesDoPrecoDoItem }) => {
  const [formModal, setFormModal] = useState(false)

  const tipoDoComponenteOptions = [
    { name: 'tipoDoComponente', value: 'Valor fixo', label: 'Valor fixo' },
    { name: 'tipoDoComponente', value: 'Variável x valor fixo', label: 'Variável x valor fixo' },
    { name: 'tipoDoComponente', value: 'Variável x tabela', label: 'Variável x tabela' }
  ]

  const variaveisOptions = [
    { name: 'variaveis', value: 'Quantidade de convidados', label: 'Quantidade de convidados' },
    { name: 'variaveis', value: 'Quantidade de fotógrafos', label: 'Quantidade de fotógrafos'},
    { name: 'variaveis', value: 'Local único', label: 'Local único' }
  ]

  const handleChangeSelect = e => {
    const { name, label, value } = e
  }

  return (
    <Fragment>
      <h6>Preço do item (é a soma dos componentes abaixo):</h6>
      <div>
        <Row>
          <FormGroup tag={Col} md='12'>
            <div className='demo-inline-spacing'>
              <Label>Tipo do componente de preço: </Label>
              <CustomInput type='radio' id='exampleCustomRadio' name='customRadio' inline label='Valor fixo' defaultChecked />
              <CustomInput type='radio' id='exampleCustomRadio2' name='customRadio' inline label='Variável x valor fixo' />
              <CustomInput type='radio' id='exampleCustomRadio3' name='customRadio' inline label='Variável x tabela' />
              <div>
                <Button.Ripple color='primary' outline size='sm' className='btn-prev' onClick={() => setFormModal(!formModal)}>
                  <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
                  <span className='align-middle d-sm-inline-block d-none'>Componente do preço</span>
                </Button.Ripple>
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
                    <div className='demo-inline-spacing'>
                      <Label>Tipo do componente de preço: </Label>
                      <CustomInput type='radio' id='exampleCustomRadio' name='customRadio' inline label='Valor fixo' defaultChecked />
                      <CustomInput type='radio' id='exampleCustomRadio2' name='customRadio' inline label='Variável x valor fixo' />
                      <CustomInput type='radio' id='exampleCustomRadio3' name='customRadio' inline label='Variável x tabela' />
                    </div>
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

const ItemDePrecoAberto = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type, item, index, componentesDoPrecoDoItem, setComponentesDoPrecoDoItem, descricoesDoItem, setDescricoesDoItem, atualizaFormulario, setAtualizaFormulario }) => {
  const [activeHorizontal, setActiveHorizontal] = useState('A')

  const toggleHorizontal = tab => {
    setActiveHorizontal(tab)
  }

  return (
    <Fragment>
      <HeaderDoItem 
        item={item} 
        index={index}
        itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
        atualizaFormulario={atualizaFormulario}
        setAtualizaFormulario={setAtualizaFormulario}                      
      />
      <Row>
        <Col md='12' sm='12'>
          <Badge color='light-secondary' pill>
            {item.label}
          </Badge>
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

{/*                 <ConfiguracaoDoItem 
                  item={item} 
                  index={index}
                  operacao={operacao}
                  itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
                  setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
                  atualizaFormulario={atualizaFormulario}
                  setAtualizaFormulario={setAtualizaFormulario}   
                /> */}
              </TabPane>
              <TabPane tabId='B'>
                <PrecoDoItem item={item} componentesDoPrecoDoItem={componentesDoPrecoDoItem} setComponentesDoPrecoDoItem={setComponentesDoPrecoDoItem} />
              </TabPane>
              <TabPane tabId='C'>
                <DescricaoDoItem descricoesDoItem={descricoesDoItem} setDescricoesDoItem={setDescricoesDoItem} />
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}


const ItensDePreco = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {
  const [activeVertical, setactiveVertical] = useState('1')
  const [atualizaFormulario, setAtualizaFormulario] = useState(0)

  const toggleVertical = tab => {
    setactiveVertical(tab) 
  }

  const VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM = {
    erroNoFormularioDoComponente: {
      componenteInvalido: true,
      descricaoInvalida: true
    } 
  }

  const [componentesDoItem, setComponentesDoItem] = useState([VALORES_INICIAIS_DO_COMPONENTE_DO_ITEM])
  const [descricoesDoItem, setDescricoesDoItem] = useState([])

  console.log("==================== No ItensDePreco")
  console.log("operacao=", operacao)
  console.log("todasAsTabelaDePrecos=", todasAsTabelaDePrecos)
  console.log("tabelaDePrecos=", tabelaDePrecos)
  console.log("versaoDaTabelaDePrecos=", versaoDaTabelaDePrecos)
  console.log("dadosInformativosOpcionais=", dadosInformativosOpcionais) 
  console.log("dadosInformativosObrigatorios=", dadosInformativosObrigatorios) 
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
                  <ListGroupItem key={item.nomeDoItem}>
                    {!item.itemAbertoNoFormulario && 
                      <ItemDePrecoFechado 
                        item={item} 
                        index={index}
                        operacao={operacao}
                        itensDaTabelaDePrecos={itensDaTabelaDePrecos} 
                        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}  
                        atualizaFormulario={atualizaFormulario}
                        setAtualizaFormulario={setAtualizaFormulario}                      
                      />}
                    {item.itemAbertoNoFormulario &&
                      <ItemDePrecoAberto 
                        item={item}
                        index={index}
                        operacao={operacao}
                        itensDaTabelaDePrecos={itensDaTabelaDePrecos}
                        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}
                        componentesDoItem={componentesDoItem}
                        setComponentesDoItem={setComponentesDoItem}
                        descricoesDoItem={descricoesDoItem}
                        setDescricoesDoItem={setDescricoesDoItem}
                        atualizaFormulario={atualizaFormulario}
                        setAtualizaFormulario={setAtualizaFormulario}
                      />}
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
