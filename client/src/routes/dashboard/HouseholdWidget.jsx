

function HouseholdWidget({houseHoldName, houseHoldID, onClick, onDelete}) {
    

    return (<>
        <div>
            <h4>{houseHoldName}</h4>
            <button onClick={() => onClick(houseHoldID)}>Open</button>
            <button onClick={() => onDelete(houseHoldID)}>Delete</button>
        </div>
    </>)
}

export default HouseholdWidget;