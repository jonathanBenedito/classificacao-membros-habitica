import habiticaAvatar from 'habitica-avatar'
import html2canvas from 'html2canvas'
import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm'
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

  const iconeBencao = "catego"
  
  const listaBuffs = [
    "Ferramentas do Ofício",
    "Onda Etérea",
    "Terremoto",
    "Aura Protetora",
    "Presença Valorosa",
    "Olhar Intimidante"
  ]

  const atualizarLista = (e) => {
    e.preventDefault()
    const formatoMembro = /[^;]+\s*/g;
    const formularioMembros = values.membros
    const formularioParticipantes = values.participantes
    const logChat = values.logChat
    const nomeChefe = values.nomeChefe
    const membros = formularioMembros.match(formatoMembro)
    const participantes = formularioParticipantes.match(formatoMembro)
    const nomeItems = values.nomeItem
    let lista = []
  
    for(let i = 0; i < membros.length; i++){
      const formatoCura = new RegExp(`${membros[i]} lançou Bênção`, 'g')
      const curasAchadas = logChat.match(formatoCura)
      const qtdCura = curasAchadas != null ? curasAchadas.length : 0
      let qtdBuff = 0
      const decimal = /\d+(\.\d+)?/g;
      const formatoDano = new RegExp(`${membros[i]} ataca ${nomeChefe}, causando ${decimal.source} de dano`, 'g')
      const linhaDano = logChat.match(formatoDano)
      let danosCausados = []
      let totalDano =+ 0

      if (values.tipoMissao === 'chefe') {
        if(linhaDano != null) {
          linhaDano.map(linha => {
            var ret = linha.replace(`${membros[i]}`,'');
            danosCausados.push(ret.match(decimal))
          })
        }
  
        if(danosCausados.length > 0){
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

        if(linhaColeta != null) {
          linhaColeta.map(linha => {
            var ret = linha.replace(`${membros[i]}`,'')
            var t = ret.match(/[0-9]+/g)
            danosCausados.push(ret.match(/[0-9]+/g))
          })
        }

        if(danosCausados.length > 0){
          danosCausados.map(dano => {
            for (let i = 0; i < numItems; i++) {
              totalDano += Number(dano[i])
            }    
          })
        }
      }

      listaBuffs.map((buff) => {
        const formatoBuff = new RegExp(`${membros[i]} lançou ${buff}`, 'g')
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

  const encontrarMembro = (participantes, membro) => {
    const participante = participantes.find( function(o) {return o == membro} )
    return participante != null ? '✔' : ''
  }

  const calcularDestaques = (lista) => {
    const maiorBuff = Math.max(...lista.map(o => o.buffs))
    const maiorCura = Math.max(...lista.map(o => o.curas))
    const maiorDanoColeta = Math.max(...lista.map(o => o.danoOuColetados))

    const melhorBuffador = lista.find(
      function(o){ return o.buffs == maiorBuff; }
    ).membro

    const melhorCurandeiro = lista.find(
      function(o){ return o.curas == maiorCura; }
    ).membro

    const melhorDanoColeta = lista.find(
      function(o){ return o.danoOuColetados == maiorDanoColeta; }
    ).membro
    
    setValorDestaque({
      ...valorDestaque,
      melhorDanoColetor: melhorDanoColeta,
      melhorBuffador: melhorBuffador,
      melhorCurandeiro: melhorCurandeiro,
    })
  }

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

  const [numItems, setNumItems] = useState(1)

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

  const getUserAvatar = (user) => {
    habiticaAvatar.fromUserId(user, {
      ignore: {
        background: true,
        mount: true,
        pet: true,
      },
    }).then(function (avatar) {
      var test = document.getElementById('avatar')
      test.appendChild(avatar)
    })
  }

  return (
    <div className="App">
      <h1>Calculador de placar do grupo Habitica</h1>
      <form name='log' onSubmit={(e) => atualizarLista(e)}>
        <label>Insira a lista do grupo separadas por ;</label>
        <br />
        <textarea
          name="membros"
          rows="4"
          cols="50"
          onChange={handleInputChange}
          onInput={handleInputChange}
          disabled={false}
          value={values.membros}
        />
        <br />
        <label>Insira a lista de participantes separadas por ;</label>
        <br />
        <textarea
          name="participantes"
          rows="4"
          cols="50"
          onChange={handleInputChange}
          onInput={handleInputChange}
          disabled={false}
          value={values.participantes}
        />
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
        <div style={{ display: `${values.tipoMissao === 'chefe' ? 'block' : 'none'}`}}>
          <label>Nome do Chefe</label>
          <br />
          <input
            name="nomeChefe"
            type="text"
            onChange={handleInputChange}
            values={values.nomeChefe}
          />
        </div>
        <div style={{ display: `${values.tipoMissao === 'coleta' ? 'block' : 'none'}`}}>
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
        <br/>
        <input type="submit" />
      </form>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <table style={{border: "1px solid black"}} id="tabela">
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
                  backgroundColor: `${item.membro === valorDestaque.melhorCurandeiro ? 'yellow' : ''}` 
                }}
              >
                {item.curas}
              </td>
              <td 
                style={{ 
                  backgroundColor: `${item.membro === valorDestaque.melhorBuffador ? 'purple' : ''}` 
                }}
              >
                {item.buffs}
              </td>
              <td 
                style={{ 
                  backgroundColor: `${item.membro === valorDestaque.melhorDanoColetor ? 'red' : ''}` 
                }}
              >
                {item.danoOuColetados}
              </td>
              <td 
                style={{ 
                  backgroundColor: `${item.membro === valorDestaque.melhorFinalizador ? 'gray' : ''}` 
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
    </div>
  )
}

export default Home