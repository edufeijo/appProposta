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
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router-dom"

const Segmentacao = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, template, operacao, stepper, type }) => {
  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 2000 })

  const [active, setActive] = useState('1')
  const toggle = tab => {
    setActive(tab)
  }

  const preencheArrayToSelect = (arrayToSelect, tipo, opcaoUnica) => {
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

    if (opcaoUnica === 'selecionar') {
      arrayTemporary.push(SELECIONE_OPCAO)
    } else 
    if (opcaoUnica === 'criar') {
      arrayTemporary.push(CRIA_OPCAO)
    } else {
      arrayTemporary.push(SELECIONE_OPCAO)
      arrayTemporary = arrayTemporary.concat(arrayToSelect)
      arrayTemporary.push(CRIA_OPCAO)
    }
  
    return arrayTemporary
  }

  const customizaArvoreSSS = (arvoreOriginal, tabelaCustomizada) => { 
    console.log("------------------------- No customizaArvoreSSS")
    const arvoreCustomizada = arvoreOriginal
    tabelaCustomizada.map((item, index, array) => {
      let customizado = null
      console.log("item=", item)
      if (item.setorCustomizado) {
        customizado = {
          name: "setor",
          label: item.setor,
          value: item.setor,
          type: "opcao"
        }
/*         dadosInformativosSugeridos : [ 
          "Local do evento", 
          "Data do evento"
        ],
        parametrosSugeridos : ["Quantidade de participantes"], */
        console.log("customizado=", customizado)
        arvoreCustomizada.push(customizado)
        console.log("arvoreCustomizada=", arvoreCustomizada)
      }
    })  
    return arvoreOriginal
  }

  const [arrayToSelectSetor, setArrayToSelectSetor] = useState([])
  const [arrayToSelectSegmento, setArrayToSelectSegmento] = useState([])
  const [arrayToSelectServico, setArrayToSelectServico] = useState([])

  let arvoreSSSCustomizada = SETOR_SEGMENTO_SERVICO
  useEffect(() => {
    if (todasAsTabelaDePrecos.length > 0) {
      arvoreSSSCustomizada = customizaArvoreSSS(SETOR_SEGMENTO_SERVICO, todasAsTabelaDePrecos)
      const temporaryArraySetor = preencheArrayToSelect(arvoreSSSCustomizada, "setor")
      setArrayToSelectSetor(temporaryArraySetor)
    }
  }, [todasAsTabelaDePrecos])

  useEffect(() => {
    if (arrayToSelectSetor.length === 0) {
      const temporaryArraySetor = preencheArrayToSelect(arvoreSSSCustomizada, "setor")
      setArrayToSelectSetor(temporaryArraySetor)
      const temporaryArraySegmento = preencheArrayToSelect([], "segmento", "selecionar")
      setArrayToSelectSegmento(temporaryArraySegmento)
      const temporaryArrayServico = preencheArrayToSelect([], "servico", "selecionar")
      setArrayToSelectServico(temporaryArrayServico)
    }
  }, [])

  const erroNoForm = () => {
    if (tabelaDePrecos.setor === null) {
      msgToast = 'Escolha o Setor do seu negócio'
      notifyError()
      return true
    } 
    if (tabelaDePrecos.segmento === null) {
      msgToast = 'Escolha o Segmento do seu negócio'
      notifyError()
      return true
    } 
    if (tabelaDePrecos.servico === null) {
      msgToast = 'Escolha o Serviço do seu negócio'
      notifyError()
      return true
    }
    return false
  }

  const onSubmit = () => {
    if (erroNoForm()) {
      console.log("ERRO")
    } else console.log("FORM OK")
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
        const temporaryArrayServico = preencheArrayToSelect([], "servico", "selecionar")
        setArrayToSelectServico(temporaryArrayServico)
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          segmento: null,
          servico: null,
          setorCustomizado: false,
          segmentoCustomizado: false,
          servicoCustomizado: false
        }))
      } else 
      if (name === 'segmento') {
        const index = arrayToSelectSegmento.findIndex(element => element.label === label)
        const temporaryArray = preencheArrayToSelect(arrayToSelectSegmento[index].servicos, "servico")
        setArrayToSelectServico(temporaryArray) 
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          servico: null,
          segmentoCustomizado: false,
          servicoCustomizado: false
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
          segmento: null,
          servico: null,
          setorCustomizado: customizado,
          segmentoCustomizado: customizado,
          servicoCustomizado: customizado
        }))
        if (customizado) {
          const temporaryArraySegmento = preencheArrayToSelect([], "segmento", "criar")
          setArrayToSelectSegmento(temporaryArraySegmento)
          const temporaryArrayServico = preencheArrayToSelect([], "servico", "criar")
          setArrayToSelectServico(temporaryArrayServico) 
        } else {
          const temporaryArraySegmento = preencheArrayToSelect([], "segmento", "selecionar")
          setArrayToSelectSegmento(temporaryArraySegmento)
          const temporaryArrayServico = preencheArrayToSelect([], "servico", "selecionar")
          setArrayToSelectServico(temporaryArrayServico) 
        }
      }  
      if (name === 'segmento') {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          segmento: null,
          servico: null,
          segmentoCustomizado: customizado,
          servicoCustomizado: customizado
        }))
        if (customizado) {
          const temporaryArrayServico = preencheArrayToSelect([], "servico", "criar")
          setArrayToSelectServico(temporaryArrayServico) 
        } else {
          const temporaryArrayServico = preencheArrayToSelect([], "servico", "selecionar")
          setArrayToSelectServico(temporaryArrayServico)  
        }
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

  const handleChange = e => {
    const { name, value } = e.target
    const valueCapitalized = capitalizeFirst(value)
    setTabelaDePrecos(registroAnterior => ({
      ...registroAnterior, 
      [name]: valueCapitalized
    }))
  }

  const MySwal = withReactContent(Swal)
  const AvisoDeUsarTabelaExterna = () => {
    return MySwal.fire({
      title: `Quer incluir a tabela de preços no appProposta?`,
      text: `Clique em Quero incluir, retorne para a tela de segmentação e preencha os dados solicitados. Ou clique em Não para manter sua tabela externa`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Quero incluir',
      cancelButtonText: 'Não',
      customClass: {
        confirmButton: 'btn btn-primary', 
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          tabelaDePrecosExterna: false
        }))
        toggle('1')
      } else {
        toggle('1')
        setTabelaDePrecos(registroAnterior => ({
          ...registroAnterior, 
          tabelaDePrecosExterna: true
        }))
        // direcionar para a gravação da tabela de preço no BD
      }
    })
  }
  
  const onTabelaExterna = () => {
    if (!erroNoForm()) AvisoDeUsarTabelaExterna()
  }

  const onFill = () => {
    toggle('1')
  }

  console.log("==================== No Segmentacao")
  console.log("todasAsTabelaDePrecos=", todasAsTabelaDePrecos)
  console.log("tabelaDePrecos=", tabelaDePrecos)
  console.log("versaoDaTabelaDePrecos=", versaoDaTabelaDePrecos)
  console.log("itensDaTabelaDePrecos=", itensDaTabelaDePrecos)  

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
{/*             <Row>
              <FormGroup tag={Col} md='12'>
                <h4>Escolha Setor, Segmento e Serviço que melhor descrevem o seu negócio</h4>
              </FormGroup>
            </Row> */}
            <Row>
              <FormGroup tag={Col} md='6'>
                <Label>Setor:</Label>
                <Select
                  name='escolheSetor'
                  id='escolheSetor'
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={arrayToSelectSetor}
                  isClearable={false}
                  value={tabelaDePrecos.setorCustomizado ? arrayToSelectSetor[arrayToSelectSetor.length - 1] :  tabelaDePrecos.setor === null ? arrayToSelectSetor[0] : arrayToSelectSetor[arrayToSelectSetor.findIndex(element => element.label === tabelaDePrecos.setor)]}
                  onChange={handleChangeSelect}
                  autoComplete="off"
                /> 
              </FormGroup>

              {tabelaDePrecos.setorCustomizado && <FormGroup tag={Col} md='6'>
                <Label className='form-label' for='setor'>
                  Setor do seu negócio
                </Label>
                <Input
                  name='setor'
                  id='setor'
                  placeholder='Setor do seu negócio'
                  defaultValue={tabelaDePrecos.setor}
                  autoComplete="off"
                  onChange={handleChange}
                />
              </FormGroup>}
            </Row>

            <Row>
              {<FormGroup tag={Col} md='6'>
                <div key={tabelaDePrecos.setor}>
                  <Label>Segmento:</Label>
                  <Select
                    name='escolheSsegmento'
                    id='escolheSsegmento'
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    options={arrayToSelectSegmento}
                    isClearable={false}
                    value={tabelaDePrecos.segmentoCustomizado ? arrayToSelectSegmento[arrayToSelectSegmento.length - 1] : tabelaDePrecos.segmento === null ? arrayToSelectSegmento[0] : arrayToSelectSegmento[arrayToSelectSegmento.findIndex(element => element.label === tabelaDePrecos.segmento)]}
                    onChange={handleChangeSelect}
                    autoComplete="off"
                  /> 
                </div>
              </FormGroup>}
              {tabelaDePrecos.segmentoCustomizado && <FormGroup tag={Col} md='6'>
                <Label className='form-label' for='segmento'>
                  Segmento do seu negócio
                </Label>
                <Input
                  name='segmento'
                  id='segmento'
                  placeholder='Segmento do seu negócio'
                  defaultValue={tabelaDePrecos.segmento}
                  autoComplete="off"

                  onChange={handleChange}
                />
              </FormGroup>}
            </Row>

            <Row>
              {<FormGroup tag={Col} md='6'>
                <div key={tabelaDePrecos.segmento}>            
                  <Label>Serviço:</Label>
                  <Select
                    name='escolheServico'
                    id='escolheServico'
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    options={arrayToSelectServico}
                    isClearable={false}
                    value={tabelaDePrecos.servicoCustomizado ? arrayToSelectServico[arrayToSelectServico.length - 1] : tabelaDePrecos.servico === null ? arrayToSelectServico[0] : arrayToSelectServico[arrayToSelectServico.findIndex(element => element.label === tabelaDePrecos.servico)]}
                    onChange={handleChangeSelect}
                    autoComplete="off"
                  /> 
                </div>
              </FormGroup>}
              {tabelaDePrecos.servicoCustomizado && <FormGroup tag={Col} md='6'>
                <Label className='form-label' for='servico'>
                  Serviço do seu negócio
                </Label>
                <Input
                  name='servico'
                  id='servico'
                  placeholder='Serviço do seu negócio'
                  defaultValue={tabelaDePrecos.servico}
                  autoComplete="off"
                  onChange={handleChange}
                />
              </FormGroup>}
            </Row>

        </TabPane>
        <TabPane tabId='2'>
          Parametriza como tabela externa
        </TabPane>
      </TabContent>

      <Form>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button.Ripple>
          <Button.Ripple color='primary' className='btn-next' onClick={() => onSubmit()}>
            <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default Segmentacao
