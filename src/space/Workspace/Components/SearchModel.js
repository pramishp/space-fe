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
<div>
    <div className="mb-4 mt-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <ul className="space-y-4">
      {objects.map((object) => (
        <li key={object.uuid}>
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-lg font-medium mb-2">{object.name}</h2>
            <img
              className="w-full mb-2"
              src={object.images}
              alt="No image found"
            />
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleClick(object.model)}
            >
              OPEN
            </button>
          </div>
        </li>
      ))}
    </ul>
</div>
  )
}
export default SearchModel
