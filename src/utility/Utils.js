import config from '../configs/comoPediuOptions'
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

  console.log("================ No geraPDF")
  console.log("proposta=", proposta)
  console.log("template=", template)

  const dd = {
    pageSize: `${template.pageSize}`,
    pageOrientation: `${template.pageOrientation}`,
    pageMargins: [0, 60, 0, 60],

    info: {
      title: `Proposta comercial para - ${proposta.nomeDoCliente}`,
      author: `Emitida por ${proposta.nomeDaEmpresa}`
    },

    footer (currentPage, pageCount) { return `${currentPage.toString()} of ${pageCount}` },
    header (currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
  
      return [
        { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
        { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }]}
      ]
    },

    content: [
      {text: `Proposta comercial para ${proposta.nomeDoCliente}`, style: 'header'},
      {text: `Emitida por ${proposta.nomeDaEmpresa}`, margin: [40, 40, 0, 0], pageBreak: 'after'},
      {
        columns: [
          { text: `${proposta.nomeDoCliente}`, style: 'titulo', margin: 0 },
          {
            image: logo,
            fit: [150, 150],
            width: 'auto',
            margin: [0, 60, 40, 60]
          }
        ]
      },
      {
        pageBreak: 'after',
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: 'auto',
            text: 'First column'
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: '*',
            text: 'Second column', 
            style: 'header'
          },
          {
            // % width
            width: '20%',
            text: 'Fourth column'
          }
        ],
        // optional space between columns
        columnGap: 10
      },
      {
        layout: 'noBorders', 
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [[{ text: 'Itens da proposta', bold: true, fillColor: "#DDDDDD", margin: [20, 3, 0, 3] }]]
        }
      },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 'auto', 100, '*'],
  
          body: [
            ['First', 'Second', 'Third', 'The last one'],
            ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
            [{ text: 'Bold value Bold value Bold value Bold value Bold value Bold value Bold value Bold value Bold value Bold value Bold value ', bold: true, fillColor: "#ff5500" }, 'Val 2', 'Val 3', 'Val 4']
          ]
        }
      }
    ],
    styles: {
      titulo: {
        fontSize: 30,
        bold: true
      },
      header: {
        fontSize: 18,
        bold: true,
        color: 'blue',
        background: "#ff5500"
      },
      normal: {
        fontSize: 12,
        color: '#888888'
      }
    }
  }

  // pdfMake.createPdf(dd).open()
  pdfMake.createPdf(dd).download()

}

