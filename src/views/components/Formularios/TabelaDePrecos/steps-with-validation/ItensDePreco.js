import { Fragment, useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, Check, Copy, DollarSign, Edit, Eye, Facebook, Instagram, MoreVertical, Plus, PlusCircle, Twitch, Twitter } from 'react-feather'
import { Row, Col, Button, Badge, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, ButtonGroup, UncontrolledDropdown, DropdownToggle, CustomInput, Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DropdownMenu from 'reactstrap/lib/DropdownMenu'
import DropdownItem from 'reactstrap/lib/DropdownItem'

const ItensDePreco = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {
  const [activeVertical, setactiveVertical] = useState('1')
  const [activeHorizontal, setActiveHorizontal] = useState('A')

  const toggleVertical = tab => {
    setactiveVertical(tab)
  }

  const toggleHorizontal = tab => {
    setActiveHorizontal(tab)
  }

  const descricaoOptions = [
    { name: 'descricao', value: 'Texto fixo', label: 'Texto fixo' },
    { name: 'descricao', value: 'Texto variável', label: 'Texto variável' }
  ]

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

  const [formModal, setFormModal] = useState(false)
  
  const handleChangeSelect = e => {
    const { name, label, value } = e
  }

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
            Pendências
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeVertical === '3'}
            onClick={() => {
              toggleVertical('3')
            }}
          >
            Ações
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={activeVertical}>
        <TabPane tabId='1'>
          <h4 tag='h4'>Itens de preço</h4>
          <p><code>Itens de preço</code> são bla bla bla.</p>
          <ReactSortable
            tag='ul'
            className='list-group sortable'
            group='shared-group'
            list={dadosInformativosOpcionais}
            setList={setDadosInformativosOpcionais}
          >
            {dadosInformativosOpcionais.map(item => {
              return (
                <ListGroupItem className='draggable' key={item.id}>
                  <Row>
                    <Col md='11' sm='12'>
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
                            <p>Nome do item</p>
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
                          </TabPane>
                          <TabPane tabId='B'>
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
                          </TabPane>
                          <TabPane tabId='C'>
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
                          </TabPane>
                        </TabContent>
                      </div>
                    </Col>
                    <Col md='1' sm='12'>
                      <div className='column-action d-flex align-items-center'>
                        <UncontrolledDropdown>
                          <DropdownToggle tag='span'>
                            <MoreVertical size={17} className='cursor-pointer' />
                          </DropdownToggle>
                          <DropdownMenu right>
                            {<DropdownItem className='w-100'>
                              <Eye size={14} className='mr-50' />
                              <span className='align-middle'>Editar</span>
                            </DropdownItem>}
                            <DropdownItem className='w-100'>
                              <Edit size={14} className='mr-50' />
                              <span className='align-middle'>Duplicar</span>
                            </DropdownItem>            
                            <DropdownItem className='w-100'>
                              <Edit size={14} className='mr-50' />
                              <span className='align-middle'>Simular</span>
                            </DropdownItem>            
                            {<DropdownItem className='w-100'>
                              <Copy size={14} className='mr-50' />
                              <span className='align-middle'>Excluir</span>
                            </DropdownItem>}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12}>
                    </Col>
                    <Col md={6} sm={12}>
                      <ButtonGroup className='mb-1'>
                        <Button color='primary'>Fechar</Button>
                        <Button color='primary'>Duplicar</Button>
                        <Button color='primary'>Simular</Button>                        
                        <Button color='primary'>Excluir</Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </ListGroupItem>
              )
            })}
          </ReactSortable>
          <Button.Ripple color='primary' outline size='sm' className='btn-prev' block>
              <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
              <span className='align-middle d-sm-inline-block d-none'>Novo item de preço</span>
          </Button.Ripple>
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
