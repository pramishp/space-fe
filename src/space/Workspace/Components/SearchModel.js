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
    <div className="grid grid-cols-2 gap-4">
      {objects.map((object) => (
          <div key={object.id}>
            <img
              className="w-32 h-24 cursor-pointer"
              src={object.images}
              alt="No image found"
              onClick={() => handleClick(object.model)}
            />
          </div>
      ))}
    </div>
</div>
  )
}
export default SearchModel
