import { useState } from 'react'

const StatisticLine = props => {
  return (
    <div>{props.text} {props.value}</div>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const totalFeedback = good + neutral + bad

  const goodPoints = good
  const badPoints = -bad
  const totalPoints = goodPoints + badPoints
  const avg = totalPoints / totalFeedback

  const positive = (good / totalFeedback) * 100

  if (totalFeedback === 0){
    return (
      <>
        No feedback given
      </>
    )
  }

  return (
    <>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral}/>
      <StatisticLine text="Bad" value={bad}/>
      <StatisticLine text="All" value={totalFeedback}/>
      <StatisticLine text="Average" value={avg}/>
      <StatisticLine text="Positive percentage" value={`${positive} %`}/>
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