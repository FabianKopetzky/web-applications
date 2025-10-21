import { useParams } from "react-router-dom"

function HouseHold() {

  const { id } = useParams();

  return (
    <>
      <h1 className='text-center'>Household { id }</h1>
    </>
  )
}

export default HouseHold
