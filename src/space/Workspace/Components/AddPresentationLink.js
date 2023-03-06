import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'

const AddPresentationLink = () => {
  const { authTokens, logoutUser } = useContext(AuthContext)
  const [presentationLink, setPresentationLink] = useState('')
  const navigate = useNavigate()
  const handlePLSubmit = async (event) => {
    event.preventDefault()
    const response = await fetch(
      `http://127.0.0.1:8000/app/pid-by-presentation-link/?presentation_link=${presentationLink}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      }
    )
    const data = await response.json()
    if (response.status === 200) {
      console.log(data)
      navigate(`/presentation/${data.project_id}/2d`)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }
  return (
    <form onSubmit={handlePLSubmit}>
      <input
        type='text'
        placeholder='Enter presentation Link'
        value={presentationLink}
        onChange={(event) => setPresentationLink(event.target.value)}
      />
      <button type='submit'>Enter</button>
    </form>
  )
}
export default AddPresentationLink
