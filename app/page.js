
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import BookingForm from './components/BookingForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-gray-900 my-8">Restaurant Table Booking</h1>
      
      {/* ToastContainer to show toasts */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick />
      
      <BookingForm />
    </div>
  );
}
