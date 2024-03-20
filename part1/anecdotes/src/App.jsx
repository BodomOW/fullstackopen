import { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const App = () => {
  const anecdotes = [
    { id: 0, text: 'If it hurts, do it more often.', votes: 0 },
    { id: 1, text: 'Adding manpower to a late software project makes it later!', votes: 0 },
    { id: 2, text: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.', votes: 0 },
    { id: 3, text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', votes: 0 },
    { id: 4, text: 'Premature optimization is the root of all evil.', votes: 0 },
    { id: 5, text: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.', votes: 0 },
    { id: 6, text: 'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.', votes: 0 },
    { id: 7, text: 'The only way to go fast, is to go well.', votes: 0 }
  ]

  const [selected, setSelected] = useState(0)
  const [anecdoteArr, setAnecdoteArr] = useState(anecdotes)

  let mostVotedPosition = 0
  let mostVotedValue = 0

  const getMostVotedAnecdote = () => {
    anecdoteArr.map(anecdote => {
      const valueVote = anecdote.votes
      if (valueVote > mostVotedValue) {
        mostVotedPosition = anecdote.id
      }
      mostVotedValue = Math.max(mostVotedValue, valueVote)
    })
    console.log(`Most voted anecdote position is: ${mostVotedPosition}, total votes: ${mostVotedValue}`)
  }

  const handleVote = () => {
    setAnecdoteArr(anecdoteArr.map(anecdote => {
      if (anecdote.id === selected) {
        return {
          ...anecdote,
          votes: anecdote.votes + 1,
        }
      } else {
        return anecdote
      }
    }))
  }

  const handleRandomAnecdote = () => {
    setSelected(getRandomInt(8))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected].text}
      <div>has {anecdoteArr[selected].votes} votes</div>
      <br />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleRandomAnecdote}>next anecdote</button>
      <br />

      <h1>Anecdote with most votes</h1>
      {getMostVotedAnecdote()}
      {anecdotes[mostVotedPosition].text}
      <div>has {anecdoteArr[mostVotedPosition].votes} votes</div>
    </div>
  )
}

export default App