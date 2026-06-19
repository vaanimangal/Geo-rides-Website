import "../styles/BookingForm.css";

// Helper function to get the absolute current local time string
const getLocalDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function BookingForm({ trip, setTrip }) {
  // Get the fresh time boundary on every single keystroke/change
  const currentLocalDateTime = getLocalDateTime();

  // 🚀 COLD HARD GUARD FOR TRIP START
  const handleStartDateTimeChange = (newStart) => {
    // If they manually type or scroll to a time before the absolute current time, block it!
    if (newStart < currentLocalDateTime) {
      setTrip({ ...trip, startDateTime: currentLocalDateTime });
      return;
    }

    let updatedTrip = { ...trip, startDateTime: newStart };

    // If the new start time jumps ahead of the existing end time, reset the end time
    if (trip?.endDateTime && newStart >= trip.endDateTime) {
      updatedTrip.endDateTime = ""; 
    }

    setTrip(updatedTrip);
  };

  // 🚀 COLD HARD GUARD FOR TRIP END
  const handleEndDateTimeChange = (newEnd) => {
    const minAllowedEnd = trip?.startDateTime ? trip.startDateTime : currentLocalDateTime;

    // If they try to type/scroll to an end time earlier than allowed, force it back
    if (newEnd < minAllowedEnd) {
      setTrip({ ...trip, endDateTime: minAllowedEnd });
      return;
    }
    
    setTrip({ ...trip, endDateTime: newEnd });
  };

  return (
    <div className="booking-form">
      {/* Pickup Location */}
      <div className="input-group">
        <label>Pickup Location</label>
        <input
          type="text"
          placeholder="Enter pickup location"
          value={trip.pickup || ""}
          onChange={(e) => setTrip({ ...trip, pickup: e.target.value })}
        />
      </div>

      {/* Destination Location */}
      <div className="input-group">
        <label>Destination Location</label>
        <input
          type="text"
          placeholder="Enter destination location"
          value={trip.destination || ""}
          onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
        />
      </div>

      {/* Trip Start */}
      <div className="input-group">
        <label>Trip Start</label>
        <input
          type="datetime-local"
          value={trip.startDateTime || ""}
          min={currentLocalDateTime} 
          onChange={(e) => handleStartDateTimeChange(e.target.value)}
        />
      </div>

      {/* Trip End */}
      <div className="input-group">
        <label>Trip End</label>
        <input
          type="datetime-local"
          value={trip.endDateTime || ""}
          min={trip.startDateTime ? trip.startDateTime : currentLocalDateTime}
          onChange={(e) => handleEndDateTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default BookingForm;