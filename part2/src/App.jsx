const Course = ({ course }) => {
  // console.log(course.name)
  // console.log(course.parts)
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      {/* <Total sum={parts[0].exercises + parts[1].exercises + parts[2].exercises} /> */}
    </>
  )
}

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => {
  console.log('Component Part', part)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log('Component Content', parts)
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
        name: 'Another Part',
        exercises: 5,
        id: 4
      },
      {
        name: 'Extra Part',
        exercises: 24,
        id: 5
      }
    ]
  }

  return <Course course={course} />
}

export default App