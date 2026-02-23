import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        doctorName: '',
        specialty: 'General',
        date: '',
        timeSlot: ''
    });
    const [message, setMessage] = useState('');
    const [doctors, setDoctors] = useState([]);

    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/api/auth/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error('Failed to fetch doctors', err);
        }
    };

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

    const handleBook = async (e) => {
        e.preventDefault();
        if (!formData.timeSlot) {
            setMessage('Please select a time slot.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/appointments', formData, {
                headers: { 'x-auth-token': token }
            });
            setMessage('Appointment booked successfully!');
            fetchAppointments();
            setFormData({ doctorName: '', specialty: 'General', date: '', timeSlot: '' });
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            setMessage('Failed to book appointment.');
            console.error(err);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">CarePulse Portal</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, {user?.name}. Your health, simplified.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm h-full">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Status</span>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Active Portal</span>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border text-center font-bold ${message.includes('success') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-4">
                    <div className="glass-card rounded-2xl p-8 bg-white border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                            Book Appointment
                        </h2>

                        <form onSubmit={handleBook} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Specialty</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 appearance-none font-medium text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Specialty</option>
                                        <option value="General">General Physician</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Dermatology">Dermatology</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Specialist</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 appearance-none font-medium text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                                        value={formData.doctorName}
                                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose a Doctor</option>
                                        {doctors.map((doc) => (
                                            <option key={doc._id} value={doc.name}>
                                                {doc.name} • {doc.specialty || 'General'}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Appointment Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Select Time Slot</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, timeSlot: slot })}
                                            className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${formData.timeSlot === slot
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all mt-6 text-sm active:scale-[0.98]"
                            >
                                Confirm Appointment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Appointment History
                    </h2>

                    {appointments.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center">
                            <p className="text-slate-500 font-medium">No recorded appointments yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map((appt) => (
                                <div key={appt._id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <span className="text-2xl">🩺</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{appt.doctorName}</h3>
                                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium mt-1">
                                                <span>{appt.specialty}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    {appt.date} • {appt.timeSlot}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                                        ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : ''}
                                        ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
                                        ${appt.status === 'rejected' ? 'bg-red-50 text-red-700' : ''}
                                    `}>
                                        {appt.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
