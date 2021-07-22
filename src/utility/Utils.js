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

export function geraPDF (proposta, template) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  console.log("================ No geraPDF")
  console.log("proposta=", proposta)
  console.log("template=", template)

  const dd = {
    info: {
      title: `appProposta - ${proposta.nomeDoCliente}`,
      author: 'appProposta'
    },
    content: [
      'First paragraph',
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
      {
        columns: [
          { text: `${proposta.nomeDoCliente}`, style: 'titulo', margin: 20 },
          {
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACDCAIAAAC4IrGtAAABJmlDQ1BBZG9iZSBSR0IgKDE5OTgpAAAoz2NgYDJwdHFyZRJgYMjNKykKcndSiIiMUmA/z8DGwMwABonJxQWOAQE+IHZefl4qAwb4do2BEURf1gWZxUAa4EouKCoB0n+A2CgltTiZgYHRAMjOLi8pAIozzgGyRZKywewNIHZRSJAzkH0EyOZLh7CvgNhJEPYTELsI6Akg+wtIfTqYzcQBNgfClgGxS1IrQPYyOOcXVBZlpmeUKBhaWloqOKbkJ6UqBFcWl6TmFit45iXnFxXkFyWWpKYA1ULcBwaCEIWgENMAarTQZKAyAMUDhPU5EBy+jGJnEGIIkFxaVAZlMjIZE+YjzJgjwcDgv5SBgeUPQsykl4FhgQ4DA/9UhJiaIQODgD4Dw745AMDGT/0ZOjZcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFzmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDgtMjhUMTU6Mzk6MTktMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDgtMjhUMTU6Mzk6MTktMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA4LTI4VDE1OjM5OjE5LTAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA5NjExNjkyLWYzZmEtNDM3NC1hMTQzLTI4YTUzYzEwYjQ4OCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjlkZDVjMzNlLTRmNmItOGM0Yy05ZjYwLTM0MjkwNzJjOWRiZCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmZmNDdmYjAxLTNiOTEtNGZhMC04Y2M1LTcyM2NkNWVkMTExMiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZmNDdmYjAxLTNiOTEtNGZhMC04Y2M1LTcyM2NkNWVkMTExMiIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0yOFQxNTozOToxOS0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5NjExNjkyLWYzZmEtNDM3NC1hMTQzLTI4YTUzYzEwYjQ4OCIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0yOFQxNTozOToxOS0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRl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',
            width: 150
          },
          {
            width: 27,
            text: ''
          }
        ]
      }
    ]
  }

  pdfMake.createPdf(dd).open()
//  pdfMake.createPdf(dd).download()

}

