import config from '../configs/urlAppProposta'
const URL_USUARIOS = `${config.URL_APPPROPOSTA}/usuarios`

////////////////////////////////////////////////////////////////////////
// REFRESH TOKEN

function refreshToken() {
  const URL = `${config.URL_APPPROPOSTA}/refresh-token`
  const refreshToken = localStorage.getItem('refreshToken')

  console.log("========== No refreshToken ==========")
  console.log("URL=", URL)
  console.log("refreshToken=", refreshToken)

  return fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: JSON.parse(refreshToken),
      'Content-type': 'application/json'
    }
  })
    .then(async (response) => {
      console.log("response=", response)
      if (response.ok) {
        const resposta = await response.json() 
        console.log("resposta=", resposta)
        localStorage.setItem('accessToken', JSON.stringify(resposta.accessToken))
        return true
      }
      if (response.status === 401) {
        console.log("Passou pelo 401 no refreshToken")
        return false
      } else {
        console.log("Não é 401 no refreshToken")
        throw new Error('Sem conexão com o servidor (refresh token)') 
      }
    })
}

////////////////////////////////////////////////////////////////////////
// API GENÉRICO

function getGenerico(pesquisa, refreshTokenJaUsado) {
  const URL = `${config.URL_APPPROPOSTA}/api-generico`
  const token = localStorage.getItem('accessToken')

/*   console.log("========== No getGenerico ==========")
  console.log("URL=", URL)
  console.log("pesquisa=", pesquisa)
 */

  return fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: JSON.parse(token),
      'Content-type': 'application/json'
    },
    body: JSON.stringify(pesquisa)
  })
    .then(async (response) => {
//      console.log("response=", response)
      if (response.ok) {
        const resposta = await response.json()
//        console.log("resposta=", resposta)
        return resposta
      }         
            
      if (response.status === 401) {
        let respostaAposRefreshToken = null
//        console.log("refreshTokenJaUsado=", refreshTokenJaUsado)
        if (refreshTokenJaUsado) {
          throw new Error('401 - Usuário deve fazer login') 
        } else {
          refreshTokenJaUsado = true         
          await refreshToken() 
          .then(async (refreshTokenOk) => {
//            console.log("refreshTokenOk=", refreshTokenOk)
            if (!refreshTokenOk) {
//              console.log("refresh Token não funcionou")
              throw new Error('401 - Usuário deve fazer login') 
            } else {
              await getGenerico(bd, id, refreshTokenJaUsado)
              .then(async (resposta) => {
                respostaAposRefreshToken = resposta
//                console.log("refresh Token funcionou!!!")
//                console.log("resposta após refresh Token=", respostaAposRefreshToken)
              })   
            }          
          })
        }
        return await respostaAposRefreshToken   
      } else throw new Error('Sem conexão com o servidor') 
    })
}

////////////////////////////////////////////////////////////////////////
// CRIA EMPRESA

function createEmpresa(registro) {
  return fetch(URL_EMPRESAS, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(registro)
  })
    .then(async (response) => {
      if (response.ok) {
        const resposta = await response.json() 
        return resposta
      }
      throw new Error('Não conseguiu criar a empresa') 
    })
  }

////////////////////////////////////////////////////////////////////////
// Acesso à coleção USUÁRIOS - getUsuarios deverá ser eliminada

function getUsuarios(token, id) {
  const URL = !id ? `${URL_USUARIOS}/all` : `${URL_USUARIOS}/${id}`
  
  return fetch(URL, {
    method: 'GET',
    headers: {
      'x-access-token': token,
      'Content-type': 'application/json'
    }
  })
    .then(async (response) => {
      if (response.ok) {
        const resposta = await response.json()
        return resposta
      }
      throw new Error('Sem conexão com o servidor (db: usuários)')
    })
}
  
function createUsuario(registro) {
  return fetch(URL_USUARIOS, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(registro)
  })
    .then(async (response) => {
      if (response.ok) {
        const resposta = await response.json() 
        return resposta
      }
      if (response.status === 409) throw new Error('409 - Usuário já cadastrado') 
      else throw new Error('404 - Não conseguiu criar a empresa') 
    })
  }
  
export default {
  getGenerico,
  createEmpresa,
  getUsuarios,
  createUsuario
}
