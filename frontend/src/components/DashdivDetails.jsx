import { useEffect,useState } from 'react';
import axios from 'axios';
import '../css/dashbord.css'
const DashdivDetails = () => {

    const [counts, setCounts] = useState({
        userCount: 'Loading...',
        ownerCount: 'Loading...',
        turfCount: 'Loading...',
        bookingCount: 'Loading...',
      });



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
  return (
    <>
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
    </>
  );
}

export default DashdivDetails;