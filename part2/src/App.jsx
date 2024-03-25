const Course = ({ course }) => {
  // console.log(course.name)
  // console.log("course.parts", course.parts)

  const totalExercices = course.parts.reduce((accumulator, part) => {
    console.log(part.exercises)
    return accumulator += part.exercises
  }, 0)
  console.log("totalExercices", totalExercices)
  
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={totalExercices} />
    </>
  )
}

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <b>Total of exercises {sum}</b>

const Part = ({ part }) => {
  // console.log('Component Part', part)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  // console.log('Component Content', parts)
  return (
    <>
      {parts.map(part =>
        <Part
          part={part}
          key={part.id}
        />
      )}
    </>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      },
    ]
  }

  return <Course course={course} />
}

export default App