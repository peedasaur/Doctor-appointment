const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.bookAppointment = async (req, res) => {
    try {
        const { doctorName, specialty, date, timeSlot } = req.body;

        const newAppointment = new Appointment({
            patientId: req.user.id,
            patientName: req.user.name || 'Unknown',
            doctorName,
            specialty,
            date,
            timeSlot
        });

        const user = await User.findById(req.user.id);
        if (user) newAppointment.patientName = user.name;

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patientId: req.user.id }).sort({ date: -1 });
        } else if (req.user.role === 'doctor') {
            const doctor = await User.findById(req.user.id);
            if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

            appointments = await Appointment.find({ doctorName: doctor.name }).sort({ date: -1 });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied. Doctors only.' });
        }

        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const doctor = await User.findById(req.user.id);
        if (appointment.doctorName !== doctor.name) {
            return res.status(403).json({ message: 'Not authorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
