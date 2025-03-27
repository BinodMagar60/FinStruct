import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const CreateProject = ({isCreateOpen, setIsCreateOpen}) => {



  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');

 const onClose = () => {
    setIsCreateOpen(!isCreateOpen)
 }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!projectName || !projectType) {
      alert('Please fill in project name and type');
      return;
    }

    // Prepare project data
    const newProject = {
      name: projectName,
      type: projectType,
      description: description
    };

    // TODO: Replace with actual API call to save project
    console.log('New Project:', newProject);
    
    // Reset form
    setProjectName('');
    setProjectType('');
    setDescription('');

    // Close the modal
    onClose();
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label 
              htmlFor="projectType" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Type
            </label>
            <select
              id="projectType"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select project type</option>
              <option value="software">Software Development</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
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