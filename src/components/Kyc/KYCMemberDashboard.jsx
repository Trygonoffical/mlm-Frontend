import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const KYCMemberDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [error, setError] = useState(null);

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
      const response = await fetch('/api/kyc-documents/');
      const data = await response.json();
      setDocuments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
      setLoading(false);
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('document_file', file);

    setUploadingDoc(documentType);
    setError(null);

    try {
      const response = await fetch('/api/kyc-documents/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      fetchDocuments();
    } catch (error) {
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
    return documents.find(doc => doc.document_type === docType);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please upload all required KYC documents. This helps us verify your identity and maintain security.
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