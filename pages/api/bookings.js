

let bookings = []; 

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      // Return the list of bookings
      return res.status(200).json({ bookings });

    case "POST":
      // Create a new booking
      const { date, time, guests, name, contact } = req.body;
      if (!date || !time || !guests || !name || !contact) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }

      // Add the new booking to the list
      const newBooking = { date, time, guests, name, contact };
      bookings.push(newBooking);
      return res.status(201).json({ message: "Booking created", booking: newBooking });

    default:
      // Handle other HTTP methods
      return res.status(405).json({ message: "Method not allowed" });
  }
}
