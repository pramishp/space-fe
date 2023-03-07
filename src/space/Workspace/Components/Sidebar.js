function Sidebar({ handleModelsClick, handleOptionsClick }) {
  return (
    <div class='flex flex-col items-center w-24 h-screen overflow-hidden text-indigo-300 bg-indigo-900 rounded'>
      <div class='flex flex-col items-center mt-3 border-t border-gray-700'>
        <div class='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-indigo-700' onClick={handleModelsClick}>
          <svg
            class='w-10 h-10'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              class='fill-current'
              d='M12.75 13.81v7.44a.75.75 0 1 1-1.5 0v-7.4L9.49 15.6a.75.75 0 1 1-1.06-1.06l2.35-2.36c.68-.68 1.8-.68 2.48 0l2.35 2.36a.75.75 0 1 1-1.06 1.06l-1.8-1.8zM9 18v1.5H6.75v-.01A5.63 5.63 0 0 1 5.01 8.66a6 6 0 0 1 11.94-.4 5.63 5.63 0 0 1 .3 11.23v.01H15V18h1.88a4.12 4.12 0 1 0-1.5-7.97A4.51 4.51 0 0 0 11 4.5a4.5 4.5 0 0 0-4.43 5.29 4.13 4.13 0 0 0 .68 8.2V18H9z'
            />
          </svg>
          <span class='text-base font-semibold leading-6'>Models</span>
        </div>
        <div class='flex flex-col items-center justify-center w-full h-full mt-3 p-3 rounded-lg hover:bg-indigo-700' onClick={handleOptionsClick}>
          <svg
            class='w-10 h-10'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              class='fill-current'
              d='M12.75 13.81v7.44a.75.75 0 1 1-1.5 0v-7.4L9.49 15.6a.75.75 0 1 1-1.06-1.06l2.35-2.36c.68-.68 1.8-.68 2.48 0l2.35 2.36a.75.75 0 1 1-1.06 1.06l-1.8-1.8zM9 18v1.5H6.75v-.01A5.63 5.63 0 0 1 5.01 8.66a6 6 0 0 1 11.94-.4 5.63 5.63 0 0 1 .3 11.23v.01H15V18h1.88a4.12 4.12 0 1 0-1.5-7.97A4.51 4.51 0 0 0 11 4.5a4.5 4.5 0 0 0-4.43 5.29 4.13 4.13 0 0 0 .68 8.2V18H9z'
            />
          </svg>
          <span class='text-base font-semibold leading-6'>Options</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
