'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState('');

  // Fetch available time slots for the selected date
  useEffect(() => {
    if (date) {
      axios
        .get('/api/bookings')
        .then((response) => {
          const bookedTimes = response.data.bookings
            .filter((booking) => booking.date === date)
            .map((booking) => booking.time);

          const slots = [
            '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
            '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
          ];

          setAvailableSlots(slots.filter((slot) => !bookedTimes.includes(slot)));
        })
        .catch((err) => toast.error("Error fetching available slots"));
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time || !name || !contact) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/bookings", {
        date,
        time,
        guests,
        name,
        contact,
      });

      toast.success(`Booking confirmed for ${name} on ${date} at ${time}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Table Booking Form</h2>
      
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Time</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!date || availableSlots.length === 0}
          >
            <option value="">Select Time</option>
            {availableSlots.map((slot, idx) => (
              <option key={idx} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">Number of Guests</label>
          <input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact Info</label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Book Table
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
