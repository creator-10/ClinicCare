import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { fetchAppointmentsByPatient } from "../../redux/slices/myappointmentSlice";
import { fetchAppointments } from "../../redux/slices/appointmentHistorySlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify"; // <-- added import
import "react-toastify/dist/ReactToastify.css"; // <-- import styles

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};


const parseSlotEndTime = (slot) => {
  if (!slot) return null;
  
  const parts = slot.toLowerCase().split("to").map(s => s.trim());
  if (parts.length !== 2) return null;

  const endTimeStr = parts[1]; 
  // Parse "4pm" to 24-hour hour number
  const match = endTimeStr.match(/(\d+)(am|pm)/);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const ampm = match[2];
  if (ampm === "pm" && hour !== 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;
  return hour;
};

const MyAppointment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const patientId = user?.patientId;

  const {
    upcoming = [],
    status: myAppointmentsStatus,
    error: myAppointmentsError,
  } = useSelector((state) => state.myappointments);

  const [localAppointments, setLocalAppointments] = useState([]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAppointments(patientId));
      dispatch(fetchAppointmentsByPatient(patientId));
    }
  }, [patientId, dispatch]);

  useEffect(() => {
    const now = dayjs();
    const today = dayjs().startOf("day");

  
    const futureAppointments = upcoming.filter((a) => {
      const bookingDate = dayjs(a.bookingDate).startOf("day");
      if (bookingDate.isAfter(today)) {
        return true;
      } else if (bookingDate.isSame(today)) {
      
        const endHour = parseSlotEndTime(a.slot);
        if (endHour === null) {
          
          return true;
        }
       
        const endDateTime = bookingDate.hour(endHour).minute(0).second(0);
        return now.isBefore(endDateTime);
      }
      return false;
    });
    setLocalAppointments(futureAppointments);
  }, [upcoming]);

  const handleCancel = async (appointmentId) => {
    if (!toast.success("Cancelled appointment?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/appointment/${appointmentId}`, {
        method: "DELETE",
      });

      if (res.status === 404) {
        toast.error("Appointment not found on server (404).");
        return;
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.message || "Failed to cancel appointment.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setLocalAppointments((prev) =>
          prev.filter((a) => a._id !== appointmentId)
        );
        toast.success("Appointment canceled successfully.");
      } else {
        toast.error(data.message || "Cancellation failed.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const generatePDF = async (a) => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "40px";
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.style.width = "800px";
    wrapper.style.background = "#fff";
    wrapper.style.color = "#000";

    const logoImg = new Image();
    logoImg.src = logo;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });

    const headerDiv = document.createElement("div");
    headerDiv.style.position = "relative";
    headerDiv.style.display = "flex";
    headerDiv.style.alignItems = "center";
    headerDiv.style.marginBottom = "20px";

    const logoTag = document.createElement("img");
    logoTag.src = logo;
    logoTag.style.position = "absolute";
    logoTag.style.left = "0";
    logoTag.style.width = "100px";
    logoTag.style.height = "100px";
    logoTag.style.borderRadius = "50%";
    logoTag.style.objectFit = "cover";

    const titleText = document.createElement("div");
    titleText.style.margin = "0 auto";
    titleText.style.textAlign = "center";
    titleText.innerHTML = `
      <div style="font-size: 40px; font-weight: bold;">MEDICO</div>
      <div style="font-size: 18px;">Heal. Thrive. Live.</div>
    `;

    headerDiv.appendChild(logoTag);
    headerDiv.appendChild(titleText);
    wrapper.appendChild(headerDiv);

    const addressDiv = document.createElement("div");
    addressDiv.style.textAlign = "center";
    addressDiv.style.fontSize = "16px";
    addressDiv.style.marginBottom = "20px";
    addressDiv.innerHTML = `
      MedicoHub Centre 12300, Thampanoor route,<br/>
      Chamber no.: 01, Trivandrum, Kerala-604503
    `;
    wrapper.appendChild(addressDiv);

    wrapper.appendChild(document.createElement("hr"));

    const fields = {
      "Appointment ID": a.appointmentId,
      Name: a.fullName,
      Email: a.email,
      Phone: a.phone,
      Gender: a.gender,
      Age: `${a.age ?? calculateAge(a.dob)} years old`,
      Specialist: a.specialist,
      "Clinic Name": a.clinic || "Unknown",
      "Doctor Name": a.doctorName,
      "Appointment Date": dayjs(a.bookingDate).format("DD MMM YYYY"),
      "Visit Time": a.slot || "N/A",
      ...(a.reason && { Reason: a.reason }),
    };

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.fontSize = "16px";
    table.style.marginTop = "30px";
    table.style.borderSpacing = "10px";

    Object.entries(fields).forEach(([label, value]) => {
      const row = document.createElement("tr");

      const labelCell = document.createElement("td");
      labelCell.textContent = `${label}:`;
      labelCell.style.fontWeight = "bold";
      labelCell.style.width = "160px";

      const valueCell = document.createElement("td");
      valueCell.textContent = value;

      row.appendChild(labelCell);
      row.appendChild(valueCell);
      table.appendChild(row);
    });

    wrapper.appendChild(table);

    const thankDiv = document.createElement("div");
    thankDiv.style.textAlign = "center";
    thankDiv.style.fontSize = "26px";
    thankDiv.style.marginTop = "40px";
    thankDiv.textContent = "Thank you";
    wrapper.appendChild(thankDiv);

    document.body.appendChild(wrapper);
    const canvas = await html2canvas(wrapper, { scale: 2 });
    document.body.removeChild(wrapper);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`appointment_${a.appointmentId}.pdf`);
  };

  if (myAppointmentsStatus === "loading") {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (myAppointmentsStatus === "failed") {
    return (
      <Typography color="error" align="center" mt={6}>
        {myAppointmentsError}
      </Typography>
    );
  }

  return (
    <Box p={3}>
      {/* Make sure to add <ToastContainer /> once at the app root for toast to work */}
      <Typography variant="h4" mb={3}>
        Upcoming Appointments
      </Typography>

      {localAppointments.length === 0 ? (
        <Typography>No upcoming appointments found.</Typography>
      ) : (
        <Stack spacing={3}>
          {localAppointments.map((a) => (
            <Card key={a._id}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={2}>
                  Appointment ID: <strong className="text-black">{a.appointmentId || "N/A"}</strong>
                </Typography>
                {[
                  ["Name", a.fullName],
                  ["Email", a.email],
                  ["Phone", a.phone],
                  ["Gender", a.gender],
                  ["Age", `${a.age ?? calculateAge(a.dob)} years old`],
                  ["Specialist", a.specialist],
                  ["Doctor Name", a.doctorName],
                  ["Clinic ", a.clinic],
                  ["Reason", a.reason || "—"],
                  ["Date", dayjs(a.bookingDate).format("DD MMM YYYY")],
                  ["Time Slot", a.slot || "N/A"],
                ].map(([label, value]) => (
                  <Box key={label} display="flex" gap={2} mb={1}>
                    <Typography sx={{ minWidth: "120px", fontWeight: "bold" }}>
                      {label}:
                    </Typography>
                    <Typography>{value}</Typography>
                  </Box>
                ))}
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancel(a._id)}
                  >
                    Cancel Appointment
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generatePDF(a)}
                  >
                    Download Copy
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyAppointment;
