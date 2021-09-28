import { Fragment, useState, useEffect } from 'react'
import { Trash, Copy, Edit, MoreVertical, Plus } from 'react-feather'
import { Button, Row, Badge, ListGroup, ListGroupItem, UncontrolledDropdown, Input, DropdownToggle, InputGroup, FormGroup, Col, DropdownMenu, DropdownItem, FormFeedback, Label, Alert } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, isObjEmpty } from '@utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm  } from 'react-hook-form'
import { QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA, VALORES_INICIAIS_DA_OPCAO_DA_SELECAO } from '../../../../../../configs/appProposta'

// PAREI AQUI:
// - Implementar o PreenchimentoDaTabela
// - fazer as consistencias e mensagens de erro da tabela

const quantidadeDeVariaveisDaTabela = [
  { name: 'quantidadeDeVariaveisDaTabela', value: 1, label: '1 dimensão' },
  { name: 'quantidadeDeVariaveisDaTabela', value: 2, label: '2 dimensões' }
]

const findVariavelById = (variaveis, id) => { 
  return variaveis.findIndex(element => element.id === id)
}

const InputNumeroNoIntervalo = ({ indexDoIntervalo, dimensao, labelDoNumero, tabela, setTabela}) => { 
  const SignupSchema = yup.object().shape({
    [`inputNumero${labelDoNumero}${indexDoIntervalo}`]: yup.string().min(0).max(QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA).matches(/^-?\d*,?\d+$/).required() 
  })

  const { register, errors, handleSubmit, trigger } = useForm({ 
    mode: 'onChange', 
    resolver: yupResolver(SignupSchema)
  })

  const defaultValue = tabela[dimensao].intervalos[indexDoIntervalo].valor
  const ultimoIntervalo = tabela[dimensao].intervalos.length - 1

  const handleChange = e => {
    const { value } = e.target
    const tabelaTemporaria = Object.assign({}, tabela)
    tabelaTemporaria[dimensao].intervalos[indexDoIntervalo].valor = value

    if (isObjEmpty(errors)) delete tabelaTemporaria[dimensao].intervalos[indexDoIntervalo].erroNoIntervalo.valor
    else tabelaTemporaria[dimensao].intervalos[indexDoIntervalo].erroNoIntervalo.valor = true  
  
    setTabela(tabelaTemporaria)
  }

  return (
    <Fragment>
      <Label className='form-label' for={`inputNumero${labelDoNumero}${indexDoIntervalo}`}>
        {labelDoNumero}
      </Label>
      <InputGroup className='input-group-merge mb-2'>
        {!(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo) && <Input
          name={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          id={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          placeholder={`${labelDoNumero}`}
          defaultValue={defaultValue}
          autoComplete="off"
          innerRef={register({ required: true })}
          invalid={errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && true}
          onChange={handleChange}
        />}
        {(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo) && <Input
          name={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          id={`inputNumero${labelDoNumero}${indexDoIntervalo}`}
          placeholder={defaultValue === null ? `Não há valor definido` : defaultValue}
          defaultValue={defaultValue}
          disabled={true}
        />}
        {errors && errors[`inputNumero${labelDoNumero}${indexDoIntervalo}`] && <FormFeedback>Máximo de {QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA } caracteres (incluindo números, vírgula e sinal de menos)</FormFeedback>}
      </InputGroup> 
    </Fragment>
  )
}

const ConfiguraIntervalos = ({ index, variaveis, dimensao, tabela, setTabela }) => {
  const [countIntervalos, setCountIntervalos] = useState(4)
  console.log("countIntervalos=", countIntervalos)
  console.log("tabela[dimensao].intervalos=", tabela[dimensao].intervalos)

  const ultimoIntervalo = tabela[dimensao].intervalos.length - 1

  useEffect(() => {
    setCountIntervalos(tabela[dimensao].intervalos.length)
  }, [tabela[dimensao].intervalos.length])  

  const erroNosIntervalos = () => {
    let erroNoIntervalo = null
    tabela[dimensao].intervalos.map((intervalo, index) => {
      if (index > 0 && index < tabela[dimensao].intervalos.length - 1) {
        if (intervalo.valor === null || intervalo.valor === '') {
          erroNoIntervalo = 'campo vazio'
        }
      } 
    })

    if (erroNoIntervalo) return erroNoIntervalo 

    tabela[dimensao].intervalos.map((intervalo, index) => {
      if (index === 1) {
        const campo1Vazio = tabela[dimensao].intervalos[0].valor === null || tabela[dimensao].intervalos[0].valor === ''
        const campo2Vazio = intervalo.valor === null || intervalo.valor === ''
        if (!(campo1Vazio || campo2Vazio)) {
          const op1 = parseFloat(tabela[dimensao].intervalos[0].valor.replace(",", "."))
          const op2 = parseFloat(intervalo.valor.replace(",", "."))
          if (op1 >= op2) {
            erroNoIntervalo = 'fora de ordem'
          }
        }
      } else {
        const ultimo = tabela[dimensao].intervalos.length - 1
        if (index === ultimo) {
          const campoVazio = tabela[dimensao].intervalos[ultimo].valor === null || tabela[dimensao].intervalos[ultimo].valor === ''
          if (!campoVazio) {
            const op1 = parseFloat(intervalo.valor.replace(",", "."))
            const op2 = parseFloat(tabela[dimensao].intervalos[ultimo - 1].valor.replace(",", "."))
            if (op1 <= op2) {
              erroNoIntervalo = 'fora de ordem'
            }
          }
        } else 
        if (index > 1 && index < ultimo) {
          const op1 = parseFloat(intervalo.valor.replace(",", "."))
          const op2 = parseFloat(tabela[dimensao].intervalos[index - 1].valor.replace(",", "."))
          if (op1 <= op2) {
            erroNoIntervalo = 'fora de ordem'
          }
        }
      }
    })  
    return erroNoIntervalo // 'fora de ordem'
  }

  const criaIntervalo = () => { 
    const tabelaTemporaria = Object.assign({}, tabela)
    const novoIntervalo = Object.assign({}, { 
      valor: null,
      erroNoIntervalo: {} 
    })
    tabelaTemporaria[dimensao].intervalos.push(Object.assign({}, novoIntervalo))
    setTabela(tabelaTemporaria)
  } 

  const excluiIntervalo = (i) => {
    const tabelaTemporaria = Object.assign({}, tabela)
    if (tabelaTemporaria[dimensao].intervalos.length > 3) {
      const itensCopy = Array.from(tabelaTemporaria[dimensao].intervalos)
      itensCopy.splice(i, 1)
      tabelaTemporaria[dimensao].intervalos.length = 0
      tabelaTemporaria[dimensao].intervalos = itensCopy
      setTabela(tabelaTemporaria)
    } // else, não deixa ter menos do que 2 intervalos
  } 
  
  return (
    <Fragment>
      <div key={countIntervalos}>
        <p>Preencha os <code>intervalos</code> desta variável.</p>
        <ListGroup>
          {tabela[dimensao].intervalos.map((intervalo, indexDoIntervalo) => {
            return (
              <ListGroupItem key={indexDoIntervalo}>
                <Row className='justify-content-between align-items-center'>
                  <Col md={6}>
                    <InputNumeroNoIntervalo 
                      indexDoIntervalo={indexDoIntervalo}
                      dimensao={dimensao}
                      id={`maiorOuIgualA${index}`}
                      labelDoNumero={indexDoIntervalo === 0 ? 'Maior ou iguar a:' : indexDoIntervalo === tabela[dimensao].intervalos.length - 1 ? 'Menor que:' : `Valor intermediário ${indexDoIntervalo}:`}
                      tabela={tabela}
                      setTabela={setTabela}  
                    />
                  </Col>  
                  {!(indexDoIntervalo === 0 || indexDoIntervalo === ultimoIntervalo) && <div>
                    {(tabela[dimensao].intervalos.length > 3) && <Col sd={6}>
                      <Button.Ripple color='danger' color='flat-danger' onClick={() => excluiIntervalo(indexDoIntervalo)}>
                        <Trash size={18}/>
                      </Button.Ripple>
                    </Col>}
                    {(indexDoIntervalo === ultimoIntervalo - 1) && <Col sd={6}>
                      <Button.Ripple block color='danger' color='flat-primary' onClick={() => criaIntervalo()}>
                        <Plus size={18}/>
                      </Button.Ripple>
                    </Col>}
                  </div>}
                </Row>
              </ListGroupItem>
            )
          })}
        </ListGroup>
        {erroNosIntervalos() === 'campo vazio' && <Alert color='danger'>Preencha todos os campos acima descritos como 'Valor intermediário'</Alert>}
        {erroNosIntervalos() === 'fora de ordem' && <Alert color='danger'>Os campos devem estar com valores em ordem crescente e sem repetições</Alert>}
      </div>
    </Fragment>
  )
}

const ConfiguraTabela = ({ index, variaveis, tabela, setTabela }) => {
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
    const tabelaTemporaria = Object.assign({}, tabela)

    if (!tabelaTemporaria.hasOwnProperty('dimensao1')) tabelaTemporaria.dimensao1 = { id: null }

    if (quantidade === 1) {
      delete tabelaTemporaria.dimensao2
      if (tabelaTemporaria.hasOwnProperty('erroNaTabela')) delete tabelaTemporaria.erroNaTabela.dimesaoDuplicada
    } else if (!tabelaTemporaria.hasOwnProperty('dimensao2')) tabelaTemporaria.dimensao2 = { id: null }
    
    setTabela(tabelaTemporaria)
    setQuantidadeDeDimensoesDaTabela(quantidade)
  }

  const montaIntervalos = (variavel) => {
    const { valorMinimo, valorMaximo} =  variavel
    if (valorMinimo && valorMaximo) {
      const minimo = parseFloat(valorMinimo.replace(",", "."))
      const maximo = parseFloat(valorMaximo.replace(",", "."))  
      const diferenca = maximo - minimo
      const i1 = diferenca >= 3 ? (Math.round(diferenca / 3) + minimo).toString() : null
      const i2 = diferenca >= 3 ? ((Math.round(diferenca / 3) * 2) + minimo).toString() : null
      return [ 
        { 
          valor: valorMinimo, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: i1, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: i2, 
          erroNoIntervalo: {} 
        },
        { 
          valor: valorMaximo, 
          erroNoIntervalo: {} 
        }
      ]
    } else {
      if (valorMinimo) return [
        { 
          valor: valorMinimo, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        },        
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }
      ]
      if (valorMaximo) return [
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: valorMaximo, 
          erroNoIntervalo: {} 
        }
      ]
      else return [
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }, 
        { 
          valor: null, 
          erroNoIntervalo: {} 
        }
      ]
    }
  }

  const setDimensao = (dimensaoEscolhida, dimensao) => { 
    const tabelaTemporaria = Object.assign({}, tabela)
    
    tabelaTemporaria[dimensao].id = dimensaoEscolhida.id
    
    if (dimensaoEscolhida.conteudo.tipoDaVariavel === 'NUMERO') {
      if (!tabelaTemporaria[dimensao].hasOwnProperty('intervalos')) tabelaTemporaria[dimensao].intervalos = montaIntervalos(dimensaoEscolhida.conteudo)
    } else delete tabelaTemporaria[dimensao].intervalos

    if (tabelaTemporaria.hasOwnProperty('dimensao2')) {
      if (tabelaTemporaria.dimensao2.id) {
        if (tabelaTemporaria.dimensao1.id === tabelaTemporaria.dimensao2.id) tabelaTemporaria.erroNaTabela.dimesaoDuplicada = true
        else delete tabelaTemporaria.erroNaTabela.dimesaoDuplicada
      }
    }

    setTabela(tabelaTemporaria)
  }

  console.log("tabela=", tabela) 

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
        {tabela.hasOwnProperty('dimensao1') && tabela.dimensao1.hasOwnProperty('id') && tabela.dimensao1.id && variaveis[findVariavelById(variaveis, tabela.dimensao1.id)].conteudo.tipoDaVariavel === 'NUMERO' && <ConfiguraIntervalos
          index={index}
          variaveis={variaveis}
          dimensao='dimensao1'
          tabela={tabela}
          setTabela={setTabela}  
        />} 
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
        {tabela.erroNaTabela && tabela.erroNaTabela.dimesaoDuplicada && <Alert color='danger'>Escolha dimensões distintas</Alert>}
      </div>}
    </Fragment>
  )
}

export default ConfiguraTabela
