import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Plus } from 'react-feather'
import { Form, Label, Input, FormGroup, Row, Col, Button, Badge, Nav, NavItem, NavLink, TabContent, TabPane, ListGroupItem, Media } from 'reactstrap'
import { ReactSortable } from 'react-sortablejs'
import { SETOR_SEGMENTO_SERVICO } from '../../../../../configs/appProposta'

const DadosInformativos = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, dadosInformativosOpcionais, setDadosInformativosOpcionais, dadosInformativosObrigatorios, setDadosInformativosObrigatorios, operacao, stepper, type }) => {

  useEffect(() => {
    const index = dadosInformativosOpcionais.findIndex(element => !element.opcional)
    console.log("---------------- PASSOU AQUI")
    console.log("index=", index)

    if (index > -1) {
      console.log("---------------- FAZ O TRATAMENTO")
      const dadoInformativoObrigatorio = {
        id: '1000',
        name: 'Nome do cliente (dado obrigatório)',
        label: 'Nome do cliente',
        opcional: false
      }
      const temp = dadosInformativosObrigatorios
      temp.push(dadoInformativoObrigatorio)
      console.log("temp=", temp)
      setDadosInformativosObrigatorios(temp)

      const removedItem = dadosInformativosOpcionais.splice(index, 1)
      console.log("removedItem=", removedItem)
      setDadosInformativosOpcionais(removedItem) 
    }  
  }, [dadosInformativosOpcionais.length])

  console.log("--------------------- No dadosInformativos")
  console.log("dadosInformativosOpcionais=", dadosInformativosOpcionais)
  console.log("dadosInformativosObrigatorios=", dadosInformativosObrigatorios)

  return (
    <Fragment>    
      <h4 tag='h4'>Dados informativos</h4>
      <p><code>Dados informativos</code> são usados para identificar uma proposta. Esses dados não afetam o preço. Arraste e edite os que são adequados ao seu negócio.</p>
      <Row>
        <Col md='6' sm='12'>
          <div className='d-flex justify-content-between'>
            <h4 className='my-1'>Dados sugeridos para {tabelaDePrecos.setor}</h4>
            <Button.Ripple color='primary' outline size='sm' className='btn-prev'>
              <Plus size={14} className='align-middle mr-sm-25 mr-0'/>
              <span className='align-middle d-sm-inline-block d-none'>Novo dado</span>
            </Button.Ripple>
          </div>
          <ReactSortable
            tag='ul'
            className='list-group list-group-flush sortable'
            group='shared-group'
            list={dadosInformativosOpcionais}
            setList={setDadosInformativosOpcionais}
          >
            {dadosInformativosOpcionais.map(item => {
              return (
                <ListGroupItem className='draggable' key={item.id}>
                  <Badge color='light-secondary' pill>
                    {item.label}
                  </Badge>
                  <p className='mt-0'>Original: {item.name}</p>
                </ListGroupItem>
              )
            })}
          </ReactSortable>
        </Col>
        <Col md='6' sm='12'>
          <h4 className='my-1'>Dados informativos do seu negócio</h4>
          <ReactSortable
            tag='ul'
            className='list-group list-group-flush sortable'
            group='shared-group'
            list={dadosInformativosObrigatorios}
            setList={setDadosInformativosObrigatorios}
          >
            {dadosInformativosObrigatorios.map(item => {
              return (
                <ListGroupItem className='draggable' key={item.id}>
                  <Badge color='primary' pill>
                    {item.label}
                  </Badge>
                  <p className='mt-0'>Original: {item.name}</p>
                </ListGroupItem>
              )
            })}
          </ReactSortable>
        </Col>
      </Row>
      <div className='d-flex justify-content-between'>
        <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
        </Button.Ripple>
        <Button.Ripple color='primary' className='btn-next'>
          <span className='align-middle d-sm-inline-block d-none'>Avançar</span>
          <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
        </Button.Ripple>
      </div>
    </Fragment>
  )
}

export default DadosInformativos
