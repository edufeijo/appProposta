import { Fragment } from 'react'
import PropostaExterna from './detalhes/PropostaExterna'
import LinhaALinha from './detalhes/LinhaALinha'

const Detalhes = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao, stepper, type }) => {
  return (
    <Fragment>
      {proposta && proposta.propostaCriadaPor === 'Linha a linha' && <LinhaALinha 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />}

      {proposta && proposta.propostaCriadaPor === 'Documento externo' && <PropostaExterna 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />}
    </Fragment>
  )
}

export default Detalhes
