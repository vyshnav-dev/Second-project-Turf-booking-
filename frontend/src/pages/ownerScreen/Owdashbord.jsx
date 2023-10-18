import { BarChart,Line,LineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/ownerdashbord.css'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
function Owdashbord() {

    const { ownerInfo } = useSelector((state) => state.owner);
    const Id = ownerInfo._id;

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
            const response = await axios.get(`/owner/owner-monthlydata/${Id}`); // Replace with your API endpoint
            setMonthlyBookings(response.data);
          } catch (error) {
            console.error('Error fetching monthly bookings:', error);
          }
        }
    
        fetchData();
      }, [setMonthlyBookings]);
      
      useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get(`/owner/owner-dashbord/${Id}`); // Replace with your API endpoint
            const { userCount, turfCount, bookingCount } = response.data;
            setCounts({ userCount,turfCount, bookingCount });
          } catch (error) {
            console.error('Error fetching counts:', error);
          }
        }
    
        fetchData();
      }, [setCounts]);


      const generatePDFReport = async () => {
        try {
          // Replace 'ownerId' with the actual owner's ID
          const ownerId = ownerInfo._id;
      
          const response = await axios.get(`/owner/generate-pdf-report/${ownerId}`, {
            responseType: 'blob', // To handle binary data (PDF)
          });
      
          // Create a blob URL to trigger the file download
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
      
          // Create a link and simulate a click to trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.download = `report_${ownerId}.pdf`;
          link.click();
      
          // Release the object URL when done
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error generating PDF report:', error);
          // Handle the error as needed
        }
      };

  return (
    
        
    <main className="omain-container">
        
        <div className="omain-title">
            <h3>DASHBORD</h3>
        </div>
        <div className="omain-card">
            <div className="ocard">
                 <div className="ocard-inner">
                     <h3>Users</h3>
                        <i className="fa-solid fa-users"></i>
                 </div>
                    <h1>{counts.userCount}</h1>
            </div>  
            <div className="ocard">
                 <div className="ocard-inner">
                     <h3>Turf</h3>
                     <i className="fa-solid fa-futbol"></i>
                 </div>
                    <h1>{counts.turfCount}</h1>
            </div> 
            <div className="ocard">
                 <div className="ocard-inner">
                     <h3>Booking</h3>
                     <i className="fa-regular fa-calendar-check"></i>
                 </div>
                    <h1>{counts.bookingCount}</h1>
            </div>        
        </div>
        <div className="ochart">
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
    
  );
}

export default Owdashbord;
