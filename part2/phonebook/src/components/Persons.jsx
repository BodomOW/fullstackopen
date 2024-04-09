const Persons = ({ personsToShow, handleDeletePerson }) => {
    // console.log(personsToShow)
    return (
        <ul style={{ padding: "0" }}>
            {
                personsToShow.map(person =>
                    <li key={person.id} style={{ listStyleType: "none" }}>{person.name} {person.number} <button onClick={() => handleDeletePerson(person.id, person.name)}>Delete</button></li>
                )
            }
        </ul>
    )
}

export default Persons