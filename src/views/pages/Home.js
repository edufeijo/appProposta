// PENDÊNCIAS DA VERSÃO 0.1
//
//
// Tabela de preços
// - Não pode criar 2 itens com o mesmo nome
// - Não pode criar 2 variáveis com o mesmo nome
// - Ao mudar o tipo de Componente perguntar se quer continuar pois todos os dados serão perdidos
// - Antes de excluir variável, checar se ela não é usada em cálculos
// - Gravar tabela externa no BD
// - No List view de tabelas:
//   - Editar versão da tabela
//   - Permitir duplicar tabela (estrutura e valores)
//   - Transformar tabela externa em tabela interna
//   - Cancelar tabela de preços
//   - Permitir duplicar partes da tabela (checar o que é possível duplicar)
// - Fazer botões Incluir dado informativo e Editar dado informativo. Ao criar Dado Informativo, rejeitar se já existe
// - Definir ciclo de vida das tabelas de preço (status)
// - Revisar todos os links na List view
// - se não tem tabela de preço definida: mostrar quickstart
// - mostrar Botão 'Quickstart' (com opção 'não mostrar novamente'). Se não tem Quickstart e não tem tabela de preços, então botão 'Criar tabela de preços'
// 
//
// Gerar PDF
// - Fazer Criador de templates, com vários modelos
// - Ter uma solução para hospedar Logo e Imagens em URLs externas
// - No Edita Proposta permitir que o usuário customize o template desta proposta
//
//
// Limites do appProposta:
// - Máximo de 3 tabelas de preço
// - 1 troca de logotipo a cada 7 dias
//
//
// No List View de propostas
// - ao criar proposta escolher SSS
// - Se tabelaDePrecosExterna = true, não mostrar LinhaALinha
// - Em versões da proposta:
//   - Criar editar "qualquer versão da proposta"
//   - Mostrar todos os campos da proposta: Quem indicou, se tem comentários, se tem arquivo externo, etc
// - Trocar botão "Selecione status" por "Selecione pesquisa": cliente, idDaProposta, Quem indicou, etc
// - Se pesquisar por nome, deixar periodo = TUDO
// - Página bonita para preview Proposta, Cliente e ações
// 
//
// No Proposta Externa:
// - fazer upload do arquivo para Firebase
// - filtrar os tipos de arquivo permitidos e definir tamanho máximo
//
//
// Autorização:
// - Além de ter o usuário logado, precisa testar ability antes de chamar api para acessar BD (este teste deve ocorrer no cliente ou no servidor? Pesquisar sobre isso)
// - Testar chamadas de API para logout
// - Pesquisar quanto tempo para expirar accessToken e RefreshToken
//
//
// Especificar:
// - Desenhar fluxo de vida da Empresa (status). Depois de quanto tempo fica inativa?
//
//   
// No Login:
// - Fazer ForgotPassword e ResetPassword
// - Gravar BD Usuário e BD Empresa com último login realizado
// - use localStorage or use cookies instead (pesquisar código fonte e procurar 'localStorage')
// - Excluir msg de erro qdo envia para a tela de login
//
//
// No Registro:
// - Criar template da proposta com valores default
// - Testar checkbox e fazer link para políticas
// - Padronizar Iniciais em maiúscula: nomeDoUsuario.toLowerCase
// - criar regra para definição da senha pelo usuário (8 caracteres, pelo menos 1 letra?)
// - tela para configurar "config": {
//    "diasDeValidadeDaProposta": 30,
//    "diasParaAlerta": 7
//    }
// - Calcular APELIDO (ou usar INSTAGRAM) --> talvez não precise
// - Usar redes sociais? (Na tela de Login também)
// - Validar email para garantir a autenticidade 
// 
//
// Em algum momento após o registro:
// - Confirmar 1º nome (como prefere ser chamado) e preencher sobrenome
// - Solicitar logotipo. Usar avatar qdo não tiver logo
//
//
// Rodapé:
// - link web321
//
//
// REGRAS DE NEGÓCIO DA VERSÃO 0.1
// 1. Um email poderá ter apenas 1 Empresa
// 2. Nesta versão, usar template fixo de imagem (gerada pelo Powerpoint). Em versão futura, permitir vários templates com ajuste de imagem
//
// BATCH NO SERVIDOR
// 1. Checar validade da proposta e alterar status. Dá pra fazer trigger no BD?
//
//
// BANCO DE DADOS
// 1. Criar índice para email no BD Usuários (melhorar performance na busca)?
//
//

import { useEffect, useState } from 'react'
import { Card, CardBody, Button, CardText, Row, Col } from 'reactstrap'
import db from '../../db'
import { isUserLoggedIn } from '@utils'
import QuantidadeDePropostas from '../components/Estatísticas/QuantidadeDePropostas'
import QuantidadeDeUsuarios from '../components/Estatísticas/QuantidadeDeUsuarios'
import QuantidadeDeClientes from '../components/Estatísticas/QuantidadeDeClientes'
import Erro from '../components/Erro'

const Home = () => {
  const [erro, setErro] = useState(null)

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [quantidadeDePropostas, setQuantidadeDePropostas] = useState()
  const [quantidadeDeClientes, setQuantidadeDeClientes] = useState()
  const [quantidadeDeUsuarios, setQuantidadeDeUsuarios] = useState()

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, [])

  useEffect(() => {
    if (userDataCarregado) {
      const pesquisaPropostas = {
        bd: "propostas",
        operador: "count",
        cardinalidade: "all",
        pesquisa: { 
          ['idDaEmpresa']: userData.idDaEmpresa 
        }
      } 
      db.getGenerico(pesquisaPropostas, false) 
      .then((resposta) => { 
        setQuantidadeDePropostas(resposta) 
      })
      .catch((err) => {
        setErro(err)
        setErro(null)
      }) 
    }
  }, [userDataCarregado])  

  useEffect(() => {
    if (userDataCarregado) {
      const pesquisaPropostas = {
        bd: "usuarios",
        operador: "count",
        cardinalidade: "all",
        pesquisa: { 
          ['idDaEmpresa']: userData.idDaEmpresa 
        }
      } 
      db.getGenerico(pesquisaPropostas, false) 
      .then((resposta) => { 
        setQuantidadeDeUsuarios(resposta) 
      })
      .catch((err) => {
//        setErro(err)
      }) 
    }
  }, [userDataCarregado]) 

  useEffect(() => {
    if (userDataCarregado) {
      const pesquisaClientes = {
        bd: "clientes",
        operador: "count",
        cardinalidade: "all",
        pesquisa: { 
          ['idDaEmpresa']: userData.idDaEmpresa 
        }
      } 
      db.getGenerico(pesquisaClientes, false) 
      .then((resposta) => { 
        setQuantidadeDeClientes(resposta) 
      })
      .catch((err) => {
//        setErro(err)
      }) 
    }
  }, [userDataCarregado]) 

  return (
    // 1. Dashboard com qtidade de propostas e botão visualizar propostas (diferente para admin e user)
    // 2. 

    <div id='dashboard-ecommerce'>
      {(quantidadeDePropostas > 0) &&
        <Row className='match-height'>
          <Col xl='4' md='6' xs='12'>
            <QuantidadeDePropostas quantidadeDePropostas={quantidadeDePropostas} />
          </Col>
          <Col xl='4' md='6' xs='12'>
            <QuantidadeDeClientes quantidadeDeClientes={quantidadeDeClientes} />
          </Col>
          <Col xl='4' md='6' xs='12'>
            <QuantidadeDeUsuarios quantidadeDeUsuarios={quantidadeDeUsuarios} />
          </Col>
        </Row>
      }
  
      {(quantidadeDePropostas === 0) &&
        <Card
          className='faq-search'
        >
          <CardBody className='text-center'>
            <h2 className='text-primary'>Vamos começar, {(userData && userData.nomeDoUsuario)}!</h2>
            <CardText className='mb-2'>Crie a 1ª proposta de {(userData && userData.nomeDaEmpresa)}!</CardText>
            <Button.Ripple type='submit' color='primary'>
              Criar a 1ª Proposta
            </Button.Ripple>
          </CardBody>
        </Card>   
      }
      <Erro erro={erro} />
    </div>  
  )
}

export default Home
