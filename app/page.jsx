
'use client'
import { useState, useEffect } from 'react'

function balance(players){
  const A=[],B=[]
  let a=0,b=0
  const by=p=>players.filter(x=>x.position===p).sort((x,y)=>y.level-x.level)

  by('portero').forEach((p,i)=>{
    (i%2===0?A:B).push(p)
    i%2===0?a+=p.level:b+=p.level
  })

  ;['defensa','medio','delantero'].forEach(pos=>{
    by(pos).forEach(p=>{
      if(a<=b){A.push(p);a+=p.level}
      else{B.push(p);b+=p.level}
    })
  })

  return {A,B,a,b}
}

export default function Home(){
  const [players,setPlayers]=useState([])
  const [name,setName]=useState('')
  const [level,setLevel]=useState(5)
  const [position,setPosition]=useState('medio')

  useEffect(()=>{
    const stored=localStorage.getItem('players')
    if(stored) setPlayers(JSON.parse(stored))
  },[])

  useEffect(()=>{
    localStorage.setItem('players',JSON.stringify(players))
  },[players])

  const add=()=>{
    if(!name) return
    setPlayers([...players,{id:Date.now(),name,level:+level,position}])
    setName('')
  }

  const del=id=>setPlayers(players.filter(p=>p.id!==id))

  const {A,B,a,b}=balance(players)

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">⚽ Team Balancer Private</h1>

      <div className="bg-gray-100 p-4 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Añadir jugador</h2>
        <div className="flex gap-2 flex-wrap">
          <input className="border p-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border p-2 w-20" type="number" min="0" max="10" value={level} onChange={e=>setLevel(e.target.value)} />
          <select className="border p-2" value={position} onChange={e=>setPosition(e.target.value)}>
            <option value="portero">Portero</option>
            <option value="defensa">Defensa</option>
            <option value="medio">Medio</option>
            <option value="delantero">Delantero</option>
          </select>
          <button className="bg-black text-white px-4" onClick={add}>Añadir</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">Equipo A ({a})</h2>
          {A.map(p=><div key={p.id}>{p.name} – {p.position}</div>)}
        </div>
        <div>
          <h2 className="text-xl font-bold">Equipo B ({b})</h2>
          {B.map(p=><div key={p.id}>{p.name} – {p.position}</div>)}
        </div>
      </div>

      <p className="mt-4">Diferencia: {Math.abs(a-b)}</p>
    </main>
  )
}
