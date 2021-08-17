import { useRef, useState } from 'react'
import Wizard from '@components/wizard'
import ConfiguraTabelaDePrecos from './steps-with-validation/ConfiguraTabelaDePrecos'
import DadosInformativos from '../TabelaDePrecos/steps-with-validation/DadosInformativos' 
import ItensDePreco from '../TabelaDePrecos/steps-with-validation/ItensDePreco' 
import Segmentacao from '../TabelaDePrecos/steps-with-validation/Segmentacao'

const FormularioDeTabelaDePrecos = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, proposta, setProposta, versaoDaProposta, setVersaoDaProposta, tabelaDeItens, setTabelaDeItens, template, operacao }) => {
  const [stepper, setStepper] = useState(null)
  const ref = useRef(null)

  const steps = [
    {
      id: 'segmentacao',
      title: 'Segmentação',
      subtitle: 'Setor, segmento e serviço.',
      content: <Segmentacao 
        userData={userData} 
        empresa={empresa} 
        operacao={operacao}
        todasAsTabelaDePrecos={todasAsTabelaDePrecos}
        tabelaDePrecos={tabelaDePrecos}
        setTabelaDePrecos={setTabelaDePrecos}
        versaoDaTabelaDePrecos={versaoDaTabelaDePrecos}
        setVersaoDaTabelaDePrecos={setVersaoDaTabelaDePrecos}
        itensDaTabelaDePrecos={itensDaTabelaDePrecos}
        setItensDaTabelaDePrecos={setItensDaTabelaDePrecos}
        stepper={stepper} 
        type='wizard-horizontal' 

        // as props abaixo devem ser excluídas
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        template={template}
      />
    }/* ,
    {
      id: 'dados-informativos',
      title: 'Dados informativos',
      subtitle: 'Dados que não afetam os preços',
      content: <DadosInformativos 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        template={template}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'itens-de-preco',
      title: 'Itens de Preço',
      subtitle: 'Fórmulas e cálculos',
      content: <ItensDePreco 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        template={template}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    },
    {
      id: 'config',
      title: 'Configuração',
      subtitle: 'XXXXXX',
      content: <ConfiguraTabelaDePrecos 
        userData={userData} 
        empresa={empresa} 
        proposta={proposta} 
        setProposta={setProposta} 
        versaoDaProposta={versaoDaProposta}
        setVersaoDaProposta={setVersaoDaProposta}
        tabelaDeItens={tabelaDeItens}
        setTabelaDeItens={setTabelaDeItens}
        template={template}
        operacao={operacao}
        stepper={stepper} 
        type='wizard-horizontal' 
      />
    } */
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default FormularioDeTabelaDePrecos
