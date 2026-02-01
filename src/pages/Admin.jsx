import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { Check, X, Bell, Edit, Clock, MessageSquare, Mail, Phone, User, Calendar, FileText, Send, Plus, Trash2, Settings, MessageCircle } from 'lucide-react';

export default function Admin() {
    const { userRole, resetPassword } = useAuth();
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch applications
            const appsSnapshot = await getDocs(collection(db, 'applications'));
            const appsList = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(appsList.filter(a => a.status === 'pending'));

            // Fetch students
            const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
            const studentsSnapshot = await getDocs(studentsQuery);
            const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentsList);

            // Fetch all users (for admin management)
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function approveApplication(appId) {
        try {
            const app = applications.find(a => a.id === appId);

            // Create user document with student role
            await setDoc(doc(db, 'users', app.email), {
                email: app.email,
                displayName: app.name,
                phone: app.whatsapp,
                timezone: app.timezone,
                role: 'student',
                status: 'active',
                classCount: 0,
                nextClassTime: null,
                comments: app.description,
                notificationPrefs: {
                    email: true,
                    whatsapp: true
                },
                createdAt: Date.now(),
                approvedAt: Date.now()
            });

            // Update application status
            await updateDoc(doc(db, 'applications', appId), {
                status: 'approved',
                approvedAt: serverTimestamp()
            });

            showToast('Application approved! Student added to roster.', 'success');
            fetchData();
        } catch (error) {
            console.error('Error approving application:', error);
            showToast('Error approving application', 'error');
        }
    }

    async function updateStudent(studentId, updates) {
        try {
            await updateDoc(doc(db, 'users', studentId), updates);
            showToast('Student updated successfully', 'success');
            setSelectedStudent(null);
            fetchData();
        } catch (error) {
            console.error('Error updating student:', error);
            showToast('Error updating student', 'error');
        }
    }

    async function sendNotification(studentId, message, channels) {
        try {
            const student = students.find(s => s.id === studentId);
            
            // Create notification record in database
            await setDoc(doc(db, 'notifications', `${studentId}_${Date.now()}`), {
                studentId,
                studentEmail: student.email,
                studentPhone: student.phone,
                studentName: student.displayName,
                message,
                channels,
                sentAt: serverTimestamp(),
                status: 'sent'
            });

            // Log notification for email/WhatsApp integration
            console.log('Notification sent to:', {
                student: student.displayName,
                email: student.email,
                phone: student.phone,
                message,
                channels
            });

            showToast(`Notification sent to ${student.displayName}`, 'success');
            setShowNotificationModal(false);
        } catch (error) {
            console.error('Error sending notification:', error);
            showToast('Error sending notification', 'error');
        }
    }

    async function addStudent(studentData) {
        try {
            const studentId = studentData.email.replace(/[.@]/g, '_');
            await setDoc(doc(db, 'users', studentId), {
                ...studentData,
                email: studentData.email,
                displayName: studentData.displayName,
                phone: studentData.phone,
                role: 'student',
                status: 'active',
                classNumber: studentData.classNumber || 0,
                classCount: 0,
                nextClassTime: null,
                notificationPrefs: { 
                    email: studentData.emailNotifications || true, 
                    whatsapp: studentData.whatsappNotifications || true 
                },
                createdAt: Date.now()
            });
            showToast('Student added successfully!', 'success');
            setShowAddStudentModal(false);
            fetchData();
        } catch (error) {
            console.error('Error adding student:', error);
            showToast('Error adding student', 'error');
        }
    }

    async function addUser(userData) {
        try {
            const userId = userData.email.replace(/[.@]/g, '_');
            await setDoc(doc(db, 'users', userId), {
                email: userData.email,
                displayName: userData.displayName,
                phone: userData.phone,
                role: userData.role || 'user',
                status: 'active',
                createdAt: Date.now()
            });
            showToast(`${userData.role} added successfully!`, 'success');
            setShowAddUserModal(false);
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
            showToast('Error adding user', 'error');
        }
    }

    async function updateUser(userId, updates) {
        try {
            await updateDoc(doc(db, 'users', userId), updates);
            showToast('User updated successfully', 'success');
            setShowEditUserModal(false);
            setSelectedUser(null);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
            showToast('Error updating user', 'error');
        }
    }

    async function changeUserRole(userId, newRole, userName) {
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            showToast(`${userName} role changed to ${newRole}`, 'success');
            fetchData();
        } catch (error) {
            console.error('Error changing user role:', error);
            showToast('Error changing user role', 'error');
        }
    }

    async function deleteUser(userId, userName) {
        if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'users', userId));
            showToast('User deleted successfully', 'success');
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Error deleting user', 'error');
        }
    }

    async function sendPasswordResetEmail(userEmail, userName) {
        try {
            await resetPassword(userEmail);
            showToast(`Password reset email sent to ${userName}`, 'success');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            showToast('Error sending password reset email', 'error');
        }
    }

    function showToast(msg, type = 'info', duration = 3000) {
        setToast({ msg, type });
        setTimeout(() => setToast(null), duration);
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-20">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                    <p className="text-white font-bold">{toast.msg}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">ADMIN PORTAL</h1>
                        <div className="flex items-center gap-3">
                            <p className="text-gray-400">Manage applications, students, and notifications</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                userRole === 'admin' 
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                                {userRole === 'admin' ? '🔴 ADMIN' : '⚪ ' + (userRole || 'USER')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <TabButton
                        active={activeTab === 'applications'}
                        onClick={() => setActiveTab('applications')}
                        count={applications.length}
                    >
                        Applications
                    </TabButton>
                    <TabButton
                        active={activeTab === 'students'}
                        onClick={() => setActiveTab('students')}
                        count={students.length}
                    >
                        Students
                    </TabButton>
                    <TabButton
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        count={users.length}
                    >
                        Users & Admins
                    </TabButton>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                        {activeTab === 'applications' && (
                            <ApplicationsTab
                                applications={applications}
                                onApprove={approveApplication}
                            />
                        )}
                        {activeTab === 'students' && (
                            <StudentsTab
                                students={students}
                                onEdit={setSelectedStudent}
                                onAdd={() => setShowAddStudentModal(true)}
                                onDelete={deleteStudent}
                                onNotify={(student) => {
                                    setSelectedStudent(student);
                                    setShowNotificationModal(true);
                                }}
                            />
                        )}
                        {activeTab === 'users' && (
                            <UsersTab
                                users={users.filter(u => u.role !== 'student')}
                                onEdit={(user) => {
                                    setSelectedUser(user);
                                    setShowEditUserModal(true);
                                }}
                                onAdd={() => setShowAddUserModal(true)}
                                onDelete={deleteUser}
                                onChangeRole={changeUserRole}
                                onResetPassword={sendPasswordResetEmail}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Edit Student Modal */}
            {selectedStudent && !showNotificationModal && (
                <EditStudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onSave={updateStudent}
                />
            )}

            {/* Notification Modal */}
            {showNotificationModal && selectedStudent && (
                <NotificationModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowNotificationModal(false);
                        setSelectedStudent(null);
                    }}
                    onSend={sendNotification}
                />
            )}

            {/* Add Student Modal */}
            {showAddStudentModal && (
                <AddStudentModal
                    onClose={() => setShowAddStudentModal(false)}
                    onSave={addStudent}
                />
            )}

            {/* Add User Modal */}
            {showAddUserModal && (
                <AddUserModal
                    onClose={() => setShowAddUserModal(false)}
                    onSave={addUser}
                />
            )}

            {/* Edit User Modal */}
            {showEditUserModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowEditUserModal(false);
                        setSelectedUser(null);
                    }}
                    onSave={updateUser}
                />
            )}
        </div>
    );
}

function TabButton({ active, onClick, children, count }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl font-black uppercase text-sm tracking-widest transition-all ${active
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
        >
            {children} {count !== undefined && `(${count})`}
        </button>
    );
}

function ApplicationsTab({ applications, onApprove }) {
    if (applications.length === 0) {
        return (
            <div className="p-20 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase text-sm">No pending applications</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-white/5">
            {applications.map(app => (
                <div key={app.id} className="p-6 hover:bg-white/5 transition">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-xl font-black text-white">{app.name}</h3>
                                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-black text-amber-500 uppercase">
                                    Pending
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail size={16} className="text-amber-500" />
                                    {app.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Phone size={16} className="text-green-500" />
                                    {app.whatsapp}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock size={16} className="text-blue-500" />
                                    {app.timezone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} className="text-purple-500" />
                                    {new Date(app.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <p className="text-xs font-black text-amber-500 uppercase mb-2">Statement of Interest</p>
                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{app.description}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onApprove(app.id)}
                            className="shrink-0 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-black uppercase text-sm flex items-center gap-2 transition"
                        >
                            <Check size={20} />
                            Approve
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StudentsTab({ students, onEdit, onAdd, onDelete, onNotify }) {
    return (
        <div>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Student Roster</h3>
                <button
                    onClick={onAdd}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-black uppercase text-sm flex items-center gap-2 transition"
                >
                    <Plus size={20} />
                    Add Student
                </button>
            </div>

            {students.length === 0 ? (
                <div className="p-20 text-center">
                    <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase text-sm">No students yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Student</th>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Contact</th>
                                <th className="p-4 text-center text-xs font-black text-gray-400 uppercase">Class #</th>
                                <th className="p-4 text-center text-xs font-black text-gray-400 uppercase">Classes</th>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Next Class</th>
                                <th className="p-4 text-right text-xs font-black text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{student.displayName}</div>
                                        <div className="text-xs text-gray-500">{student.timezone || 'Not set'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-400">{student.email}</div>
                                        <div className="text-xs text-gray-500">{student.phone || 'No phone'}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-full font-black bg-purple-500/20 text-purple-300">
                                            {student.classNumber || 0}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full font-black ${student.classCount % 4 === 0 && student.classCount > 0
                                            ? 'bg-amber-500 text-black'
                                            : 'bg-white/10 text-white'
                                            }`}>
                                            {student.classCount || 0}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-400">
                                            {student.nextClassTime
                                                ? new Date(student.nextClassTime).toLocaleString()
                                                : 'Not scheduled'
                                            }
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(student)}
                                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                                                title="Edit Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onNotify(student)}
                                                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
                                                title="Send Notification"
                                            >
                                                <Bell size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(student.id, student.displayName)}
                                                className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                                                title="Delete Student"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function EditStudentModal({ student, onClose, onSave }) {
    const [formData, setFormData] = useState({
        displayName: student.displayName || '',
        phone: student.phone || '',
        classNumber: student.classNumber || 0,
        classCount: student.classCount || 0,
        nextClassTime: student.nextClassTime
            ? new Date(student.nextClassTime).toISOString().slice(0, 16)
            : '',
        comments: student.comments || ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        const updates = {
            ...formData,
            nextClassTime: formData.nextClassTime ? new Date(formData.nextClassTime).getTime() : null,
            classCount: parseInt(formData.classCount),
            classNumber: parseInt(formData.classNumber)
        };
        onSave(student.id, updates);
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">EDIT STUDENT</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Class Number</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.classNumber}
                                onChange={e => setFormData({ ...formData, classNumber: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="e.g., 101"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Class Count</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.classCount}
                                onChange={e => setFormData({ ...formData, classCount: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Next Class</label>
                            <input
                                type="datetime-local"
                                value={formData.nextClassTime}
                                onChange={e => setFormData({ ...formData, nextClassTime: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-amber-500 uppercase mb-2">Comments / Notes</label>
                        <textarea
                            value={formData.comments}
                            onChange={e => setFormData({ ...formData, comments: e.target.value })}
                            rows={4}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none resize-none"
                            placeholder="Add notes about this student..."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white transition font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-xl font-black uppercase transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NotificationModal({ student, onClose, onSend }) {
    const [message, setMessage] = useState('');
    const [channels, setChannels] = useState({ email: true, whatsapp: true });

    function handleSend() {
        if (message.trim() && (channels.email || channels.whatsapp)) {
            onSend(student.id, message, channels);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">SEND NOTIFICATION</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-400 mb-2">Sending to:</p>
                    <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                        <p className="font-bold text-white">{student.displayName}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Mail size={14} /> {student.email}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <MessageCircle size={14} /> {student.phone || 'No phone'}
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-black text-amber-500 uppercase mb-3">Send Via</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={channels.email}
                                onChange={e => setChannels({ ...channels, email: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Mail size={16} className="text-blue-400" />
                            <span className="text-white">Email</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={channels.whatsapp}
                                onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <MessageCircle size={16} className="text-green-400" />
                            <span className="text-white">WhatsApp</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-black text-amber-500 uppercase mb-2">Message</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={6}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none resize-none"
                        placeholder="Enter your message..."
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-400 hover:text-white transition font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || (!channels.email && !channels.whatsapp)}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black uppercase transition flex items-center gap-2"
                    >
                        <Send size={20} />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddStudentModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        classNumber: 0,
        emailNotifications: true,
        whatsappNotifications: true,
        timezone: 'UTC'
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.displayName && formData.email) {
            onSave(formData);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">ADD NEW STUDENT</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.displayName}
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Phone (WhatsApp)</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Class Number</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.classNumber}
                                onChange={e => setFormData({ ...formData, classNumber: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="e.g., 101"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-amber-500 uppercase mb-3">Notification Preferences</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications}
                                    onChange={e => setFormData({ ...formData, emailNotifications: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Mail size={16} className="text-blue-400" />
                                <span className="text-white">Send Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.whatsappNotifications}
                                    onChange={e => setFormData({ ...formData, whatsappNotifications: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <MessageCircle size={16} className="text-green-400" />
                                <span className="text-white">Send WhatsApp Notifications</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white transition font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-black uppercase transition flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UsersTab({ users, onEdit, onAdd, onDelete, onChangeRole, onResetPassword }) {
    return (
        <div>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Users & Admins</h3>
                <button
                    onClick={onAdd}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-black uppercase text-sm flex items-center gap-2 transition"
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            {users.length === 0 ? (
                <div className="p-20 text-center">
                    <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase text-sm">No users yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Name</th>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Email</th>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Phone</th>
                                <th className="p-4 text-left text-xs font-black text-gray-400 uppercase">Role</th>
                                <th className="p-4 text-right text-xs font-black text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{user.displayName || 'N/A'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-400">{user.phone || 'N/A'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full font-black text-xs uppercase ${
                                            user.role === 'admin' 
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        }`}>
                                            {user.role === 'admin' ? '🔴 Admin' : '⚪ User'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => onChangeRole(user.id, 'admin', user.displayName)}
                                                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                                                    title="Make Admin"
                                                >
                                                    <Settings size={16} />
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <button
                                                    onClick={() => onChangeRole(user.id, 'user', user.displayName)}
                                                    className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition"
                                                    title="Demote to User"
                                                >
                                                    <Settings size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onResetPassword(user.email, user.displayName)}
                                                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
                                                title="Send Reset Email"
                                            >
                                                <Mail size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                                                title="Edit User"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id, user.displayName)}
                                                className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function AddUserModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        role: 'user'
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.displayName && formData.email) {
            onSave(formData);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">ADD NEW USER</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.displayName}
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-amber-500 uppercase mb-2">Role *</label>
                            <select
                                required
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white transition font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-black uppercase transition flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditUserModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        phone: user.phone || '',
        role: user.role || 'user'
    });

    function handleSubmit(e) {
        e.preventDefault();
        onSave(user.id, formData);
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">EDIT USER</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-amber-500 uppercase mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-amber-500 uppercase mb-2">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-amber-500 uppercase mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white transition font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-xl font-black uppercase transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
