import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/appointments', {
                headers: { 'x-auth-token': token }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/appointments/${id}`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchAppointments();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Doctor Portal</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, Dr. {user.name} <span className="text-blue-600 font-bold ml-1">({user.specialty || 'General'})</span></p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm h-full">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Status</span>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Clinical Hub</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Appointment Requests</h2>
                        <p className="text-slate-500 text-sm font-medium mt-0.5">Manage your patient schedule and updates</p>
                    </div>
                    <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg">
                        {appointments.length} Total Patients
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Specialty</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.map((appt) => (
                                <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                {appt.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-base font-bold text-slate-900 leading-tight">{appt.patientName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">#{appt._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="text-sm font-medium text-slate-600">
                                            {appt.specialty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 text-sm">{appt.date}</span>
                                            <span className="text-blue-600 text-xs font-bold">{appt.timeSlot}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                                            ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : ''}
                                            ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
                                            ${appt.status === 'rejected' ? 'bg-red-50 text-red-700' : ''}
                                        `}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm">
                                        {appt.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                    className="bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-medium italic">Handled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {appointments.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 font-medium">No pending appointment requests.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
