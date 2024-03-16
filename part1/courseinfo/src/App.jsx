const Header = (props) => {
  // console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}
const Part = (props) => {
  console.log(props)
  return (
    <p>{props.part} {props.exercises}</p>
  )
}
const Content = (props) => {
  console.log(props)
  console.log(props.part.part1)
  console.log(props.exercises.exercises1)
  return (
    <>
      <Part part={props.part.part1} exercises={props.exercises.exercises1} />
      <Part part={props.part.part2} exercises={props.exercises.exercises2} />
      <Part part={props.part.part3} exercises={props.exercises.exercises3} />
    </>
  )
}
const Total = (props) => {
  // console.log(props)
  return (
    <p>Number of exercises {props.exercises_total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>

      <Content part={{part1, part2, part3}} exercises={{exercises1, exercises2, exercises3}} />

      <Total exercises_total={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App