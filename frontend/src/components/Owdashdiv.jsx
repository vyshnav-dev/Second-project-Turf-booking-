import '../css/ownerdashbord.css'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Owdashdiv = () => {

    const { ownerInfo } = useSelector((state) => state.owner);
    const Id = ownerInfo._id;

    const [counts, setCounts] = useState({
        userCount: 'Loading...',
        ownerCount: 'Loading...',
        turfCount: 'Loading...',
        bookingCount: 'Loading...',
      });

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
  return (
    <>
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
    </>
  );
}

export default Owdashdiv;