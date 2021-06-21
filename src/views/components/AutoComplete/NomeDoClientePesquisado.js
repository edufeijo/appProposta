import { useEffect, useState } from 'react'
import { Label } from 'reactstrap'
import db from '../../../db'
import Erro from '../../components/Erro'
import AutoComplete from '@components/autocomplete'
import classnames from 'classnames'

const NomeDoClientePesquisado = ({ proposta, setProposta, label, placeHolder }) => {
  const [erro, setErro] = useState(null)
  const [clienteEncontrado, setClienteEncontrado] = useState(false)
  const [opcaoDeClientes, setOpcaoDeClientes] = useState([])

  const procurarCliente = (value) => {
    if (value.length > 0) {
      if (!proposta.isNewCliente) { // Se não é novo cliente então Procura o cliente no BD  
        const regex = { $regex: `${value}`, $options: "i" } // "ï" para case insensitive
        const procuraEOrdena = { // Retorna todos os clientes no regex
          bd: "clientes",
          operador: "sort",
          pesquisa: { idDaEmpresa: proposta.idDaEmpresa, nomeDoCliente: regex }, 
          ordenadoPor: { nomeDoCliente: 1 }, // em ordem crescente
          sortStringAsNumber: false, 
          cardinalidade: 5 // retorna as 5 primeiras ocorrências
        } 
        db.getGenerico(procuraEOrdena, false) 
        .then(async (clientesRetornados) => {  
          setOpcaoDeClientes(clientesRetornados)
        })
        .catch((err) => {
          setErro(err)
          setErro(null)
        }) 
      }
    } 
  }

  const handleChangeAutoComplete = e => {
    const { value } = e.target
    setProposta(registroAnterior => ({
      ...registroAnterior, 
      nomeDoCliente: value
    }))

    procurarCliente(value)

    if (clienteEncontrado) {
      setProposta(registroAnterior => ({
        ...registroAnterior, 
        nomeDoCliente: value,
        idDoCliente: null
      }))
      setClienteEncontrado(false)
    } 
  }

  useEffect(() => {
    if (proposta.idDoCliente !== null) setClienteEncontrado(true)
  }, [])

  return (
    <div>
      {label && label.length && <Label className='form-label' for='nomeDoClienteASerPesquisado'>
        {label}
      </Label>}
      <AutoComplete
        name='nomeDoClienteASerPesquisado'
        id='nomeDoClienteASerPesquisado'
        suggestions={opcaoDeClientes}
        className='form-control'
        filterKey='nomeDoCliente'
        placeholder={placeHolder}
        value={proposta.nomeDoCliente}
        onChange={handleChangeAutoComplete}
        customRender={(
          suggestion,
          i,
          filteredData,
          activeSuggestion,
          onSuggestionItemClick,
          onSuggestionItemHover
        ) => (
          <li
            className={classnames('suggestion-item', {
              active: filteredData.indexOf(suggestion) === activeSuggestion
            })}
            key={suggestion._id}
            onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(suggestion))}
            onClick={e => {
              setProposta(registroAnterior => ({
                ...registroAnterior, 
                idDoCliente: suggestion._id,
                nomeDoCliente: suggestion.nomeDoCliente
              }))
              onSuggestionItemClick(null, e)
              setClienteEncontrado(true)
            }}
          >
            <span>{suggestion.nomeDoCliente}</span>
          </li>
        )}
      />
      <Erro erro={erro} />
    </div>
  )
}   

export {
  NomeDoClientePesquisado
}