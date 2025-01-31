export const ProfileTab = ({ member }) => {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1">{`${member.user.first_name} ${member.user.last_name}`}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1">{member.user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                        <p className="mt-1">{member.user.phone_number}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Join Date</label>
                        <p className="mt-1">{new Date(member.join_date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* MLM Information */}
            <div>
                <h3 className="text-lg font-medium mb-4">MLM Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Position</label>
                        <p className="mt-1">{member.position.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Sponsor</label>
                        <p className="mt-1">{member.sponsor_name || 'Direct'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Total BP</label>
                        <p className="mt-1">{member.total_bp}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Total Earnings</label>
                        <p className="mt-1">₹{member.total_earnings}</p>
                    </div>
                </div>
            </div>

            {/* Bank Details */}
            <div>
                <h3 className="text-lg font-medium mb-4">Bank Information</h3>
                {member.bank_details ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                            <p className="mt-1">{member.bank_details.bank_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Account Number</label>
                            <p className="mt-1">{member.bank_details.account_number}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">IFSC Code</label>
                            <p className="mt-1">{member.bank_details.ifsc_code}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Branch</label>
                            <p className="mt-1">{member.bank_details.branch_name}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Bank details not updated</p>
                )}
            </div>
        </div>
    );
};