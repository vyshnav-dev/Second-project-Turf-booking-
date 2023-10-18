import { FaUserAlt ,FaRegCalendarCheck,FaCampground,FaTh} from 'react-icons/fa'

import { NavLink } from 'react-router-dom'
import '../App.css'



// eslint-disable-next-line react/prop-types
const Sidebar = ({children}) => {

    const menuItem = [
      {
        path:'/admin/dashbord',
        name:'Dashbord',
        icon:<FaTh/>
      },
      {
        path:'/admin/user',
        name:'Users',
        icon:<FaUserAlt/>
      },
      {
        path:'/admin/owner',
        name:'Owners',
        icon: <FaUserAlt/>
      },
      {
        path:'/admin/turf',
        name:'Turf',
        icon:<FaCampground/>
      },
      {
        path:'/admin/booking',
        name: 'Bookings',
        icon: <FaRegCalendarCheck/>
      }
]
  return (
  <div className='container1'>
    <div  className='sidebar'>
        <div className="top_section">
            {/* <h1  className='logo'>ADMIN</h1> */}
            
        </div>
        {
            menuItem.map((item, index)=>(
                <NavLink to={item.path} key={index} className='link' activeclassName='active' >
                    <div className="icon">{item.icon}</div>
                    <div className="link_text">{item.name}</div>
                </NavLink>
            ))
        }
    </div>
    <main>{children}</main>
  </div>
  )
}

export default Sidebar