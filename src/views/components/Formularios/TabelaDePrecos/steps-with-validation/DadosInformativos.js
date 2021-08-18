import { Fragment, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Form, Label, Input, FormGroup, Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroupItem, Media } from 'reactstrap'
import Erro from '../../../Erro'
import { ReactSortable } from 'react-sortablejs'
import img1 from '@src/assets/images/portrait/small/avatar-s-12.jpg'
import img2 from '@src/assets/images/portrait/small/avatar-s-1.jpg'
import img3 from '@src/assets/images/portrait/small/avatar-s-2.jpg'
import img4 from '@src/assets/images/portrait/small/avatar-s-3.jpg'
import img5 from '@src/assets/images/portrait/small/avatar-s-4.jpg'
import img6 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import img7 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import img8 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
import img9 from '@src/assets/images/portrait/small/avatar-s-8.jpg'
import img10 from '@src/assets/images/portrait/small/avatar-s-9.jpg'

const array = {
  list1: [
    {
      id: '1',
      img: img1,
      name: 'Mary S. Navarre',
      content: 'Chupa chups tiramisu apple pie biscuit sweet roll bonbon macaroon toffee icing.'
    },
    {
      id: '2',
      img: img2,
      name: 'Samuel M. Ellis',
      content: 'Toffee powder marzipan tiramisu. Cake cake dessert danish.'
    },
    {
      id: '3',
      img: img3,
      name: 'Sandra C. Toney',
      content: 'Sugar plum fruitcake gummies marzipan liquorice tiramisu. Pastry liquorice chupa.'
    },
    {
      id: '4',
      img: img4,
      name: 'Cleveland C. Goins',
      content: 'Toffee powder marzipan tiramisu. Cake cake dessert danish.'
    },
    {
      id: '5',
      img: img5,
      name: 'Linda M. English',
      content: 'Chupa chups tiramisu apple pie biscuit sweet roll bonbon macaroon toffee icing.'
    }
  ],
  list2: [
    {
      id: '6',
      img: img6,
      name: 'Alexandria I. Smelser',
      content: 'Toffee powder marzipan tiramisu. Cake cake dessert danish.'
    },
    {
      id: '7',
      img: img7,
      name: 'Oscar N. Pool',
      content: 'Sugar plum fruitcake gummies marzipan liquorice tiramisu. Pastry liquorice chupsake.'
    },
    {
      id: '8',
      img: img8,
      name: 'Kathy A. Alvarado',
      content: 'Chupa chups tiramisu apple pie biscuit sweet roll bonbon macaroon toffee icing.'
    },
    {
      id: '9',
      img: img9,
      name: 'James E. White',
      content: 'Toffee powder marzipan tiramisu. Cake cake dessert danish.'
    },
    {
      id: '10',
      img: img10,
      name: 'Roberta R. Babin',
      content: 'Chupa chups tiramisu apple pie biscuit sweet roll bonbon macaroon toffee icing.'
    }
  ]
}

const DadosInformativos = ({ userData, empresa, todasAsTabelaDePrecos, tabelaDePrecos, setTabelaDePrecos, versaoDaTabelaDePrecos, setVersaoDaTabelaDePrecos, itensDaTabelaDePrecos, setItensDaTabelaDePrecos, operacao, stepper, type }) => {
  const [erro, setErro] = useState(null)

  const [listArr1, setListArr1] = useState(array.list1)
  const [listArr2, setListArr2] = useState(array.list2)

  console.log("listArr1=", listArr1)
  return (
    <Fragment>    
      <h4 tag='h4'>Dados informativos</h4>
      <p><code>Dados informativos</code> são os que você já usa para identificar uma proposta. Esses dados são obrigatórios e não afetam o preço.</p>
      <Row>
        <Col md='6' sm='12'>
          <h4 className='my-1'>Dados sugeridos</h4>
          <ReactSortable
            tag='ul'
            className='list-group list-group-flush sortable'
            group='shared-group'
            list={listArr1}
            setList={setListArr1}
          >
            {listArr1.map(item => {
              return (
                <ListGroupItem className='draggable' key={item.id}>
                  <h5 className='mt-0'>{item.name}</h5>
{/*                   <Media>
                    <Media left tag='div'>
                      <Media
                        object
                        src={item.img}
                        className='rounded-circle mr-2'
                        alt='Generic placeholder image'
                        height='50'
                        width='50'
                      />
                    </Media>
                    <Media body>
                      <h5 className='mt-0'>{item.name}</h5>
                      {item.content}
                    </Media>
                  </Media> */}
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
            list={listArr2}
            setList={setListArr2}
          >
            {listArr2.map(item => {
              return (
                <ListGroupItem className='draggable' key={item.id}>
                  <h5 className='mt-0'>{item.name}</h5>
{/*                   <Media>
                    <Media left tag='div'>
                      <Media
                        object
                        src={item.img}
                        className='rounded-circle mr-2'
                        alt='Generic placeholder image'
                        height='50'
                        width='50'
                      />
                    </Media>
                    <Media body>
                      <h5 className='mt-0'>{item.name}</h5>
                      {item.content}
                    </Media>
                  </Media> */}
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
      <Erro erro={erro} />
    </Fragment>
  )
}

export default DadosInformativos
