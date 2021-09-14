import config from './comoPediuOptions'

const QTDADE_MIN_LETRAS_NOME_DO_USUARIO = 3
const QTDADE_MIN_LETRAS_QUEM_PEDIU = 3
const QTDADE_MIN_LETRAS_EMAIL_DO_USUARIO = 6
const QTDADE_MIN_LETRAS_SENHA_DO_USUARIO = 6
const QTDADE_MIN_LETRAS_NOME_DA_EMPRESA = 3
const QTDADE_MIN_CARACTERES_ID_DA_PROPOSTA = 3
const QTDADE_MIN_LETRAS_ALERTA = 10
const QTDADE_MIN_LETRAS_NOME_DO_ITEM = 2

const QTDADE_MIN_LETRAS_SSS = 3
const QTDADE_MAX_LETRAS_SSS = 20

const QTDADE_MAX_LETRAS_NOME_DO_USUARIO = 30
const QTDADE_MAX_LETRAS_QUEM_PEDIU = 50
const QTDADE_MAX_LETRAS_EMAIL_DO_USUARIO = 30
const QTDADE_MAX_LETRAS_SENHA_DO_USUARIO = 12
const QTDADE_MAX_LETRAS_NOME_DA_EMPRESA = 30
const QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA = 10
const DIAS_MAX_VALIDADE_DA_PROPOSTA = 1000
const QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA = 13
const QTDADE_MAX_CARACTERES_COMENTARIOS_DA_PROPOSTA = 500
const QTDADE_MAX_LETRAS_ALERTA = 50
const QTDADE_MAX_DIAS_PARA_ALERTA = 60
const TAMANHO_MAX_ARQUIVO_DA_PROPOSTA = 10 // em MB
const QTDADE_MAX_LETRAS_NOME_DO_ITEM = 40
const QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM = 500

// Alertas
const ALERTA_FOLLOWUP_CLIENTE = 'Entre em contato com o cliente'

// Valores iniciais
const VALORES_INICIAIS_DA_PROPOSTA = { 
  // Valores que não dependem do usuário
  idDaEmpresa: null, 
  statusDaProposta: "ativa",
  isPropostaEnabled: true,
  propostaCriadaPor: "Linha a linha", // "Documento externo",

  // STEP 1
  isNewCliente: true,
  idDoCliente: null,
  nomeDoCliente: "",
  comoPediu: config.COMO_PEDIU_OPTIONS[0].value,
  quemPediu: "",
  idDaProposta: null,
  comentarioDaProposta: '',
  isAlertaLigado: true,
  msgDoAlerta: ALERTA_FOLLOWUP_CLIENTE, 
  diasParaAlerta: null,
  avatar: '',
  versoesDaProposta: []
} 

const VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA = { 
  // Valores que não dependem do usuário
  idDoUsuario: null,
  dataDaVersaoDaProposta: null,

  // STEP 2
  dataDaProposta: null,
  diasDeValidadeDaProposta: null,
  arquivoDaProposta: null
} 

const SERVICOS_EM_EVENTOS = [
  {
    name: "servico",
    label: "Fotografia",
    value: "Fotografia",
    type: "opcao"
  }, 
  {    
    name: "servico",
    label: "Filmagem",
    value: "Filmagem",
    type: "opcao"
  }
]

const SERVICOS_EM_EDUCACAO = [
  {
    name: "servico",
    label: "Aula regular",
    value: "Aula regular",
    type: "opcao"
  }, 
  {    
    name: "servico",
    label: "Aula de reposição",
    value: "Aula de reposição",
    type: "opcao"
  }
]

const SETOR_SEGMENTO_SERVICO = [
  {
    name: "setor",
    label: "Eventos",
    value: "Eventos",
    type: "opcao",
    dadosInformativosSugeridos : [ 
      {
        id: 'Local-do-evento',
        name: 'Local do evento',
        label: 'Local do evento'
      },
      {
        id: 'Data-do-evento',
        name: 'Data do evento',
        label: 'Data do evento'
      }
    ],
    variaveis : [
      {
      id: "Quantidade-de-pessoas",
      origem: 'sistema',
      name: "Quantidade de pessoas",
      value: "Quantidade de pessoas",
      label: "Quantidade de pessoas",
      tipo: 'Numero inteiro',
      valorMinimo: 0,
      valorMaximo: -1
      },
      {
        id: "Quantidade-de-alunos",
        origem: 'sistema',
        name: "Alunos",
        value: "Alunos",
        label: "Alunos",
        tipo: 'Numero inteiro',
        valorMinimo: 0,
        valorMaximo: -1
        }
    ],
    segmentos : [ 
      {
        name: "segmento",
        label: "Casamento",
        value: "Casamento",
        type: "opcao",
        servicos : SERVICOS_EM_EVENTOS
      }, 
      {
        name: "segmento",
        label: "15 anos",
        value: "15 anos",
        type: "opcao",
        servicos : SERVICOS_EM_EVENTOS
      }
    ]
  },
  {
    name: "setor",
    label: "Educação",
    value: "Educação",
    type: "opcao",
    dadosInformativosSugeridos : [ 
      {
        id: 'Endereco-da-escola',
        name: 'Endereço da escola',
        label: 'Endereço da escola'
      },
      {
        id: 'Nome-do-diretor',
        name: 'Nome do diretor',
        label: 'Nome do diretor'
      }
    ],
    variaveis : [
      {
      id: "Quantidade-de-alunos",
      origem: 'sistema',
      name: "Quantidade de alunos",
      value: "Quantidade de alunos",
      label: "Quantidade de alunos",
      tipo: 'Numero inteiro',
      valorMinimo: 0,
      valorMaximo: -1
      }
    ],
    segmentos : [ 
      {
        name: "segmento",
        label: "Escola pública",
        value: "Escola pública",
        type: "opcao",
        servicos : SERVICOS_EM_EDUCACAO
      }, 
      {
        name: "segmento",
        label: "Escola particular",
        value: "Escola particular",
        type: "opcao",
        servicos : SERVICOS_EM_EDUCACAO
      }
    ]
  }
]

const DADO_INFORMATIVO_OBRIGATORIO = {
  id: 'Nome-do-cliente',
  name: 'Nome do cliente',
  label: 'Nome do cliente',
  filtered: true
}

export {
    QTDADE_MIN_LETRAS_NOME_DO_USUARIO,
    QTDADE_MIN_LETRAS_QUEM_PEDIU,
    QTDADE_MIN_LETRAS_EMAIL_DO_USUARIO,
    QTDADE_MIN_LETRAS_SENHA_DO_USUARIO,
    QTDADE_MIN_LETRAS_NOME_DA_EMPRESA,
    QTDADE_MIN_CARACTERES_ID_DA_PROPOSTA,
    QTDADE_MIN_LETRAS_ALERTA,
    QTDADE_MAX_LETRAS_NOME_DO_USUARIO,
    QTDADE_MAX_LETRAS_QUEM_PEDIU,
    QTDADE_MAX_LETRAS_EMAIL_DO_USUARIO,
    QTDADE_MAX_LETRAS_SENHA_DO_USUARIO,
    QTDADE_MAX_LETRAS_NOME_DA_EMPRESA,
    QTDADE_MAX_CARACTERES_ID_DA_PROPOSTA,
    QTDADE_MAX_DIGITOS_NO_VALOR_DA_PROPOSTA,
    DIAS_MAX_VALIDADE_DA_PROPOSTA,
    QTDADE_MAX_CARACTERES_COMENTARIOS_DA_PROPOSTA,
    QTDADE_MAX_LETRAS_ALERTA,
    QTDADE_MAX_DIAS_PARA_ALERTA,
    TAMANHO_MAX_ARQUIVO_DA_PROPOSTA,
    ALERTA_FOLLOWUP_CLIENTE,
    QTDADE_MIN_LETRAS_NOME_DO_ITEM, 
    QTDADE_MAX_LETRAS_NOME_DO_ITEM,
    QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM,
    VALORES_INICIAIS_DA_VERSAO_DA_PROPOSTA,
    VALORES_INICIAIS_DA_PROPOSTA,
    SETOR_SEGMENTO_SERVICO,
    DADO_INFORMATIVO_OBRIGATORIO,
    QTDADE_MIN_LETRAS_SSS,
    QTDADE_MAX_LETRAS_SSS
}