import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
import db from '../../../db'
import Erro from '../../components/Erro'

const MostraProposta = () => {
  const { id } = useParams()

  const [erro, setErro] = useState(null)

  const [userData, setUserData] = useState(null)
  const [userDataCarregado, setUserDataCarregado] = useState(false)
  const [proposta, setProposta] = useState()

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
      setUserDataCarregado(!userDataCarregado)
    } 
  }, [])

  useEffect(() => {
    if (userDataCarregado) {
      if (id !== undefined) { // Carrega a proposta id
        const query = {
          bd: "propostas",
          operador: "get",
          cardinalidade: "one",
          pesquisa: { 
            ['idDaProposta']: id
          }
        } 
        db.getGenerico(query, false) 
        .then((resposta) => { 
          setProposta(resposta) 
        })
        .catch((err) => {
          setErro(err)
          setErro(null)
        }) 
      }
    }
  }, [userDataCarregado]) 
    
  return (
    <Fragment>
      <Card>
        <pre>{JSON.stringify(proposta, null, '\t')}</pre>
      </Card>
      <Erro erro={erro} />
    </Fragment>
  )
}
export default MostraProposta
