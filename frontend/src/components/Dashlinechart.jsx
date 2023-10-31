import axios from 'axios';
import { useEffect,useState } from 'react';
import '../css/dashbord.css'
import { Line,LineChart,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashlinechart = () => {

    const [monthlyBookings, setMonthlyBookings] = useState([]);


    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get('/admin/fetchMonthlyBookings'); // Replace with your API endpoint
            setMonthlyBookings(response.data);
          } catch (error) {
            console.error('Error fetching monthly bookings:', error);
          }
        }
    
        fetchData();
      }, []);
  return (
    <>
      <ResponsiveContainer width="50%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={monthlyBookings} // Use monthly bookings data here
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="_id.month"
              tickFormatter={(month) => {
                const monthNames = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ];
                return monthNames[month - 1];
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
    </>
  );
}

export default Dashlinechart;