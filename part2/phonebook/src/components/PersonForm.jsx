const PersonForm = ({ handleSubmit, name, number, handleNameChange, handleNumberChange }) => {
    // console.log(handleSubmit)
    return (
        <form onSubmit={handleSubmit}>
            <div>
                name: <input value={name} onChange={handleNameChange} />
            </div>
            <div>number: <input value={number} onChange={handleNumberChange} /></div>

            <div>
                <button type="submit">add</button>
            </div>

        </form>
    )
}

export default PersonForm