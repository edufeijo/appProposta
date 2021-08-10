import { Fragment } from 'react'
import PropostaExterna from './detalhes/PropostaExterna'
import LinhaALinha from './detalhes/LinhaALinha'

const ItensDePreco = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, template, operacao, stepper, type }) => {
  return (
    <Fragment>
      <LinhaALinha 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    </Fragment>
  )
}

export default ItensDePreco
