import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { addProject} from '../../api/ProjectApi';

const CreateProject = ({isCreateOpen, setIsCreateOpen}) => {

  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));


  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

 const onClose = () => {
    setIsCreateOpen(!isCreateOpen)
 }

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!projectName) {
      // console.log('Please fill in project name ');
      return;
    }

    const newProject = {
      uid: locallySavedUser.id,
      projectName: projectName,
      description: description
    };

    try{
      const response = await addProject(`projects/project/${locallySavedUser.companyId}`,newProject)
      console.log(response)
    }
    catch(error){
      console.log(error)
    }
    finally{
      setProjectName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <button 
         onClick={()=>onClose()}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="projectName" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Name
            </label>
            <input 
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>


          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description (optional)"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};





export default CreateProject;