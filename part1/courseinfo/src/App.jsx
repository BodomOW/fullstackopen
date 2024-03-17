const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}
const Part = (props) => {
  console.log('Part component props: ', props)
  return (
    <p>{props.name} {props.exercises}</p>
  )
}
const Content = (props) => {
  console.log(props)
  console.log(props.parts)
  console.log(props.parts[0])

  // const parts = 
  return (
    <>
      <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
    </>
  )
}
const Total = (props) => {
  console.log('Total props', props.exercises_total[0].exercises + props.exercises_total[1].exercises + props.exercises_total[2].exercises)
  return (
    <>
      <p>Number of exercises {props.exercises_total[0].exercises + props.exercises_total[1].exercises + props.exercises_total[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />

      <Content parts={parts} />

      <Total exercises_total={parts} />
    </div>
  )
}

export default App