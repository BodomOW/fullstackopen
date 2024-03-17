const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}
const Part = (props) => {
  // console.log('Part component props: ', props)
  return (
    <p>{props.name} {props.exercises}</p>
  )
}
const Content = (props) => {
  console.log(props)
  console.log(props.part.parts)
  console.log(props.part.parts[0])

  return (
    <>
      <Part name={props.part.parts[0].name} exercises={props.part.parts[0].exercises} />
      <Part name={props.part.parts[1].name} exercises={props.part.parts[1].exercises} />
      <Part name={props.part.parts[2].name} exercises={props.part.parts[2].exercises} />
    </>
  )
}
const Total = (props) => {
  // console.log('Total props', props.exercises_total.parts[0].exercises + props.exercises_total.parts[1].exercises + props.exercises_total.parts[2].exercises)
  return (
    <>
      <p>Number of exercises {props.exercises_total.parts[0].exercises + props.exercises_total.parts[1].exercises + props.exercises_total.parts[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
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
  }

  return (
    <div>
      <Header course={course} />

      <Content part={course} />

      <Total exercises_total={course} />
    </div>
  )
}

export default App