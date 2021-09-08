import * as yup from 'yup'
import { Fragment, useState, useEffect } from 'react'
import { selectThemeColors, capitalizeFirst } from '@utils'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Form, Label, Input, FormGroup, Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap'
import { SETOR_SEGMENTO_SERVICO, DADO_INFORMATIVO_OBRIGATORIO, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS } from '../../../../../configs/appProposta'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { ErrorToast }  from '../../../Toasts/ToastTypes'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Segmentacao = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {
  let msgToast = ''
  const notifyError = () => toast.error(<ErrorToast msg={msgToast} />, { hideProgressBar: true, autoClose: 5000 })

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

  const customizaArvoreSSS = (arvoreOriginal, todasAsTabelaDePrecos) => { 
    const arvoreCustomizada = arvoreOriginal
    todasAsTabelaDePrecos.map((item, index, array) => {
      let setorCustomizado = null
      if (item.setorCustomizado) {
        setorCustomizado = {
          name: "setor",
          label: item.setor,
          value: item.setor,
          type: "opcao",
          dadosInformativosSugeridos: []
        }
        /* Pendiencia: carregar dadosInformativosSugeridos e parametrosSugeridos */

        const existe = arvoreCustomizada.findIndex(element => element.value === item.setor)
        if (existe === -1) arvoreCustomizada.push(setorCustomizado) // se não existe então push
      }

      let segmentoCustomizado = null
      if (item.segmentoCustomizado) {
        segmentoCustomizado = {
          name: "segmento",
          label: item.segmento,
          value: item.segmento,
          type: "opcao"
        }
        const indexSetorPai = arvoreCustomizada.findIndex(element => element.value === item.setor)
        if (arvoreCustomizada[indexSetorPai].hasOwnProperty('segmentos')) {
          const existe = arvoreCustomizada[indexSetorPai].segmentos.findIndex(element => element.value === item.segmento)
          if (existe === -1) arvoreCustomizada[indexSetorPai].segmentos.push(segmentoCustomizado) // se não existe então push
        } else arvoreCustomizada[indexSetorPai].segmentos = [segmentoCustomizado] 
      } 

      let servicoCustomizado = null
      if (item.servicoCustomizado) {
        servicoCustomizado = {
          name: "servico",
          label: item.servico,
          value: item.servico,
          type: "opcao"
        }
        const indexSetorPai = arvoreCustomizada.findIndex(element => element.value === item.setor)
        const indexSegmentoPai = arvoreCustomizada[indexSetorPai].segmentos.findIndex(element => element.value === item.segmento)
        if (arvoreCustomizada[indexSetorPai].segmentos[indexSegmentoPai].hasOwnProperty('servicos')) {
          const existe = arvoreCustomizada[indexSetorPai].segmentos[indexSegmentoPai].servicos.findIndex(element => element.value === item.servico)
          if (existe === -1) arvoreCustomizada[indexSetorPai].segmentos[indexSegmentoPai].servicos.push(servicoCustomizado) // se não existe então push
        } else arvoreCustomizada[indexSetorPai].segmentos[indexSegmentoPai].servicos = [servicoCustomizado] 
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
      let temporaryArraySegmento = null
      let temporaryArrayServico = null
      if (operacao === 'Criar') {
        if (tabelaDePrecos.hasOwnProperty('segmento') && tabelaDePrecos.segmento !== null) {
          const index = temporaryArraySetor.findIndex(element => element.label === tabelaDePrecos.setor)
          temporaryArraySegmento = preencheArrayToSelect(temporaryArraySetor[index].segmentos, "segmento")
          setArrayToSelectSegmento(temporaryArraySegmento)  
          if (tabelaDePrecos.servico !== null) {
            const index = temporaryArraySegmento.findIndex(element => element.label === tabelaDePrecos.segmento)
            temporaryArrayServico = preencheArrayToSelect(temporaryArraySegmento[index].servicos, "servico")
            setArrayToSelectServico(temporaryArrayServico) 
          }
        }
      }
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

  const erroNoForm = () => {
    if (erroQuantidadeDeCaracteres(tabelaDePrecos.setor, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) > 0) {
      msgToast = 'Escolha o Setor do seu negócio'
      notifyError()
      return true
    } 
    if (erroQuantidadeDeCaracteres(tabelaDePrecos.segmento, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) > 0) {
      msgToast = 'Escolha o Segmento do seu negócio'
      notifyError()
      return true
    } 
    if (erroQuantidadeDeCaracteres(tabelaDePrecos.servico, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) > 0) {
      msgToast = 'Escolha o Serviço do seu negócio'
      notifyError()
      return true
    }

    let erro = false
    todasAsTabelaDePrecos.map((item, index, array) => {
      if (operacao === 'Criar') {
        if (item.setor === tabelaDePrecos.setor && item.segmento === tabelaDePrecos.segmento && item.servico === tabelaDePrecos.servico) {
          msgToast = 'Já existe uma tabela de preços com os mesmos Setor/ Segmento/ Serviço'
          notifyError()
          erro = true
        }
      }
    })
    
    if (erro) return true
    else return false
  }

  const onSubmit = () => {
    if (erroNoForm()) {
      // Não permite avançar no formulário
    } else stepper.next()
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

        const dadosInformativosSugeridos = arrayToSelectSetor[index].dadosInformativosSugeridos
        const dadosInformativosObrigatorios = [DADO_INFORMATIVO_OBRIGATORIO]
        setDadosInformativosOpcionais(dadosInformativosSugeridos)
        setDadosInformativosObrigatorios(dadosInformativosObrigatorios)
        
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

          const dadosInformativosObrigatorios = [DADO_INFORMATIVO_OBRIGATORIO]
          setDadosInformativosOpcionais([])
          setDadosInformativosObrigatorios(dadosInformativosObrigatorios)
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

  return (   
    <Fragment>
      <Nav className='justify-content-end' pills>
        {(operacao === 'Criar') && <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              onFill()
            }}
          >
            Segmentar
          </NavLink>
        </NavItem>}
        {(operacao === 'Criar') && <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              onTabelaExterna()
            }}
          >
            Usar tabela externa
          </NavLink>
        </NavItem>}
      </Nav>

      <TabContent className='py-50' activeTab={active}>
        <TabPane tabId='1'>
          <h4 tag='h4'>Segmentação</h4>
          {(operacao === 'Criar') && <p><code>Selecione</code> ou <code>crie</code> a segmentação mais adequada ao seu negócio.</p>}
          <Row>
            {(operacao === 'Criar') && <FormGroup tag={Col} md='6'>
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
            </FormGroup>}
            {(operacao === 'Atualizar') && <FormGroup tag={Col} md='6'>
              <Label className='form-label'>
                Setor:
              </Label>
              <Input
                name='setor'
                id='setor'
                placeholder='Setor do seu negócio'
                autoComplete="off"
                onChange={handleChange}
                value={tabelaDePrecos.setor}
                disabled={!tabelaDePrecos.setorCustomizado }
              />
              {erroQuantidadeDeCaracteres(tabelaDePrecos.setor, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
            </FormGroup>}

            {(operacao === 'Criar') && tabelaDePrecos.setorCustomizado && <FormGroup tag={Col} md='6'>
              <Label className='form-label' for='setor'>
                Setor do seu negócio:
              </Label>
              <Input
                name='setor'
                id='setor'
                placeholder='Setor do seu negócio'
                defaultValue={tabelaDePrecos.setor}
                autoComplete="off"
                onChange={handleChange}
              /> 
              {erroQuantidadeDeCaracteres(tabelaDePrecos.setor, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
            </FormGroup>}
          </Row>

          <Row>
            {(operacao === 'Criar') && <FormGroup tag={Col} md='6'>
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
            {(operacao === 'Atualizar') && <FormGroup tag={Col} md='6'>
              <Label className='form-label'>
              Segmento:
              </Label>
              <Input
                name='segmento'
                id='segmento'
                autoComplete="off"
                onChange={handleChange}
                value={tabelaDePrecos.segmento}
                disabled={!tabelaDePrecos.segmentoCustomizado}
              />
              {erroQuantidadeDeCaracteres(tabelaDePrecos.segmento, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
            </FormGroup>}

            {(operacao === 'Criar') && tabelaDePrecos.segmentoCustomizado && <FormGroup tag={Col} md='6'>
              <Label className='form-label' for='segmento'>
                Segmento do seu negócio:
              </Label>
              <Input
                name='segmento'
                id='segmento'
                placeholder='Segmento do seu negócio'
                defaultValue={tabelaDePrecos.segmento}
                autoComplete="off"
                onChange={handleChange}
              />
              {erroQuantidadeDeCaracteres(tabelaDePrecos.segmento, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
            </FormGroup>}
          </Row>

          <Row>
            {(operacao === 'Criar') && <FormGroup tag={Col} md='6'>
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
            {(operacao === 'Atualizar') && <FormGroup tag={Col} md='6'>
              <Label className='form-label'>
                Serviço:
              </Label>
              <Input
                name='servico'
                id='servico'
                autoComplete="off"
                onChange={handleChange}
                value={tabelaDePrecos.servico}
                disabled={!tabelaDePrecos.servicoCustomizado}
              />
              {erroQuantidadeDeCaracteres(tabelaDePrecos.servico, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
            </FormGroup>}

            {(operacao === 'Criar') && tabelaDePrecos.servicoCustomizado && <FormGroup tag={Col} md='6'>
              <Label className='form-label' for='servico'>
                Serviço do seu negócio:
              </Label>
              <Input
                name='servico'
                id='servico'
                placeholder='Serviço do seu negócio'
                defaultValue={tabelaDePrecos.servico}
                autoComplete="off"
                onChange={handleChange}
              />
              {erroQuantidadeDeCaracteres(tabelaDePrecos.servico, QTDADE_MIN_LETRAS_SSS, QTDADE_MAX_LETRAS_SSS) === 2 && <Alert color='danger'>Use entre {QTDADE_MIN_LETRAS_SSS} e {QTDADE_MAX_LETRAS_SSS} caracteres</Alert>}
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
