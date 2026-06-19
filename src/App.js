import { useState } from "react"; // 👈 1. Import useState
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import BookingForm from "./Components/BookingForm";
import DestinationCards from "./Components/DestinationCards";

function App() {
  // 👈 2. Create the state for your booking form here
  const [tripData, setTripData] = useState({
    pickup: "",
    destination: "",
    startDateTime: "",
    endDateTime: "",
  });

  return (
    <>
      <Navbar />
      <Hero />
      {/* 👈 3. Pass tripData and setTripData as props right here */}
      <BookingForm trip={tripData} setTrip={setTripData} />
      <DestinationCards />
    </>
  );
}

export default App;