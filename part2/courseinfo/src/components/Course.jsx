import Header from "./Header"
import Content from "./Content"
import Total from "./Total"

const Course = ({ course }) => {
    // console.log(course)
    // console.log("course.parts", course.parts)

    return (
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total sum={course.parts} />
        </>
    )
}

export default Course