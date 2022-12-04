import React, { useState } from 'react'
import { createAPIEndpoint, ENDPIONTS } from '../../api'
import { useForm } from '../../hooks/useForm'

const getFreshModelObject = () => ({
  objetoGrupo: '',
})

const ClassificacaoAutomatica = (props) => {
  const {
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
  } = props

  const { values: valor, handleInputChange: atualizarValorObjeto } = useForm(getFreshModelObject)

  const pegarMembros = (groupId) => {
    createAPIEndpoint(ENDPIONTS.GROUPS)
      .getMembers(groupId)
      .then((res) => {
        localizarNomeMembros(res.data.data)
        atualizarInformacaoGrupo(res.data.data)
      })
      .catch((err) => console.log(err))
  }

  const transformarParticipantesEmJSON = () => {
    const objetoMembros = JSON.parse(valor.objetoGrupo)[0].quest.members
    let idParticipantes = []
    for (let membro in objetoMembros) {
      idParticipantes.push(membro)
    }
    return idParticipantes
  }

  const localizarNomeParticipantes = (e, listaMembros) => {
    e.preventDefault()
    const idParticipantes = transformarParticipantesEmJSON()
    let nomeParticipantes = []
    for (let i = 0; i < idParticipantes.length; i++) {
      for (let key in listaMembros) {
        if (idParticipantes[i] === listaMembros[key].id) {
          nomeParticipantes.push(listaMembros[key].profile.name)
        }
      }
    }
    console.log(nomeParticipantes)
    setValues({...values, participantes: nomeParticipantes})
  }

  const localizarNomeMembros = (listaMembros) => {
    let nomeMembros = []
    for (let key in listaMembros) {
      nomeMembros.push(listaMembros[key].profile.name)
    }
    setValues({...values, membros: nomeMembros})
  }

  const idGrupo = "e4df7810-12cd-404b-844d-40b6e5c9d1b9"

  const [numItems, setNumItems] = useState(1)
  const [informacaoGrupo, atualizarInformacaoGrupo] = useState([])

  const atualizarLista = (e) => {
    e.preventDefault()
    const logChat = values.logChat
    const nomeChefe = values.nomeChefe
    const membros = values.membros
    const participantes = values.participantes
    const nomeItems = values.nomeItem
    let lista = []

    for (let i = 0; i < membros.length; i++) {
      console.log(membros[i])
      const formatoCura = new RegExp(`${membros[i]} lançou Bênção`, 'g')
      const curasAchadas = logChat.match(formatoCura)
      const qtdCura = curasAchadas != null ? curasAchadas.length : 0
      let qtdBuff = 0
      const decimal = /\d+(\.\d+)?/g;
      const formatoDano = new RegExp(`${membros[i]} ataca ${nomeChefe}, causando ${decimal.source} de dano`, 'g')
      const linhaDano = logChat.match(formatoDano)
      let danosCausados = []
      let totalDano = + 0

      if (values.tipoMissao === 'chefe') {
        if (linhaDano != null) {
          linhaDano.map(linha => {
            var ret = linha.replace(`${membros[i]}`, '');
            danosCausados.push(ret.match(decimal))
          })
        }

        if (danosCausados.length > 0) {
          danosCausados.map(dano => {
            totalDano += Number(dano[0])
          })
        }
      } else {
        const numbers = /[0-9]+/
        let formatoColeta = `${membros[i]} encontrou `

        for (let i = 0; i < numItems; i++) {
          if (i == numItems - 1) {
            formatoColeta += numbers.source + ' ' + nomeItems[i] + `.`
          } else {
            formatoColeta += numbers.source + ' ' + nomeItems[i] + `, `
          }
        }
        const linhaColeta = logChat.match(formatoColeta)
        console.log(linhaColeta)

        if (linhaColeta != null) {
          linhaColeta.map(linha => {
            var ret = linha.replace(`${membros[i]}`, '')
            var t = ret.match(/[0-9]+/g)
            danosCausados.push(ret.match(/[0-9]+/g))
          })
        }

        if (danosCausados.length > 0) {
          danosCausados.map(dano => {
            for (let i = 0; i < numItems; i++) {
              totalDano += Number(dano[i])
            }
          })
        }
      }

      listaBuffs.map((buff) => {
        const formatoBuff = new RegExp(`${membros[i]}+ lançou ${buff}`, 'g')
        const buffsAchados = logChat.match(formatoBuff)
        qtdBuff = buffsAchados != null ? (qtdBuff + buffsAchados.length) : qtdBuff
      })
      lista.push({
        membro: membros[i],
        curas: qtdCura,
        buffs: qtdBuff,
        danoOuColetados: Math.round(totalDano),
        participou: encontrarMembro(participantes, membros[i]),
      })
    }
    calcularDestaques(lista)
    setListaCadastrada(lista)
  }

  return (
    <form name="log-auto" onSubmit={(e) => atualizarLista(e)}>
      <label>Membros do grupo</label>
      <br />
      <textarea
        name="membros"
        rows="4"
        cols="50"
        onChange={handleInputChange}
        onInput={handleInputChange}
        value={values.membros}
        style={{backgroundColor: '#f2f2f2'}}
      />
      <br />
      <button onClick={(e) => pegarMembros(idGrupo)}>Pegar membros</button>
      <br />
      <br />
      <label>Insira o objeto do grupo do Integromat</label>
      <br />
      <textarea
        name="objetoGrupo"
        rows="4"
        cols="50"
        disabled={false}
        onChange={atualizarValorObjeto}
        onInput={atualizarValorObjeto}
      />
      <br />
      <label>Participantes da missão</label>
      <br />
      <textarea
        name="participantes"
        rows="4"
        cols="50"
        onChange={handleInputChange}
        onInput={handleInputChange}
        value={values.participantes}
        style={{backgroundColor: '#f2f2f2'}}
        readOnly
      />
      <br />
      <button onClick={(e) => localizarNomeParticipantes(e, informacaoGrupo)}>Pegar Participantes</button>
      <br />
      <br />
      <label>Insira o log do bate-papo</label>
      <br />
      <textarea
        name="logChat"
        rows="4"
        cols="50"
        onChange={handleInputChange}
        onPaste={handleInputChange}
      />
      <br />
      <br />
      Tipo de Missão:
      <br />
      <input
        type="radio"
        id="chefe"
        name="tipoMissao"
        value="chefe"
        defaultChecked
        onClick={atualizarTipoMissao}
      />
      <label for="chefe">Chefe</label>
      <br />
      <input
        type="radio"
        id="coleta"
        name="tipoMissao"
        value="coleta"
        onClick={atualizarTipoMissao}
      />
      <label for="coleta">Coleta</label>
      <br />
      <br />
      <div style={{ display: `${values.tipoMissao === 'chefe' ? 'block' : 'none'}` }}>
        <label>Nome do Chefe</label>
        <br />
        <input
          name="nomeChefe"
          type="text"
          onChange={handleInputChange}
          values={values.nomeChefe}
        />
      </div>
      <div style={{ display: `${values.tipoMissao === 'coleta' ? 'block' : 'none'}` }}>
        <label for="w3review">Nº de itens</label><br />
        <select onChange={e => setNumItems(e.target.value)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select><br />
        {values.nomeItem.map((item, index) => (
          <>
            <label>Item {index + 1}</label><br />
            <input
              name={`nomeItem[${index}]`}
              type="text"
              onChange={e => atualizarValorFormularioitem(e, index)}
              onPaste={handleInputChange}
            />
            <br />
          </>
        ))}
      </div>
      <br />
      <label>Finalizador da missão</label>
      <br />
      <input type="text" name="melhorFinalizador" onChange={atualizarFormularioDestaque} />
      <br />
      <br />
      <input type="submit" />
    </form>
  )
}

export default ClassificacaoAutomatica