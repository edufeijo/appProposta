
import { Label, CustomInput, Row, Col, FormGroup} from 'reactstrap'

const LinhasParaVisualizar = props => {
  const { rowsPerPage, setRowsPerPage, setCurrentPage, setRecarregaPagina, recarregaPagina } = props
  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
    setRecarregaPagina(!recarregaPagina)
  }

  return (
    <Row>
      <Col sm='9'>
      </Col>
      <Col sm='3'>
        <FormGroup row>
          <Label sm='4' for='input-default-horizontal'>
            Mostrar:
          </Label>
          <Col sm='6'>
            <CustomInput
              className='form-control ml-50 pr-3'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
            >
              <option value='10'>10 linhas</option>
              <option value='25'>25 linhas</option>
              <option value='50'>50 linhas</option>
            </CustomInput>              
          </Col>
        </FormGroup>
      </Col>
    </Row>
  )
}

export default LinhasParaVisualizar
  