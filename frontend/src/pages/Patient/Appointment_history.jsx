import React, { useEffect, useState, useRef } from "react";
import {
  Card, CardContent, Typography, Stack,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell,
  TableHead, TableRow, Divider
} from "@mui/material";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const calculateAge = dob => {
  if (!dob) return "N/A";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const Appointment_history = () => {
  const { patientId } = useSelector(s => s.auth.user || {});
  const token = useSelector(s => s.auth.token || "");
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const prescriptionRef = useRef(null);

 useEffect(() => {
  if (!patientId || !token) return;

  axios
    .get(
      `${import.meta.env.VITE_BACKEND_URL}/api/appointment/patient/${patientId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
  if (res.data.success) {
    const now = dayjs();
    dayjs.extend(customParseFormat);
    const past = res.data.data.filter(a => {
      const bookingDate = dayjs(a.bookingDate);
      const isBeforeToday = bookingDate.isBefore(now, 'day');

      const endTimeRaw = a.slot?.split(" - ")[1];  // e.g., "4pm"
      const endTime = endTimeRaw
        ? dayjs(`${a.bookingDate.split("T")[0]} ${endTimeRaw}`, "YYYY-MM-DD hA")
        : null;

      const isSameDayAndEnded = bookingDate.isSame(now, 'day') && endTime && endTime.isBefore(now);

      return isBeforeToday || isSameDayAndEnded;
    });

    setAppointments(past); 
  }
})

    .catch((err) => {
      console.error(err);
      toast.error("Failed to load appointments. Please try again.");
    });
}, [patientId, token]);


  const handleViewPrescription = async appt => {
    if (!token) {
      toast.error("No valid token, please log in again.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visit/appointment/${appt.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const vis = res.data.data;

      setPrescription({
        ...appt,
        medications: vis.medications || [],
        advice: vis.advice || "",
        patientDOB: appt.dob,
        doctorName: vis.doctor || "Unknown Doctor",
        patientName: appt.patientName || "Patient",
        bookingDate: appt.bookingDate
      });
      setOpen(true);
    } catch (e) {
      console.error("View Prescription Error:", e);
      toast.error(" Prescription is pending");
    }
  };

  const handleDeleteAppointment = (appointmentIdToDelete) => {
    // Optional: send DELETE request to backend here if needed
    setAppointments(prev => prev.filter(a => a.appointmentId !== appointmentIdToDelete));
    toast.success("Appointment deleted successfully.");
  };

  const downloadPDF = async () => {
    if (!prescriptionRef.current) return;
    try {
      const canvas = await html2canvas(prescriptionRef.current);
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`prescription_${prescription.appointmentId}.pdf`);
      toast.success("PDF downloaded successfully.");
    } catch (error) {

      toast.error("Failed to download PDF.",error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="flex-1 p-6">
        <Typography variant="h4">Appointment History</Typography>
        {!appointments.length ? (
          <Typography>No past appointments.</Typography>
        ) : (
          <Stack spacing={3} mt={2}>
            {appointments.map(a => (
              <Card key={a._id}>
                <CardContent>
                  <Typography variant="h6" className="text-primary">
                    Appointment ID: {a.appointmentId}
                  </Typography>
                  <Typography className="text-sm">Doctor: {a.doctorName}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                   {dayjs(a.bookingDate).format("DD MMM YYYY")} | {a.slot}

                  </Typography>

                  <Stack direction="row" spacing={2} mt={2}>
                    <Button variant="contained" onClick={() => handleViewPrescription(a)}>
                      View Prescription
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteAppointment(a.appointmentId)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Prescription Details</DialogTitle>
          <DialogContent dividers>
            {prescription ? (
              <div ref={prescriptionRef} className="p-4">
                <img src={logo} alt="Logo" className="mx-auto mb-4 rounded-full w-20 h-20" />
                <Typography><strong>Patient Name:</strong> {prescription.fullName}</Typography>
                <Typography><strong>Age:</strong> {calculateAge(prescription.patientDOB)} years old</Typography>
                <Typography><strong>Checkup Date:</strong> {dayjs(prescription.bookingDate).format("DD MMM YYYY")}</Typography>
                <Typography><strong>Consulted Doctor:</strong> {prescription.doctorName}</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Medications</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!prescription.medications.length ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No medications listed.</TableCell>
                      </TableRow>
                    ) : (
                      prescription.medications.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>{m.name}</TableCell>
                          <TableCell>{m.dosage}</TableCell>
                          <TableCell>{m.duration}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {!!prescription.advice && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Notes</Typography>
                    <Typography>{prescription.advice}</Typography>
                  </>
                )}
              </div>
            ) : (
              <Typography>No prescription details available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
            {prescription && (
              <Button variant="contained" color="primary" onClick={downloadPDF}>
                Download PDF
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default Appointment_history;
