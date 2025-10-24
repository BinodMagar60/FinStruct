import React, { useState, useRef, useEffect } from 'react';
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
import fileDownload from 'js-file-download'
import Uploading from '../../../utils/uploading';
import Loading from '../../../Components/Loading';
import { deleteAFile, downloadFileFromBackend, getFilesFromBackend, uploadAFile } from '../../../api/AdminApi';

const Docs = () => {

  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [change, setChange] = useState(true)
  const [isUploading, setUploading] = useState(false)
  const [isLoaidng, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await getFilesFromBackend(`admin/user/document/data?uid=${locallySavedUser.id}&cid=${locallySavedUser.companyId}`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
      finally{
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [change]);

  
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={18} className="text-red-500" />;
      case 'docx': return <FileText size={18} className="text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet size={18} className="text-green-500" />;
      case 'jpg':
      case 'png': return <Image size={18} className="text-purple-500" />;
      default: return <File size={18} className="text-gray-500" />;
    }
  };

  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewFileName(file.name);
      const extension = file.name.split('.').pop().toLowerCase();
      setNewFileType(extension);
    }
  };


  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true)
      const res = await uploadAFile(`admin/user/document/data?uid=${locallySavedUser.id}&cid=${locallySavedUser.companyId}`, formData);

      setNewFileName('');
      setSelectedFile(null);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload failed:', err);
    }
    finally{
        setChange(prev => !prev)
        setUploading(false)
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAFile(`admin/user/document/data/${id}`);
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. Please try again.');
    }
    finally{
      setChange(prev=> !prev)
    }
  };
  




  const handleDownload = async (doc) => {
    try {
      const { data } = await downloadFileFromBackend(`admin/user/document/data/download/${doc._id}`);
      fileDownload(data, doc.name); 
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to download file. Please try again.");
    }
    finally{
      setChange(prev=> !prev)
    }
  };
  
  

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {

    const getSizeInKB = (size) => {
      if (size.includes('MB')) return parseFloat(size) * 1024;
      return parseFloat(size);
    };

    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'size') {
      return sortOrder === 'asc'
        ? getSizeInKB(a.size) - getSizeInKB(b.size)
        : getSizeInKB(b.size) - getSizeInKB(a.size);
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    }
    return null;
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
  
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }
  

  return (
    <div className="">
      <div className="bg-white rounded p-4 pb-8">
        {
          isLoaidng? <Loading/> : (
            <>
            <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>

          <div className="flex items-center space-x-4 gap-10">
            <form onSubmit={(e) => e.preventDefault()} className="flex w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
              />
              <button
                className="bg-black text-white py-2 px-4 rounded-r-md"
              >
                <Search size={18} />
              </button>
            </form>

            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} className="mr-2" /> Upload
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md ">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="p-4 border-b border-gray-200 font-medium">
                <th onClick={() => handleSort('name')} className="py-3 px-6 text-left cursor-pointer">
                  <div className="flex items-center">Name {getSortIcon('name')}</div>
                </th>
                <th className="py-3 px-6 text-left">Type</th>
                <th onClick={() => handleSort('size')} className="py-3 px-6 text-left cursor-pointer">
                  <div className="flex items-center">Size {getSortIcon('size')}</div>
                </th>
                <th onClick={() => handleSort('date')} className="py-3 px-6 text-left cursor-pointer">
                  <div className="flex items-center">Date Modified {getSortIcon('date')}</div>
                </th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-base">
              {sortedDocuments.map(doc => (
                <tr key={doc._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <span className="mr-2">{getFileIcon(doc.type)}</span>
                      <span>{doc.name.length > 30 ? doc.name.slice(0, 50) + '...' : doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{String(doc.type).toLowerCase()}</td>
                  <td className="py-3 px-6 text-left">{doc.size}</td>
                  <td className="py-3 px-6 text-left">{formatDate(doc.date)}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleDownload(doc)} className="hover:text-blue-500">
                        <Download size={18} />
                      </button>
                      <button onClick={() => handleDelete(doc._id)} className="hover:text-red-500">
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
          <div className="text-center py-10 text-gray-500">No documents found</div>
        )}
            </>
          )
        }
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#00000014   ] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="File name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              disabled
            />

            <div
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setSelectedFile(file);
                  setNewFileName(file.name);
                  setNewFileType(file.name.split('.').pop().toLowerCase());
                }
              }}
            >
              {
                isUploading? <Uploading/> : (
                  <>
                  <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
              />
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-sm text-green-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedFile.size > 1024 * 1024
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(selectedFile.size / 1024)} KB`}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Drag and drop files here or click to browse</p>
              )} 
                  </>
                )
              }
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
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-white rounded ${selectedFile ? 'bg-black hover:bg-gray-800' : 'bg-gray-700 cursor-not-allowed'}`}
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
