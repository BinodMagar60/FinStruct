import React, { useState, useRef } from 'react';
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  Image, 
  Upload, 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  X
} from 'lucide-react';

const Docs = () => {
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Financial Report Q1', type: 'pdf', size: '2.4 MB', date: '2025-03-15', content: 'Sample content for Financial Report' },
    { id: 2, name: 'Budget Proposal', type: 'xlsx', size: '1.8 MB', date: '2025-03-10', content: 'Sample content for Budget Proposal' },
    { id: 3, name: 'Invoice Template', type: 'docx', size: '856 KB', date: '2025-02-28', content: 'Sample content for Invoice Template' }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date) - new Date(b.date) 
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'size') {
      const getSizeInKB = (size) => {
        if (size.includes('MB')) return parseFloat(size) * 1024;
        return parseFloat(size);
      };
      return sortOrder === 'asc' 
        ? getSizeInKB(a.size) - getSizeInKB(b.size) 
        : getSizeInKB(b.size) - getSizeInKB(a.size);
    }
    return 0;
  });
  
  // File type icon mapping using Lucide icons
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText size={18} className="text-red-500" />;
      case 'docx': return <FileText size={18} className="text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet size={18} className="text-green-500" />;
      case 'jpg':
      case 'png': return <Image size={18} className="text-purple-500" />;
      default: return <File size={18} className="text-gray-500" />;
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setNewFileName(file.name);
      
      // Extract file type from extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      setNewFileType(fileExtension);
    }
  };
  
  // Handle file upload
  const handleUpload = () => {
    if (!newFileName) return;
    
    // Format file size
    let fileSize = '0 KB';
    if (selectedFile) {
      const size = selectedFile.size;
      if (size > 1024 * 1024) {
        fileSize = `${(size / (1024 * 1024)).toFixed(1)} MB`;
      } else {
        fileSize = `${Math.round(size / 1024)} KB`;
      }
    }
    
    const newDoc = {
      id: documents.length + 1,
      name: newFileName,
      type: newFileType || newFileName.split('.').pop() || 'unknown',
      size: fileSize,
      date: new Date().toISOString().split('T')[0],
      content: selectedFile ? `Content of ${newFileName}` : 'Empty document'
    };
    
    setDocuments([...documents, newDoc]);
    setNewFileName('');
    setNewFileType('');
    setSelectedFile(null);
    setShowUploadModal(false);
  };
  
  // Handle document deletion
  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality is already implemented through the searchQuery state
  };
  
  // Toggle sort order
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    }
    return null;
  };
  
  // Handle download document
  const handleDownload = (doc) => {
    // Create a blob with some content
    const blob = new Blob([`Sample content for ${doc.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };
  
  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setNewFileName(file.name);
      
      // Extract file type from extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      setNewFileType(fileExtension);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow-md p-4 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>
          
          <div className="flex items-center space-x-4 gap-10">
            <form onSubmit={handleSearch} className="flex w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-black text-white cursor-pointer hover:bg-gray-800 py-2 px-4 rounded-r-md focus:outline-none"
              >
                <Search size={18} />
              </button>
            </form>

            <button 
              className="bg-black cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} className="mr-2" /> Upload Document
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-md shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="p-4 border-b border-gray-200 font-medium leading-normal">
                <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    <span>Name</span>
                    <span className="ml-1">{getSortIcon('name')}</span>
                  </div>
                </th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('size')}>
                  <div className="flex items-center">
                    <span>Size</span>
                    <span className="ml-1">{getSortIcon('size')}</span>
                  </div>
                </th>
                <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    <span>Date Modified</span>
                    <span className="ml-1">{getSortIcon('date')}</span>
                  </div>
                </th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-base">
              {sortedDocuments.map(doc => (
                <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50 text-md">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{getFileIcon(doc.type)}</span>
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {doc.type.toUpperCase()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {doc.size}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {doc.date}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 gap-5">
                      <button 
                        className="transform hover:text-blue-500 hover:scale-110 cursor-pointer"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        className="transform hover:text-red-500 hover:scale-110 cursor-pointer"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No documents found</p>
          </div>
        )}
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="File name (e.g. Budget 2025.xlsx)"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            
            <div 
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
              />
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-sm text-green-600 font-medium">{selectedFile.name} selected</p>
                  <p className="text-xs text-gray-500">
                    {selectedFile.size > 1024 * 1024
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(selectedFile.size / 1024)} KB`}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Drag and drop files here or click to browse</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setNewFileName('');
                }}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 ${newFileName ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'} text-white rounded`}
                onClick={handleUpload}
                disabled={!newFileName}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;