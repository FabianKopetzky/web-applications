

function HouseholdWidget({houseHoldName, houseHoldID, memberCount, onClick, onDelete}) {
    

    return (<>
        <div>
            <h4>{houseHoldName}</h4>
            <p>(Members: {memberCount})</p>
            <button onClick={() => onClick(houseHoldID)}>Open</button>
            <button onClick={() => onDelete(houseHoldID)}>Delete</button>
        </div>
    </>)
}

export default HouseholdWidget;