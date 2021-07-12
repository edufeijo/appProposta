import { useRef, useState } from 'react'
import Wizard from '@components/wizard'
import Alerta from './steps-with-validation/Alerta'
import Detalhes from './steps-with-validation/Detalhes'
import Identificacao from './steps-with-validation/Identificacao'

const FormularioDeProposta = ({ userData, empresa, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, operacao }) => {
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
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'itens',
      title: 'Descrição',
      subtitle: 'Inclua itens na proposta',
      content: <Detalhes 
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
    },
/*     {
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
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    }, */
    {
      id: 'alerta',
      title: 'Configuração',
      subtitle: 'Acompanhe o status da proposta',
      content: <Alerta 
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
    }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default FormularioDeProposta
