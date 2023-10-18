import { BarChart,Line,LineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/dashbord.css'
import { useEffect,useState } from 'react';
import { Button } from 'react-bootstrap';

import axios from 'axios';
import Sidebar from '../../components/Sidebar';

function Dashbord() {
    const [monthlyBookings, setMonthlyBookings] = useState([]);

      const [counts, setCounts] = useState({
        userCount: 'Loading...',
        ownerCount: 'Loading...',
        turfCount: 'Loading...',
        bookingCount: 'Loading...',
      });


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
      
      useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get('/admin/dashbord'); // Replace with your API endpoint
            const { userCount, ownerCount, turfCount, bookingCount } = response.data;
            setCounts({ userCount, ownerCount, turfCount, bookingCount });
          } catch (error) {
            console.error('Error fetching counts:', error);
          }
        }
    
        fetchData();
      }, []);


      const generatePDFReport = async () => {
        try {
          const response = await axios.get('/admin/generatePDFReport', { responseType: 'blob' }); // Specify responseType as 'blob' to handle binary data
          // Create a blob object from the binary data received
          const blob = new Blob([response.data], { type: 'application/pdf' });
    
          // Create a URL for the blob data
          const url = window.URL.createObjectURL(blob);
    
          // Create an anchor element for downloading the PDF
          const a = document.createElement('a');
          a.href = url;
          a.download = 'report.pdf'; // Set the filename for the download
          document.body.appendChild(a);
          a.click();
    
          // Clean up by revoking the object URL
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error generating PDF report:', error);
          // Handle the error
        }
      };







  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
        <Sidebar/>
    <main className="dmain-container">
        
        <div className="dmain-title">
            <h3>DASHBORD</h3>
        </div>
        <div className="dmain-card">
            <div className="dcard">
                 <div className="dcard-inner">
                     <h3>Users</h3>
                        <i className="fa-solid fa-users"></i>
                 </div>
                    <h1>{counts.userCount}</h1>
            </div> 
            <div  className="dcard">
                 <div className="dcard-inner">
                     <h3>Owners</h3>
                     <i  className="fa-solid fa-user-secret"></i>
                 </div>
                    <h1>{counts.ownerCount}</h1>
            </div>  
            <div className="dcard">
                 <div className="dcard-inner">
                     <h3>Turf</h3>
                     <i className="fa-solid fa-futbol"></i>
                 </div>
                    <h1>{counts.turfCount}</h1>
            </div> 
            <div className="dcard">
                 <div className="dcard-inner">
                     <h3>Booking</h3>
                     <i className="fa-regular fa-calendar-check"></i>
                 </div>
                    <h1>{counts.bookingCount}</h1>
            </div>        
        </div>
        <div className="chart">
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
            <Bar dataKey="count" name=" Bookings" fill="#124b7d" width={1} />
          </BarChart>
        </ResponsiveContainer>

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

      </div>
      <div style={{display:'flex',justifyContent:'end', marginTop:'2rem'}}>
      <Button  variant='primary' onClick={generatePDFReport}>Download</Button>
      </div>
      
    </main>
    
    </div>
  );
}

export default Dashbord;
