import { useState } from 'react'

const Feedback = props => {
  return (
    <div>{props.text} {props.number}</div>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const totalFeedback = good + neutral + bad
  const avg = totalFeedback / 3
  const positive = (good / totalFeedback) * 100
  console.log((isNaN(positive)))

  if (totalFeedback === 0){
    return (
      <>
        No feedback given
      </>
    )
  }

  return (
    <>
      <Feedback number={good} text="Good"/>
      <Feedback number={neutral} text="Neutral"/>
      <Feedback number={bad} text="Bad"/>
      <span>All {totalFeedback}</span>
      <br />
      <span>Average {avg}</span>
      <br />
      <span>Positive percentage {isNaN(positive) ? '0' : positive} %</span>
    </>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text="Good" />
      <Button handleClick={handleNeutralClick} text="Neutral" />
      <Button handleClick={handleBadClick} text="Bad" />

      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App