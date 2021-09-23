import config from './comoPediuOptions'

const QTDADE_MIN_LETRAS_NOME_DO_USUARIO = 3
const QTDADE_MIN_LETRAS_QUEM_PEDIU = 3
const QTDADE_MIN_LETRAS_EMAIL_DO_USUARIO = 6
const QTDADE_MIN_LETRAS_SENHA_DO_USUARIO = 6
const QTDADE_MIN_LETRAS_NOME_DA_EMPRESA = 3
const QTDADE_MIN_CARACTERES_ID_DA_PROPOSTA = 3
const QTDADE_MIN_LETRAS_ALERTA = 10

const QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL = 2
const QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL = 30

const QTDADE_MIN_LETRAS_NOME_DO_ITEM = 2
const QTDADE_MAX_LETRAS_NOME_DO_ITEM = 40
const QTDADE_MAX_CARACTERES_DESCRICAO_DO_ITEM = 500

const QTDADE_MIN_LETRAS_SSS = 3
const QTDADE_MAX_LETRAS_SSS = 20

const QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO = 1
const QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO = 20

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

const VALORES_INICIAIS_DA_OPCAO_DA_SELECAO = {
  id: 1,
  label: 'Opção 1',
  erroNaOpcao: {}
}

const VALORES_INICIAIS_DA_VARIAVEL_NUMERO = {
  tipoDaVariavel: 'NUMERO',
  valorMinimo: null,
  valorMaximo: null,
  permitidoAlterar: {
    tipoDaVariavel: true,
    valorMinimo: true,
    valorMaximo: true
  }
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
        id: 0,
        name: "Nome do cliente",
        value: "Nome do cliente",
        label: "Nome do cliente",
        variavelHabilitada: true,
        variavelObrigatoria: true,
        permitidoAlterar: {
          name: false,
          value: false,
          label: false,
          variavelHabilitada: false,
          variavelObrigatoria: false
        },
        conteudo: {
          tipoDaVariavel: 'ALFANUMERICA',
          permitidoAlterar: {
            tipoDaVariavel: false
          }
        },
        erroNaVariavel: {} 
      },
      {
        id: 1,
        name: "Local do evento",
        value: "Local do evento",
        label: "Local do evento",
        variavelHabilitada: true,
        variavelObrigatoria: false,
        permitidoAlterar: {
          name: false,
          value: false,
          label: true,
          variavelHabilitada: true,
          variavelObrigatoria: true
        },
        conteudo: {
          tipoDaVariavel: 'ALFANUMERICA',
          permitidoAlterar: {
            tipoDaVariavel: false
          }
        },
        erroNaVariavel: {} 
      },
      {
        id: 2,
        name: "Data do evento",
        value: "Data do evento",
        label: "Data do evento",
        variavelHabilitada: true,
        variavelObrigatoria: false,
        permitidoAlterar: {
          name: false,
          value: false,
          label: true,
          variavelHabilitada: true,
          variavelObrigatoria: true
        },
        conteudo: {
          tipoDaVariavel: 'DATA',
          permitidoAlterar: {
            tipoDaVariavel: false
          }
        },
        erroNaVariavel: {} 
      },
      {
        id: 3,
        name: "Quantidade de pessoas",
        value: "Quantidade de pessoas",
        label: "Quantidade de pessoas",
        variavelHabilitada: true,
        variavelObrigatoria: false,
        permitidoAlterar: {
          name: false,
          value: false,
          label: true,
          variavelHabilitada: true,
          variavelObrigatoria: true
        },
        conteudo: {
          tipoDaVariavel: 'NUMERO',
          valorMinimo: 0,
          valorMaximo: null,
          permitidoAlterar: {
            tipoDaVariavel: false,
            valorMinimo: true,
            valorMaximo: true
          }
        },
        erroNaVariavel: {} 
      },
      {
        id: 4,
        name: "Proposta solicitada via",
        value: "Proposta solicitada via",
        label: "Proposta solicitada via",
        variavelHabilitada: true,
        variavelObrigatoria: false,
        permitidoAlterar: {
          name: false,
          value: false,
          label: false,
          variavelHabilitada: true,
          variavelObrigatoria: true
        },
        conteudo: {
          tipoDaVariavel: 'SELECAO',
          permitidoAlterar: {
            tipoDaVariavel: false
          }
        },
        erroNaVariavel: {} 
      },
      {
        id: 5,
        name: "Quem pediu",
        value: "Quem pediu",
        label: "Quem pediu",
        variavelHabilitada: true,
        variavelObrigatoria: false,
        permitidoAlterar: {
          name: false,
          value: false,
          label: false,
          variavelHabilitada: true,
          variavelObrigatoria: true
        },
        conteudo: {
          tipoDaVariavel: 'ALFANUMERICA',
          permitidoAlterar: {
            tipoDaVariavel: false
          }
        },
        erroNaVariavel: {} 
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
        id: 0,
        name: "Quantidade de alunos",
        value: "Quantidade de alunos",
        label: "Quantidade de alunos",
        conteudo: {
          tipo: 'Numero inteiro',
          valorMinimo: 0,
          valorMaximo: null,
          permitidoAlterar: {
            tipo: false,
            valorMinimo: true,
            valorMaximo: true
          }
        },
        variavelHabilitada: true,
        variavelObrigatoria: true,
        permitidoAlterar: {
          name: false,
          value: false,
          label: false,
          variavelHabilitada: false,
          variavelObrigatoria: false
        },

        variavelPermanente: true, // esse camnpo será excluído
        
        variavelAbertaNoFormulario: true,
        erroNaVariavel: {
          label: true
        } 
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
    QTDADE_MAX_LETRAS_SSS,
    QTDADE_MIN_LETRAS_NOME_DA_VARIAVEL,
    QTDADE_MAX_LETRAS_NOME_DA_VARIAVEL,
    QTDADE_MIN_LETRAS_OPCAO_DA_SELECAO,
    QTDADE_MAX_LETRAS_OPCAO_DA_SELECAO,
    VALORES_INICIAIS_DA_OPCAO_DA_SELECAO,
    VALORES_INICIAIS_DA_VARIAVEL_NUMERO
}