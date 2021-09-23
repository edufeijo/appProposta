import { Fragment, useState, useEffect } from 'react'
import { Copy, Edit, MoreVertical } from 'react-feather'
import { Row, Badge, ListGroupItem, UncontrolledDropdown, DropdownToggle, InputGroup, Input, DropdownMenu, DropdownItem, FormFeedback, Label, Alert } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO, QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'
 
const quantidadeDeVariaveisDaTabela = [
  { name: 'quantidadeDeVariaveisDaTabela', value: 1, label: '1 dimensão' },
  { name: 'quantidadeDeVariaveisDaTabela', value: 2, label: '2 dimensões' }
]

const HeaderDoIntervalo = ({ index, tabela, setTabela, countOpcoes, setCountOpcoes }) => {                           
  const criaOpcao = () => { 
    const item = Object.assign({}, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO)
    let id = 0
    if (opcoes.length === 1) id = opcoes[0].id + 1
    else {
      const numbers = Array.from(opcoes)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.label = `Opção ${opcoes.length + 1}`
    opcoes.push(Object.assign({}, item))

    console.log("-------------------------")
    console.log("item=", item)
    console.log("opcoes=", opcoes)
    setCountOpcoes(countOpcoes + 1)
  }

  const excluiOpcao = (i) => {
    if (opcoes.length > 1) {
      const itensCopy = Array.from(opcoes)
      itensCopy.splice(i, 1)
      setOpcoes(itensCopy)
      setCountOpcoes(countOpcoes - 1)
    } else {
      const item = VALORES_INICIAIS_DA_OPCAO_DA_SELECAO
      const id = opcoes[0].id + 1
      item.id = id
      setOpcoes([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(opcoes[index].erroNaOpcao) ? 'light-primary' : 'light-danger'}  pill>
          Opção {index + 1}
        </Badge>
        <div className='column-action d-flex align-items-center'> 
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaOpcao()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar opção</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar opção</span>
              </DropdownItem>                                 
              <DropdownItem className='w-100' onClick={() => excluiOpcao(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir opção</span>
              </DropdownItem>               
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const HeaderDoPreenchimento = ({ index, tabela, setTabela, countOpcoes, setCountOpcoes }) => {                           
  const criaOpcao = () => { 
    const item = Object.assign({}, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO)
    let id = 0
    if (opcoes.length === 1) id = opcoes[0].id + 1
    else {
      const numbers = Array.from(opcoes)
      numbers.sort(function(a, b) {
        return a.id - b.id
      })
      id = numbers[numbers.length - 1].id + 1
    }
    item.id = id
    item.label = `Opção ${opcoes.length + 1}`
    opcoes.push(Object.assign({}, item))

    console.log("-------------------------")
    console.log("item=", item)
    console.log("opcoes=", opcoes)
    setCountOpcoes(countOpcoes + 1)
  }

  const excluiOpcao = (i) => {
    if (opcoes.length > 1) {
      const itensCopy = Array.from(opcoes)
      itensCopy.splice(i, 1)
      setOpcoes(itensCopy)
      setCountOpcoes(countOpcoes - 1)
    } else {
      const item = VALORES_INICIAIS_DA_OPCAO_DA_SELECAO
      const id = opcoes[0].id + 1
      item.id = id
      setOpcoes([item])
    } 
  }  

  return (
    <Fragment>
      <Row>
        <Badge color={isObjEmpty(opcoes[index].erroNaOpcao) ? 'light-primary' : 'light-danger'}  pill>
          Opção {index + 1}
        </Badge>
        <div className='column-action d-flex align-items-center'> 
          <UncontrolledDropdown direction='left'>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className='w-100' onClick={() => criaOpcao()}>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Criar opção</span>
              </DropdownItem>               
              <DropdownItem className='w-100'>
                <Edit size={14} className='mr-50' />
                <span className='align-middle'>Duplicar opção</span>
              </DropdownItem>                                 
              <DropdownItem className='w-100' onClick={() => excluiOpcao(index)}>
                <Copy size={14} className='mr-50' />
                <span className='align-middle'>Excluir opção</span>
              </DropdownItem>               
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Row>
    </Fragment>
  )
}

const ConfiguraTabela = ({ index, variaveis, setVariaveis, tabela, setTabela }) => {
  const [quantidadeDeDimensoesDaTabela, setQuantidadeDeDimensoesDaTabela] = useState(0) 
  const [dimensoesOptions, setDimensoesOptions] = useState([]) // Precisa verificar se dimensoesOptions é maior que zero
//  let defaultValue = null

  const montaDimensoes = () => { 
    dimensoesOptions.length = 0
    variaveis.map(variavel => {
      if (variavel.conteudo.tipoDaVariavel === 'NUMERO' || variavel.conteudo.tipoDaVariavel === 'SIMNAO' || variavel.conteudo.tipoDaVariavel === 'SELECAO') {
        dimensoesOptions.push(variavel)
      }
    })  
  }

  useEffect(() => {
    if (variaveis.length) montaDimensoes()
  }, [variaveis])

  montaDimensoes()
/*   if (componentesDoItem.variavel) defaultValue = componentesDoItem.variavel
  else defaultValue = variaveisNumericas.length ? variaveisNumericas[0] : null */

  const setQuantidadeDeDimensoes = (quantidade) => { 
    const temporaryarray = Array.from(variaveis)

    if (!temporaryarray[index].conteudo.tabela.hasOwnProperty('dimensao1')) temporaryarray[index].conteudo.tabela.dimensao1 = { id: dimensoesOptions[0].id }

    if (quantidade === 1) {
      delete temporaryarray[index].conteudo.tabela.dimensao2
      delete temporaryarray[index].erroNaVariavel.dimesaoDuplicada
    } else if (!temporaryarray[index].conteudo.tabela.hasOwnProperty('dimensao2')) temporaryarray[index].conteudo.tabela.dimensao2 = { id: dimensoesOptions[1].id }
    
    setVariaveis(temporaryarray)
    setQuantidadeDeDimensoesDaTabela(quantidade)
  }

  const setDimensao = (dimensaoEscolhida, dimensao) => { 
    const temporaryarray = Array.from(variaveis)
    
    temporaryarray[index].conteudo.tabela[dimensao].id = dimensaoEscolhida.id
    if (dimensaoEscolhida.conteudo.tipoDaVariavel === 'NUMERO') temporaryarray[index].conteudo.tabela[dimensao].intervalo = []
    else delete temporaryarray[index].conteudo.tabela[dimensao].intervalo

    if (temporaryarray[index].conteudo.tabela.hasOwnProperty('dimensao2')) {
      if (temporaryarray[index].conteudo.tabela.dimensao1.id === temporaryarray[index].conteudo.tabela.dimensao2.id) temporaryarray[index].erroNaVariavel.dimesaoDuplicada = true
      else delete temporaryarray[index].erroNaVariavel.dimesaoDuplicada
    }

    setVariaveis(temporaryarray)
  }
  
  console.log("------------------------ ConfiguraTabela -----------------")
  console.log("tabela=", tabela)
  console.log("quantidadeDeDimensoesDaTabela=", quantidadeDeDimensoesDaTabela)
  console.log("dimensoesOptions=", dimensoesOptions)

  // Incluir no Select abaixo: value={tipoDaVariavelOptions[tipoDaVariavelOptions.findIndex(element => element.value === variaveis[index].conteudo.tipoDaVariavel)]}
  return (
    <Fragment>
      {/* Caso dimensoesOptions.lenght === 0 então far um alerta e retornar */}

      {dimensoesOptions.length && <Label className='form-label' for={`quantidadeDeVariaveisDaTabela${index}`}>Tabela com 1 ou 2 dimensões?</Label>}
      {dimensoesOptions.length === 1 && <Select
        id={`quantidadeDeVariaveisDaTabela${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        options={quantidadeDeVariaveisDaTabela}
        defaultValue={quantidadeDeVariaveisDaTabela[0]}
        onChange={e => { setQuantidadeDeDimensoes(e.value) }}
        isClearable={false}
        isDisabled={true}
      />}
      {dimensoesOptions.length === 2 && <Select
        id={`quantidadeDeVariaveisDaTabela${index}`}               
        theme={selectThemeColors}
        maxMenuHeight={120}
        className='react-select'
        classNamePrefix='select'
        options={quantidadeDeVariaveisDaTabela}
        onChange={e => { setQuantidadeDeDimensoes(e.value) }}
        isClearable={false}
      />}

      {quantidadeDeDimensoesDaTabela > 0 && <div>
        <Label className='form-label' for={`dimensao1${index}`}>Escolha a{quantidadeDeDimensoesDaTabela === 2 && ' 1ª'} dimensão:</Label>      
        <Select
          id={`dimensao1${index}`}               
          theme={selectThemeColors}
          maxMenuHeight={120}
          className='react-select'
          classNamePrefix='select'
          options={dimensoesOptions}
          onChange={e => { setDimensao(e, 'dimensao1') }}
          isClearable={false}
        />
        {/* PAREI AQUI:
        - Se dimensão é NUMERO então abre formulário para digitar os intervalos
        */}
      </div>}

      {quantidadeDeDimensoesDaTabela === 2 && <div>
        <Label className='form-label' for={`dimensao2${index}`}>Escolha a 2ª dimensão:</Label>      
        <Select
          id={`dimensao2${index}`}               
          theme={selectThemeColors}
          maxMenuHeight={120}
          className='react-select'
          classNamePrefix='select'
          options={dimensoesOptions}
          onChange={e => { setDimensao(e, 'dimensao2') }}
          isClearable={false}
        />
        {variaveis[index].erroNaVariavel.dimesaoDuplicada && <Alert color='danger'>Escolha dimensões distintas</Alert>}
      </div>}
    </Fragment>
  )
}

export default ConfiguraTabela
