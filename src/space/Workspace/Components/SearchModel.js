import axios from 'axios'
import { useEffect, useState } from 'react'

function SearchModel({onModelUpload}) {
  console.log('models')
  const [objects, setObjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleClick = (url) => {
    console.log('handle click is called')
    console.log(url)
    onModelUpload(url)
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8000/app/models-list/?search=${searchTerm}`)
      .then((res) => setObjects(res.data))
      .catch((err) => console.log(err))
  }, [searchTerm]);

    return (
<div className='h-screen w-1/6 bg-slate-800 overflow-y-auto'>
  <input
    type='text'
    placeholder='Search'
    className='w-full px-3 py-2 rounded-md border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <ul className='mt-4'>
    {objects.map((object) => (
      <li key={object.uuid} className='rounded-md shadow-md overflow-hidden mb-4'>
        <div className='bg-white p-4'>
          <h2 className='text-gray-900 text-lg font-medium mb-2'>{object.name}</h2>
          <img className='w-full object-cover h-40 mb-2' src={object.images} alt='No image found' />
          <button className='text-gray-600 text-sm' onClick={()=>handleClick(object.model)}>OPEN</button>
        </div>
      </li>
    ))}
  </ul>
</div>
  )
}
export default SearchModel
