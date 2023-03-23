import { LocalConvenienceStoreOutlined } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../utils/useAxios"

const ProjectCard = ({project}) => {
    const [presentOptions, setPresentOptions] = useState(false)
    const api = useAxios()
    const navigate = useNavigate()
    const handleDropDownOption = () => {
        setPresentOptions((prevState) => !prevState)
      }
      const handleClick = (projectId) => {
        navigate(`/workspace/${projectId}`)
      }
      const handle2dClicked = (workspaceId) => {
        navigate(`/presentation/${workspaceId}/2d_interactive`)
      }
      const handleVRClicked = (workspaceId) => {
        navigate(`/presentation/${workspaceId}/vr`)
      }
      const handleARClicked = (workspaceId) => {
        navigate(`/presentation/${workspaceId}/ar`)
      }
      
    return (
        <div className='flex flex-col pb-2 overflow-auto'>
                      <div
                        className='relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100'
                        onClick={() => handleClick(project.id)}
                      >
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDropDownOption()
                          }}
                          className='absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex'
                        >
                          <svg
                            className='w-4 h-4 fill-current'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                          </svg>
                        </button>
                      {/*TODO: change this code so that the scroll bar on the dropdown does not appear.*/}
                        {presentOptions && (
                          <div className='absolute z-10 bg-white rounded-lg shadow-md mt-5 right-0 scrollbar-none overflow-y-hidden'>
                            {/* <button
                              onClick={(event) => {
                                event.stopPropagation()
                                handleWorkspaceJoin(project.id)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              Share Project
                            </button> */}
                            <button
                              onClick={(event) => {
                                console.log(
                                  'Interactive 2D Presentation selected'
                                )
                                event.stopPropagation()
                                handle2dClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              2D Presentation
                            </button>
                            <button
                              onClick={(event) => {
                                console.log('VR Presentation selected')
                                event.stopPropagation()
                                handleVRClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              VR Presentation
                            </button>
                            <button
                              onClick={(event) => {
                                console.log('AR Presentation selected')
                                event.stopPropagation()
                                handleARClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              AR Presentation
                            </button>
                          </div>
                        )}
                        <h4 className='mt-3 text-lg font-bold'>
                          {project.name}
                        </h4>
                        <h2 className='mt-3 text-xs'>
                              Join Pin :{project.workspace_pin.key}
                        </h2>
                        <div className='flex items-center w-full mt-3 text-xs font-medium text-gray-400'>
                          <div className='flex items-center'>
                            <svg
                              className='w-4 h-4 text-gray-300 fill-current'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='ml-1 leading-none'>
                              {project.created_date}
                            </span>
                            
                          </div>
                        </div>
                        
                        
                      </div>
                    </div>
    )
}

export default ProjectCard