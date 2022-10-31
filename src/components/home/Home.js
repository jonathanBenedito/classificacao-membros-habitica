import html2canvas from 'html2canvas'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
import { useForm } from '../../hooks/useForm'
import ClassificacaoAutomatica from './ClassificacaoAutomatica'
import ClassificacaoManual from './ClassificacaoManual'
import './home.style.css'

const getFreshModelObject = () => ({
  tipoMissao: 'chefe',
  membros: '',
  logChat: '',
  nomeChefe: '',
  nomeItem: ['', '', ''],
  participantes: '',
})

const objetoModeloDestaque = () => ({
  melhorDanoColetor: '',
  melhorBuffador: '',
  melhorCurandeiro: '',
  melhorColetor: '',
  melhorFinalizador: '',
})

const Home = () => {
  const [listaCadastrada, setListaCadastrada] = useState([])
  const { values, setValues, handleInputChange } = useForm(getFreshModelObject)
  const {
    values: valorDestaque,
    setValues: setValorDestaque,
    handleInputChange: atualizarFormularioDestaque
  } = useForm(objetoModeloDestaque)

  const formularioChefe = <>
    <label>Nome do Chefe</label><br />
    <input
      name="nomeChefe"
      type="text"
      onChange={handleInputChange}
      values={values.nomeChefe}
    />
    <br />
    <br />
  </>

  const arquivarTabela = () => {
    html2canvas(document.querySelector("#postDestaque")).then(canvas => {
      document.getElementById("captura").appendChild(canvas)
    })
  }

  const atualizarValorFormularioitem = (e, index) => {
    const valor = e.target.value
    for (let chave in values.nomeItem) {
      if (chave == index) {
        values.nomeItem[chave] = valor
      }
    }
  }

  const cabecalhosChefe = ["Membro", "Bençãos", "Buffs", "Total Dano", "Finalizou?", "Participou?"]
  const cabecalhosColeta = ["Membro", "Curas", "Buffs", "Coletados", "Finalizou?", "Participou?"]

  const objetoTipoMissao = () => ({
    tipo: 'chefe',
    cabecalhos: cabecalhosChefe,
    formularioMissao: formularioChefe
  })

  const [valoresTipoMissao, setValoresTipoMissao] = useState(objetoTipoMissao)

  const atualizarTipoMissao = (e) => {
    const tipo = e.target.value
    handleInputChange(e)

    if (tipo === 'chefe') {
      setValoresTipoMissao({
        ...objetoTipoMissao,
        tipo: 'chefe',
        cabecalhos: cabecalhosChefe,
        formularioMissao: formularioChefe
      })
    } else {
      setValoresTipoMissao({
        ...objetoTipoMissao,
        tipo: 'coleta',
        cabecalhos: cabecalhosColeta,
        formularioMissao: <></>
      })
    }
  }

  const listaBuffs = [
    "Ferramentas do Ofício",
    "Onda Etérea",
    "Terremoto",
    "Aura Protetora",
    "Presença Valorosa",
    "Olhar Intimidante"
  ]

  const encontrarMembro = (participantes, membro) => {
    const participante = participantes.find(function (o) { return o == membro })
    return participante != null ? '✔' : ''
  }

  const calcularDestaques = (lista) => {
    const maiorBuff = Math.max(...lista.map(o => o.buffs))
    const maiorCura = Math.max(...lista.map(o => o.curas))
    const maiorDanoColeta = Math.max(...lista.map(o => o.danoOuColetados))

    const melhorBuffador = lista.find(
      function (o) { return o.buffs == maiorBuff; }
    ).membro

    const melhorCurandeiro = lista.find(
      function (o) { return o.curas == maiorCura; }
    ).membro

    const melhorDanoColeta = lista.find(
      function (o) { return o.danoOuColetados == maiorDanoColeta; }
    ).membro

    setValorDestaque({
      ...valorDestaque,
      melhorDanoColetor: melhorDanoColeta,
      melhorBuffador: melhorBuffador,
      melhorCurandeiro: melhorCurandeiro,
    })
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <h1>Calculador de placar do grupo Habitica</h1>
            <br />
            <Tabs
              defaultActiveKey="manual"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="manual" title="Manual">
                <ClassificacaoManual
                  {...{
                    listaCadastrada,
                    setListaCadastrada,
                    handleInputChange,
                    values,
                    setValues,
                    atualizarTipoMissao,
                    atualizarFormularioDestaque,
                    atualizarValorFormularioitem,
                    setValorDestaque,
                    valorDestaque,
                    listaBuffs,
                    encontrarMembro,
                    calcularDestaques,
                  }}
                />
              </Tab>
              <Tab eventKey="automatico" title="Automatico">
                <ClassificacaoAutomatica
                  {...{
                    setListaCadastrada,
                    handleInputChange,
                    values,
                    setValues,
                    atualizarTipoMissao,
                    atualizarFormularioDestaque,
                    atualizarValorFormularioitem,
                    listaBuffs,
                    encontrarMembro,
                    calcularDestaques,
                  }}
                />
              </Tab>
            </Tabs>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
              <table style={{ border: "1px solid black" }} id="tabela">
                <tr>
                  {valoresTipoMissao.cabecalhos.map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                </tr>
                {listaCadastrada.map((item, index) => (
                  <tr key={index}>
                    <td>{item.membro}</td>
                    <td
                      style={{
                        backgroundColor: `${item.membro === valorDestaque.melhorCurandeiro ? '#FFF2CC' : ''}`
                      }}
                    >
                      {item.curas}
                    </td>
                    <td
                      style={{
                        backgroundColor: `${item.membro === valorDestaque.melhorBuffador ? '#D9D2E9' : ''}`
                      }}
                    >
                      {item.buffs}
                    </td>
                    <td
                      style={{
                        backgroundColor: `${item.membro === valorDestaque.melhorDanoColetor ? '#F4CCCC' : ''}`
                      }}
                    >
                      {item.danoOuColetados}
                    </td>
                    <td
                      style={{
                        backgroundColor: `${item.membro === valorDestaque.melhorFinalizador ? '#CCCCCC' : ''}`
                      }}
                    >
                      {item.membro === valorDestaque.melhorFinalizador ? '✔' : ''}
                    </td>
                    <td>
                      {item.participou}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home