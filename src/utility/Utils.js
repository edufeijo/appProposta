import config from '../configs/comoPediuOptions'
import configTemplate from '../configs/configTemplate'
import moment from 'moment'
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'master') return '/home-master' 
  if (userRole === 'admin') return '/'
  if (userRole === 'user') return '/'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export function capitalizeFirst(str) {
  const subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() })
  return subst
}

export function corDeComoPediu(comoPediu) {
  let color = 'light-primary'
  if (comoPediu !== undefined) color = config.COMO_PEDIU_OPTIONS[config.COMO_PEDIU_OPTIONS.findIndex(element => element.value === comoPediu)].color
  return color
}

export function geraPDF (proposta, template, logo) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  if (template === null) template = configTemplate.VALORES_INICIAIS_DO_TEMPLATE

  // Header da tabela
  const matriz = [
    [
      { 
        text: '#', style: 'pequeno', bold: true, margin: [20, 6, 0, 6], fillColor: "#f4f4f4" 
      }, 
      { 
        text: 'ITEM', style: 'pequeno', bold: true, margin: [0, 6, 0, 6], fillColor: "#f4f4f4" 
      }, 
      { 
        text: 'PREÇO', style: 'pequeno', bold: true, margin: [0, 6, 20, 6], fillColor: "#f4f4f4", alignment: 'right' 
      }
    ]
  ]

  // Linhas da tabela
  proposta.versoesDaProposta[0].itensDaVersaoDaProposta.map((item, index, array) => {
    const linha = [
      { 
        text: `${index + 1}`, style: 'normal', margin: [20, 10, 0, 10] 
      }, 
      [
        { 
          text: `${item.nomeDoItem}`, style: 'normal', margin: [0, 10, 0, 5] 
        }, 
        { 
          text: `${item.descricaoDoItem}`, style: 'normal', color: "#888888", margin: [0, 0, 0, 10] 
        }
      ], 
      { 
        text: `${item.precoDoItem.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})}`, style: 'normal', margin: [0, 10, 20, 10], alignment: 'right' 
      }
    ]
    matriz.push(linha)
  })  

  const dd = {
    pageSize: `${template.pageSize}`,
    pageOrientation: `${template.pageOrientation}`,
    pageMargins: [0, 0, 0, 20],

    info: {
      title: `${template.labelDaProposta} para ${proposta.nomeDoCliente}`,
      author: `Emitida por ${proposta.nomeDaEmpresa}`
    },

    footer (currentPage, pageCount) { 
      return [
        { 
          text: `${currentPage.toString()} de ${pageCount}`, style: 'footer', alignment: 'right', margin: [0, 0, 20, 0] 
        }
      ]
    },

    content: [
      {
        columns: [
          logo && {
            image: logo,
            fit: [150, 150],
            width: 'auto',
            margin: [20, 10, 0, 0]
          },
          {
            width: '*', // star-sized columns fill the remaining space
            text: [
              { 
                text: `${template.labelDaProposta} `, style: 'proposta' 
              }, 
              { 
                text: `${proposta.idDaProposta}\n\n`, bold: true, style: 'proposta' 
              },
              { 
                text: 'Cliente ', style: 'normal', color: "#888888" 
              }, 
              { 
                text: `${proposta.nomeDoCliente}`, style: 'normal', bold: true 
              }
            ], 
            alignment: 'right',
            margin: [0, 20, 20, 60]
          }
        ]
      },

      {
        layout: 'lightHorizontalLines', 
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [
            [
              { 
                text: `${template.labelDaProposta} Opção 1`, style: 'normal', bold: true, margin: [20, 6, 0, 6], fillColor: "#ffffff", alignment: 'left' 
              }
            ]
          ]
        }
      },
      {
        layout: 'linhasBemSuaves', 
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto'],
          body: matriz
        }
      },
      {
        layout: 'noBorders', 
        margin: [0, 0, 0, 30],
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [
            [
              { 
                text: `Total ${proposta.valorDaProposta.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 0})}`, style: 'normal', bold: true, margin: [0, 6, 20, 6], fillColor: "#ffffff", alignment: 'right' 
              }
            ]
          ]
        }
      },

      {
        columns: [
          {
            width: '*', // star-sized columns fill the remaining space
            text: [
              { text: 'Criado em ', style: 'pequeno', color: "#888888" }, { text: `${moment(proposta.ultimaAtualizacao).format("DD.MM.YYYY [às] HH:mm")}\n`, style: 'pequeno', bold: true },
              { text: 'Válido até ', style: 'pequeno', color: "#888888" }, { text: `${moment(proposta.versoesDaProposta[0].venceEm).format("DD.MM.YYYY [às] HH:mm")}\n`, style: 'pequeno', bold: true },
              { text: 'Emitido por ', style: 'pequeno', color: "#888888" }, { text: `${proposta.versoesDaProposta[0].nomeDoUsuario}`, style: 'pequeno', bold: true }
            ], 
            alignment: 'right',
            lineHeight: 1.4,
            margin: [0, 20, 20, 20]
          }
        ]
      }
    ],
    
    styles: {
      titulo: {
        fontSize: 30,
        bold: true,
        color: "#666666"
      },
      proposta: {
        fontSize: 14,
        color: "#666666"
      },
      normal: {
        fontSize: 12,
        color: "#666666"
      },
      pequeno: {
        fontSize: 10,
        color: "#666666"
      },
      footer: {
        fontSize: 8,
        color: "#666666"
      }
    }
  }

  pdfMake.tableLayouts = {
    linhasBemSuaves: {
      hLineWidth(i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0
        }
        return (i === node.table.headerRows) ? 2 : 1
      },
      vLineWidth(i) {
        return 0
      },
      hLineColor(i) {
        return i === 1 ? '#f4f4f4' : '#eeeeee'
      },
      paddingLeft(i) {
        return i === 0 ? 0 : 8
      },
      paddingRight(i, node) {
        return (i === node.table.widths.length - 1) ? 0 : 8
      }
    }
  }

  pdfMake.createPdf(dd).open()
  // pdfMake.createPdf(dd).download()
}

