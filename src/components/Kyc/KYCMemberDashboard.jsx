// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import BankDetailsForm from './BankDetailsForm';

// const KYCMemberDashboard = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploadingDoc, setUploadingDoc] = useState(null);
//   const [error, setError] = useState(null);
//   const {token } = getTokens();
//   const [documentNumbers, setDocumentNumbers] = useState({
//     AADHAR: '',
//     PAN: '',
//     BANK_STATEMENT: '',
//     CANCELLED_CHEQUE: ''
//   });
//   const documentTypes = [
//     { id: 'AADHAR', label: 'Aadhar Card', required: true },
//     { id: 'PAN', label: 'PAN Card', required: true },
//     { id: 'BANK_STATEMENT', label: 'Bank Statement', required: true },
//     { id: 'CANCELLED_CHEQUE', label: 'Cancelled Cheque', required: true }
//   ];

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         } 
//       });
//       const data = await response.json();
//       setDocuments(Array.isArray(data) ? data : []);
//       setLoading(false);
//       // setDocuments(data);
//       // setLoading(false);
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//       toast.error('Failed to load documents');
//       setError('Failed to load documents');
//       setLoading(false);
//       setDocuments([]);
//     }
//   };

//   const handleFileUpload = async (documentType, file) => {
//     if (!file) {
//       toast.error('Please select a file to upload');
//       return;
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size should not exceed 5MB');
//       return;
//     }

//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Only JPG, PNG and PDF files are allowed');
//       return;
//     }

//     // Get document number
//     const docNumber = prompt(`Please enter your ${documentType} number:`);
//     if (!docNumber || docNumber.trim() === '') {
//       toast.error('Document number is required');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('document_type', documentType);
//     formData.append('document_file', file);
//     formData.append('document_number', docNumber.trim());

//     setUploadingDoc(documentType);
//     setError(null);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         } ,
//         body: formData,
//       });

//       const data = await response.json();
//       console.log('data val - ' , data)
//       if (!response.ok) {
//         throw new Error(data.message || data.error || 'Upload failed');
//       }

//       toast.success('Document uploaded successfully');
//       await fetchDocuments();
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload document');
//       setError(error.message);
//     } finally {
//       setUploadingDoc(null);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       PENDING: (
//         <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
//           <AlertCircle size={16} /> Pending Verification
//         </span>
//       ),
//       VERIFIED: (
//         <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
//           <CheckCircle size={16} /> Verified
//         </span>
//       ),
//       REJECTED: (
//         <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
//           <XCircle size={16} /> Rejected
//         </span>
//       )
//     };
//     return badges[status] || status;
//   };

//   // const getDocumentStatus = (docType) => {
//   //   return documents.find(doc => doc.document_type === docType);
//   // };
//   const getDocumentStatus = (docType) => {
//     if (!Array.isArray(documents)) return null;
//     return documents.find(doc => doc.document_type === docType);
//   };

//   return (
//     <div className="py-12 ">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <Info className="h-5 w-5 text-blue-400" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-blue-700">
//                 Please upload all required KYC documents. This helps us verify your identity and maintain security.
//               </p>
//             </div>
//           </div>
//         </div>

        

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="px-6 py-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-900">KYC Documents</h2>
//           </div>

//           {loading ? (
//             <div className="p-6 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
//               <p className="mt-2 text-gray-500">Loading documents...</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {documentTypes.map((docType) => {
//                 const docStatus = getDocumentStatus(docType.id);
//                 return (
//                   <div key={docType.id} className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <FileText className="h-6 w-6 text-gray-400" />
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-900">
//                             {docType.label}
//                             {docType.required && (
//                               <span className="text-red-500 ml-1">*</span>
//                             )}
//                           </h3>
//                           {docStatus?.rejection_reason && (
//                             <p className="text-sm text-red-600 mt-1">
//                               Reason: {docStatus.rejection_reason}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-4">
//                         {docStatus ? (
//                           <>
//                             {getStatusBadge(docStatus.status)}
//                             {docStatus.status === 'REJECTED' && (
//                               <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                                 <Upload className="h-4 w-4 mr-2" />
//                                 Re-upload
//                                 <input
//                                   type="file"
//                                   className="hidden"
//                                   onChange={(e) => handleFileUpload(docType.id, e.target.files[0])}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                 />
//                               </label>
//                             )}
//                           </>
//                         ) : (
//                           <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                             {uploadingDoc === docType.id ? (
//                               <>
//                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-blue-500 mr-2"></div>
//                                 Uploading...
//                               </>
//                             ) : (
//                               <>
//                                 <Upload className="h-4 w-4 mr-2" />
//                                 Upload Document
//                               </>
//                             )}
//                             <input
//                               type="file"
//                               className="hidden"
//                               onChange={(e) => handleFileUpload(docType.id, e.target.files[0])}
//                               accept=".pdf,.jpg,.jpeg,.png"
//                               disabled={uploadingDoc === docType.id}
//                             />
//                           </label>
//                         )}
//                       </div>
//                     </div>

//                     {docStatus?.document_file && (
//                       <div className="mt-4 border rounded p-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-gray-500">
//                             Uploaded on: {new Date(docStatus.created_at).toLocaleDateString()}
//                           </span>
//                           <a
//                             href={docStatus.document_file}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 text-sm"
//                           >
//                             View Document
//                           </a>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KYCMemberDashboard;


'use client'
import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import BankDetailsForm from './BankDetailsForm';

const KYCMemberDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [error, setError] = useState(null);
  const { token } = getTokens();
  const [documentNumbers, setDocumentNumbers] = useState({
    AADHAR: '',
    PAN: '',
    BANK_STATEMENT: '',
    CANCELLED_CHEQUE: ''
  });
  const documentTypes = [
    { id: 'AADHAR', label: 'Aadhar Card', required: true },
    { id: 'PAN', label: 'PAN Card', required: true },
    { id: 'BANK_STATEMENT', label: 'Bank Statement', required: true },
    { id: 'CANCELLED_CHEQUE', label: 'Cancelled Cheque', required: true }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        } 
      });
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
      setError('Failed to load documents');
      setLoading(false);
      setDocuments([]);
    }
  };

  // Validate document numbers based on their type
  const validateDocumentNumber = (documentType, number) => {
    // Remove any spaces from the input
    const cleanNumber = number.replace(/\s/g, '');
    
    switch (documentType) {
      case 'AADHAR':
        // Must be exactly 12 digits
        const aadharRegex = /^\d{12}$/;
        if (!aadharRegex.test(cleanNumber)) {
          return {
            isValid: false,
            message: 'Aadhar number must be exactly 12 digits'
          };
        }
        return { isValid: true };
        
      case 'PAN':
        // Must be 10 characters: 5 letters followed by 4 digits followed by 1 letter
        // Format: AAAAA0000A
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(cleanNumber.toUpperCase())) {
          return {
            isValid: false,
            message: 'PAN number must be 10 characters in format AAAAA0000A'
          };
        }
        return { isValid: true };
        
      default:
        // For other document types, just ensure it's not empty
        if (!cleanNumber) {
          return {
            isValid: false,
            message: 'Document number cannot be empty'
          };
        }
        return { isValid: true };
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG and PDF files are allowed');
      return;
    }

    // Get document number with proper guidance
    let docNumber;
    let isValid = false;
    let validationMessage = '';
    
    do {
      // Show appropriate prompt based on document type
      if (documentType === 'AADHAR') {
        docNumber = prompt('Please enter your 12-digit Aadhar number:');
      } else if (documentType === 'PAN') {
        docNumber = prompt('Please enter your 10-character PAN number (Format: AAAAA0000A):');
      } else {
        docNumber = prompt(`Please enter your ${documentType} number:`);
      }
      
      // Check if cancelled
      if (docNumber === null) return;
      
      // Validate the document number
      const validation = validateDocumentNumber(documentType, docNumber);
      isValid = validation.isValid;
      validationMessage = validation.message;
      
      if (!isValid) {
        alert(validationMessage);
      }
    } while (!isValid);

    // Format the document number appropriately
    if (documentType === 'PAN') {
      docNumber = docNumber.toUpperCase();
    }
    
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('document_file', file);
    formData.append('document_number', docNumber.trim());

    setUploadingDoc(documentType);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Upload failed');
      }

      toast.success('Document uploaded successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
      setError(error.message);
    } finally {
      setUploadingDoc(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <AlertCircle size={16} /> Pending Verification
        </span>
      ),
      VERIFIED: (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <CheckCircle size={16} /> Verified
        </span>
      ),
      REJECTED: (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <XCircle size={16} /> Rejected
        </span>
      )
    };
    return badges[status] || status;
  };

  const getDocumentStatus = (docType) => {
    if (!Array.isArray(documents)) return null;
    return documents.find(doc => doc.document_type === docType);
  };

  return (
    <div className="py-12 ">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please upload all required KYC documents. This helps us verify your identity and maintain security.
                <br/>
                <strong>Note:</strong> Aadhar card requires a 12-digit number, and PAN card requires a 10-character alphanumeric code in the format AAAAA0000A.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">KYC Documents</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading documents...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documentTypes.map((docType) => {
                const docStatus = getDocumentStatus(docType.id);
                return (
                  <div key={docType.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {docType.label}
                            {docType.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h3>
                          {docType.id === 'AADHAR' && (
                            <p className="text-xs text-gray-500">12-digit numeric code required</p>
                          )}
                          {docType.id === 'PAN' && (
                            <p className="text-xs text-gray-500">10-character alphanumeric code required (AAAAA0000A)</p>
                          )}
                          {docStatus?.rejection_reason && (
                            <p className="text-sm text-red-600 mt-1">
                              Reason: {docStatus.rejection_reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {docStatus ? (
                          <>
                            {getStatusBadge(docStatus.status)}
                            {docStatus.status === 'REJECTED' && (
                              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Upload className="h-4 w-4 mr-2" />
                                Re-upload
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(docType.id, e.target.files[0])}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </label>
                            )}
                          </>
                        ) : (
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            {uploadingDoc === docType.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-blue-500 mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                              </>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(docType.id, e.target.files[0])}
                              accept=".pdf,.jpg,.jpeg,.png"
                              disabled={uploadingDoc === docType.id}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {docStatus?.document_file && (
                      <div className="mt-4 border rounded p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Uploaded on: {new Date(docStatus.created_at).toLocaleDateString()}
                          </span>
                          <a
                            href={docStatus.document_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Document
                          </a>
                        </div>
                        {docStatus.document_number && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">
                              Document Number: {docStatus.document_number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCMemberDashboard;