'use client'

import { useState, useEffect } from 'react'

// Función para balancear equipos
function balance(players) {
  const A = [], B = []
  let a = 0, b = 0
  const by = p => players.filter(x => x.position === p).sort((x, y) => y.level - x.level)

  // Porteros
  by('portero').forEach((p, i) => {
    (i % 2 === 0 ? A : B).push(p)
    i % 2 === 0 ? a += p.level : b += p.level
  })

  // Defensas, medios, delanteros
  ['defensa', 'medio', 'delantero'].forEach(pos => {
    by(pos).forEach(p => {
      if (a <= b) { A.push(p); a += p.level }
      else { B.push(p); b += p.level }
    })
  })

  return { A, B, a, b }
}

export default function Home() {
  const [players, setPlayers] = useState([])
  const [name, setName] = useState('')
  const [level, setLevel] = useState(5)
  const [position, setPosition] = useState('medio')

  useEffect(() => {
    const stored = localStorage.getItem('players')
    if (stored) setPlayers(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players))
  }, [players])

  const add = () => {
    if (!name) return
    setPlayers(prev => [...prev, { id: Date.now() + Math.random(), name, level: +level, position }])
    setName('')
  }

  const del = id => setPlayers(prev => prev.filter(p => p.id !== id))

  const reorganize = () => setPlayers(prev => [...prev].sort(() => Math.random() - 0.5))

  const { A, B, a, b } = balance(players)

  const positionColors = {
    portero: 'bg-blue-200',
    defensa: 'bg-green-200',
    medio: 'bg-orange-200',
    delantero: 'bg-red-200'
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">⚽ Team Balancer PRO</h1>

      {/* Añadir jugador */}
      <div className="bg-gray-100 p-4 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Añadir jugador</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="border p-2 rounded w-32" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 rounded w-20" type="number" min="0" max="10" value={level} onChange={e => setLevel(e.target.value)} />
          <select className="border p-2 rounded" value={position} onChange={e => setPosition(e.target.value)}>
            <option value="portero">Portero</option>
            <option value="defensa">Defensa</option>
            <option value="medio">Medio</option>
            <option value="delantero">Delantero</option>
          </select>
          <button className="bg-black text-white px-4 py-2 rounded" onClick={add}>Añadir</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={reorganize}>Reorganizar equipos</button>
        </div>
      </div>

      {/* Equipos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Equipo A */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Equipo A ({a})</h2>
          {A.map(p => (
            <div key={p.id} className={`flex justify-between items-center p-2 rounded mb-1 ${positionColors[p.position]}`}>
              <span>{p.name} – {p.position}</span>
              <button className="text-red-600 font-bold" onClick={() => del(p.id)}>X</button>
            </div>
          ))}
        </div>

        {/* Equipo B */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Equipo B ({b})</h2>
          {B.map(p => (
            <div key={p.id} className={`flex justify-between items-center p-2 rounded mb-1 ${positionColors[p.position]}`}>
              <span>{p.name} – {p.position}</span>
              <button className="text-red-600 font-bold" onClick={() => del(p.id)}>X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Diferencia de nivel */}
      <p className="mt-4 font-semibold">Diferencia de nivel: <span className={Math.abs(a - b) <= 2 ? 'text-green-600' : Math.abs(a - b) <= 5 ? 'text-yellow-600' : 'text-red-600'}>{Math.abs(a - b)}</span></p>
    </main>
  )
}
