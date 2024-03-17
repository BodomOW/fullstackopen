const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}
const Part = (props) => {
  console.log('Part component props: ' + props.name + ' ' + props.exercises)
  return (
    <p>{props.name} {props.exercises}</p>
  )
}
const Content = (props) => {
  console.log(props)
  console.log(props.part)
  console.log(props.part[2])

  // const parts = 
  return (
    <>
      <Part name={props.part[0].name} exercises={props.part[0].exercises} />
      <Part name={props.part[1].name} exercises={props.part[1].exercises} />
      <Part name={props.part[2].name} exercises={props.part[2].exercises} />
    </>
  )
}
const Total = (props) => {
  return (
    <p>Number of exercises {props.exercises_total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />

      <Content part={[part1, part2, part3]} />

      <Total exercises_total={part1.exercises + part2.exercises + part3.exercises} />
    </div>
  )
}

export default App