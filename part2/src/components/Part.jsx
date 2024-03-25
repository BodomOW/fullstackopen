const Part = ({ part }) => {
    // console.log('Component Part', part)
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}

export default Part