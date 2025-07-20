import Appointment from '../models/appointmentModel.js';
import VisitRecord from '../models/visitModel.js';

// Pie chart: Visits per specialization
export const getVisitsPerSpecialization = async (req, res) => {
  try {
    const data = await VisitRecord.aggregate([
      {
        $lookup: {
          from: "doctors", // This must match the collection name in MongoDB
          localField: "doctor",      // email in VisitRecord
          foreignField: "email",     // email in doctorModel
          as: "doctorInfo"
        }
      },
      { $unwind: "$doctorInfo" },
      {
        $group: {
          _id: "$doctorInfo.specialization",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Line chart: Appointments per day
export const getAppointmentsPerDay = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
