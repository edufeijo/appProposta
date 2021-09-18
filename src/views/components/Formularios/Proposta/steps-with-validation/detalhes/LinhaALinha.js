import { useState, Fragment, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash } from 'react-feather'
import { Button, Label, Input, Row, Col, FormFeedback, Form, InputGroup, InputGroupAddon, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, CardText, FormGroup } from 'reactstrap'
import '@styles/react/apps/app-invoice.scss'
import Erro from '../../../../Erro'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_NOME_DO_ITEM, QTDADE_MAX_LETRAS_NOME_DO_ITEM, QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM, VALORES_INICIAIS_DO_ITEM } from '../../../../../../configs/appProposta'
import { isObjEmpty } from '@utils'
import PropostaExterna from './PropostaExterna'
import Repeater from '@components/repeater'
import { SlideDown } from 'react-slidedown'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../../../Toasts/ToastTypes'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router-dom"

const NomeDoNovoItem = ({ index, tabelaDeItens, setTabelaDeItens }) => {
  const SignupSchema = yup.object().shape({
    [`nomeDoItem${index}`]: yup.string().min(QTDADE_MIN_LETRAS_NOME_DO_ITEM).max(QTDADE_MAX_LETRAS_NOME_DO_ITEM).required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = e => {
    const { value } = e.target
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
  const history = useHistory()

  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

  const VALORES_INICIAIS_DO_ITEM = { 
    nomeDoItem: '', 
    precoDoItem: null, 
    descricaoDoItem: '',
    erroNoFormulario: {
      nomeDoItem: true, 
      precoDoItem: true
    }
  }

  const VALORES_INICIAIS_DA_PROPOSTA_EXTERNA = { 
    precoDoItem: null, 
    erroNoFormulario: {
      valorDaProposta: true
    }
  }

  const [active, setActive] = useState('1')
  const toggle = tab => {
    setActive(tab)
  }

  const [count, setCount] = useState(tabelaDeItens.length)

  const MySwal = withReactContent(Swal)
  const AvisoDeSalvarProposta = () => {
    return MySwal.fire({
      title: `Quer salvar um rascunho da proposta?`,
      text: `A proposta será salva no servidor com o status de rascunho. Ou clique em Cancelar e continue a editar a proposta`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        setProposta(registroAnterior => ({
          ...registroAnterior, 
          statusDaProposta: 'rascunho-temporario'
        }))
        stepper.next()
      } else {
        if (proposta.propostaCriadaPor === 'Linha a linha') toggle('1')
        else if (proposta.propostaCriadaPor === 'Documento externo') toggle('3')
      }
    })
  }

  const AvisoDeApagarVersaoDaProposta = () => {
    return MySwal.fire({
      title: `Todos os itens desta proposta serão apagados!`,
      text: `Clique em Apagar e carregue um arquivo externo com a descrição da proposta. Ou clique em Cancelar se deseja voltar para a descrição dos itens`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Apagar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        setProposta(registroAnterior => ({
          ...registroAnterior, 
          propostaCriadaPor: 'Documento externo'
        }))
        setCount(1)
        setTabelaDeItens([Object.assign({}, VALORES_INICIAIS_DA_PROPOSTA_EXTERNA)])
      } else {
        toggle('1')
      }
    })
  }

  const AvisoDeApagarArquivoExterno = () => {
    return MySwal.fire({
      title: `Todos os arquivos carregados nesta proposta serão apagados!`,
      text: `Clique em Apagar e siga para a descrição da proposta. Ou clique em Cancelar se deseja manter os arquivos carregados`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Apagar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        setProposta(registroAnterior => ({
          ...registroAnterior, 
          propostaCriadaPor: 'Linha a linha'
        }))
        setVersaoDaProposta(registroAnterior => ({
          ...registroAnterior, 
          arquivoDaProposta: null
        }))
        setCount(1)
        setTabelaDeItens([Object.assign({}, VALORES_INICIAIS_DO_ITEM)])
      } else {
        toggle('3')
      }
    })
  }

  const AvisoDeNaoPodeAlterarTipoDaProposta = (tipo) => {
    const title = (tipo === 'Documento externo') ? `Somente uma nova proposta pode carregar um arquivo externo!` : 'Proposta criada com arquivo externo não pode ter descrição de itens!'
    const text = (tipo === 'Documento externo') ? `Clique em Criar para gerar uma nova proposta e carregar um arquivo externo. Ou clique em Cancelar se deseja voltar para a descrição dos itens` : `Clique em Criar para gerar uma nova proposta e descrever os itens. Ou clique em Cancelar se deseja carregar um novo arquivo externo`
    return MySwal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        history.push('/proposta/new')
      } else {
        if (tipo === 'Documento externo') toggle('1')
        else toggle('3')
      }
    })
  }

  useEffect(() => {
    if (proposta.propostaCriadaPor === 'Linha a linha') toggle('1')
    else if (proposta.propostaCriadaPor === 'Documento externo') toggle('3')
  }, [proposta.propostaCriadaPor]) 

  useEffect(() => {
    setCount(tabelaDeItens.length)
  }, [tabelaDeItens.length]) 

  const increaseCount = () => {
    const erroNoFormulario = tabelaDeItens.reduce((erroNoFormulario, item) => erroNoFormulario || (!isObjEmpty(item.erroNoFormulario)), false)
    if (!erroNoFormulario) {
      tabelaDeItens.push(Object.assign({}, VALORES_INICIAIS_DO_ITEM))
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
      if (proposta.propostaCriadaPor === 'Documento externo') {
        msgToast = 'Valor da proposta é de preenchimento obrigatório'
        notifyError()  
      } else {
        msgToast = 'Nome e preço do item são de preenchimento obrigatório'
        notifyError()  
      }
    }
  }

  const onSave = () => {
    const erroNoFormulario = tabelaDeItens.reduce((erroNoFormulario, item) => erroNoFormulario || (!isObjEmpty(item.erroNoFormulario)), false)
    if (!erroNoFormulario) {
      toggle('2')
      AvisoDeSalvarProposta()
    } else {
      if (proposta.propostaCriadaPor === 'Documento externo') {
        msgToast = 'Valor da proposta é de preenchimento obrigatório'
        notifyError()  
      } else {
        msgToast = 'Nome e preço do item são de preenchimento obrigatório'
        notifyError()  
      }
    }
  }

  const onImport = () => {
    if (proposta.versoesDaProposta.length === 0) {
      toggle('3')
      AvisoDeApagarVersaoDaProposta()
    } else {
      AvisoDeNaoPodeAlterarTipoDaProposta('Documento externo')      
    }
  }

  const onCreate = () => {
    if (proposta.versoesDaProposta.length === 0) {
      if (proposta.propostaCriadaPor === 'Documento externo') {
        toggle('1')
        AvisoDeApagarArquivoExterno()
      }
    } else {
      AvisoDeNaoPodeAlterarTipoDaProposta('Linha a linha')      
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

  const CabecalhoDoLinhaALinha = ({ tabId })  => {
    return (
      <div>
        <Row>
          <Col md={6}>
            <div key={count}>
              <Label className='form-label' for={`qtdadedeitens${tabId}`}>
                Quantidade de itens da proposta
              </Label>
              <Input
                name={`qtdadedeitens${tabId}`}
                id={`qtdadedeitens${tabId}`}
                defaultValue={count}
                disabled
              />
            </div>
          </Col>
          <Col md={6}>
            <div key={precoTotal}>
              <Label className='form-label' for={`precototal${tabId}`}>
                Preço total da proposta
              </Label>
              <InputGroup className='input-group-merge mb-2'>
                <Input
                  name={`precototal${tabId}`}
                  id={`precototal${tabId}`}
                  defaultValue={calculaPreco()}
                  disabled
                />
              </InputGroup>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <Fragment>
      <Nav className='justify-content-end' pills>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              onCreate()
            }}
          >
            Preencher
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              onSave()
            }}
          >
            Salvar
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              onImport()
            }}
          >
            Carregar
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <CabecalhoDoLinhaALinha tabId={'1'} />
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
                        <div key={count}>
                          <NomeDoNovoItem 
                            index={i}
                            tabelaDeItens={tabelaDeItens}
                            setTabelaDeItens={setTabelaDeItens}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div key={count}>
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
                        <div key={count}>
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
          {proposta && proposta.propostaCriadaPor === 'Linha a linha' && <CabecalhoDoLinhaALinha tabId={'2'} />}
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
