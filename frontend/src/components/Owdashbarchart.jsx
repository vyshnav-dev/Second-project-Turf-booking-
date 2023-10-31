import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/ownerdashbord.css'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Owdashbarchart = () => {
    const { ownerInfo } = useSelector((state) => state.owner);
    const Id = ownerInfo._id;

    const [monthlyBookings, setMonthlyBookings] = useState([]);

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get(`/owner/owner-monthlydata/${Id}`); // Replace with your API endpoint
            setMonthlyBookings(response.data);
          } catch (error) {
            console.error('Error fetching monthly bookings:', error);
          }
        }
    
        fetchData();
      }, [setMonthlyBookings]);
      
  return (
    <>
      <ResponsiveContainer width="50%" height="100%">
          <BarChart
            width={500 }
            height={200}
            data={monthlyBookings}
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
            <Bar dataKey="count" name=" Bookings" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
    </>
  );
}

export default Owdashbarchart;