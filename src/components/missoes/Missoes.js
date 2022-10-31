import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Missoes = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col><h1>Missões</h1></Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary">Adicionar</Button>{' '}
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Nome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <Button variant="danger">Excluir</Button>{' '}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <Button variant="danger">Excluir</Button>{' '}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <Button variant="danger">Excluir</Button>{' '}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Missão</Form.Label>
              <Form.Control type="text" placeholder="Nosso querido título" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto do Chefe</Form.Label>
              <Form.Control type="file" placeholder="Insira uma foto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Arte promocional</Form.Label>
              <Form.Control type="file" placeholder="Insira uma foto" />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="formGridEmail">
                <Form.Label>Vida</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="formGridEmail">
                <Form.Label>Multiplicador de dano</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} id="formGridCheckbox" className="mt-3">
                <Form.Check type="checkbox" label="Barra de fúria?" />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="formGridEmail" className="mb-3">
                <Form.Label>Nome da habilidade de fúria</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group as={Col} md={12} controlId="exampleForm.ControlTextarea1">
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
            </Row>
            <Button variant="success" type="submit">
              Gravar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Missoes