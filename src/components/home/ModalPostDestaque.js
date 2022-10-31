import html2canvas from 'html2canvas'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const ModalPostDestaque = (props) => {
  const { idTabela = '' } = props

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const arquivarTabela = (idObjeto) => {
    html2canvas(document.querySelector("tabela")).then(canvas => {
      document.getElementById("captura").appendChild(canvas)
    })
  }

  useEffect(() => {
    arquivarTabela(idTabela)
  }, [])

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Gerar arquivo da tabela
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="captura"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalPostDestaque