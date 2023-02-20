import axios from 'axios'
import { useEffect, useState } from 'react'

function SearchModel() {
  console.log('models')
  const [objects, setObjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    axios
      .get(`http://localhost:8000/app/models-list/?search=${searchTerm}`)
      .then((res) => setObjects(res.data))
      .catch((err) => console.log(err))
  }, [searchTerm]);

    return (
    <div className='h-screen w-1/6 bg-slate-800'>
      <input
        type='text'
        placeholder='Search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {objects.map((object) => (
          <li key={object.uuid}>
            {object.name} - {object.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default SearchModel
