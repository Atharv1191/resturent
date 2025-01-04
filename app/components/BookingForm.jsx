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
        .catch(() => toast.error("Error fetching available slots"));
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
      await axios.post("/api/bookings", {
        date,
        time,
        guests,
        name,
        contact,
      });
      toast.success(`Booking confirmed for ${name} on ${date} at ${time}`);
      // Clear the form fields after successful submission
      setDate('');
      setTime('');
      setGuests(1);
      setName('');
      setContact('');
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-white to-gray-100 rounded-xl shadow-lg mt-10">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Book Your Table
      </h2>

      {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="date" className="block text-lg font-semibold text-gray-800 mb-2">Select Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-lg font-semibold text-gray-800 mb-2">Select Time</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={!date || availableSlots.length === 0}
          >
            <option value="">Choose a time</option>
            {availableSlots.map((slot, idx) => (
              <option key={idx} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="guests" className="block text-lg font-semibold text-gray-800 mb-2">Number of Guests</label>
            <input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-lg font-semibold text-gray-800 mb-2">Contact Info</label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">Your Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
