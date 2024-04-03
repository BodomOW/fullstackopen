const Persons = ({ personsToShow }) => {
    // console.log(personsToShow)
    return (
        <ul style={{ padding: "0" }}>
            {
                personsToShow.map(person => <li key={person.id} style={{ listStyleType: "none" }}>{person.name} {person.number}</li>)
            }
        </ul>
    )
}

export default Persons