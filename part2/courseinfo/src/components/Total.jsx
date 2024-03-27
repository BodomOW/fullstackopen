const Total = ({ sum }) => {
    const totalExercices = sum.reduce((accumulator, part) => {
        // console.log(part.exercises)
        return accumulator += part.exercises
    }, 0)
    // console.log("totalExercices", totalExercices)

    return (
        <b>Total of exercises {totalExercices}</b>
    )
}

export default Total