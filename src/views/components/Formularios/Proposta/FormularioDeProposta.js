import { useRef, useState } from 'react'
import Wizard from '@components/wizard'
import Alerta from './steps-with-validation/Alerta'
import Detalhes from './steps-with-validation/Detalhes'
import Identificacao from './steps-with-validation/Identificacao'

const FormularioDeProposta = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, operacao }) => {
  const [stepper, setStepper] = useState(null)
  const ref = useRef(null)

  const steps = [
    {
      id: 'identificacao',
      title: 'Identificação',
      subtitle: 'Identifique a proposta.',
      content: <Identificacao 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'detalhes',
      title: 'Informações',
      subtitle: 'Detalhe a proposta',
      content: <Detalhes 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'config',
      title: 'Configuração',
      subtitle: 'Configure a exibição da proposta',
      content: <Detalhes 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'alerta',
      title: 'Alerta',
      subtitle: 'Acompanhe o status da proposta',
      content: <Alerta 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default FormularioDeProposta
