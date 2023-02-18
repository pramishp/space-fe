function Sidebar({handleModelsClick, handleUploadClick}) {
  return (
	<div className="flex flex-col items-center w-1/6 h-screen text-gray-400 bg-gray-900 ">
		<div className="flex items-center w-full px-5 mt-3">
			<span className="ml-2 text-2xl font-bold">Space XR</span>
		</div>
		<div className="w-full px-2">
			<div className="flex flex-col items-center w-full h-full mt-3 border-t border-gray-700">
				<div className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" onClick={handleModelsClick}>
					<span className="ml-2 text-xl font-semi-bold">Models</span>
				</div>
				<div className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" onClick={handleUploadClick}>
					<span className="ml-2 text-xl font-semi-bold">Upload</span>
				</div>
			</div>

		</div>

	</div>  )
}

export default Sidebar
