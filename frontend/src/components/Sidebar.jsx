import '../css/sidebar.css'
const Sidebar = () => {
  return (
    

<div className="s-layout__sidebar">
  <a className="s-sidebar__trigger" href="#0">
     <i className="fa fa-bars"></i>
  </a>

  <nav className="s-sidebar__nav">
     <ul>
        <li>
           <a className="s-sidebar__nav-link" href="/admin/dashbord">
              <i className="fa fa-home"></i><em>Dashbord</em>
           </a>
        </li>
        <li>
           <a className="s-sidebar__nav-link" href="/admin/user">
             <i className="fa fa-user"></i><em>User</em>
           </a>
        </li>
        <li>
           <a className="s-sidebar__nav-link" href="/admin/owner">
              <i className="fa fa-user-secret"></i><em>Owner</em>
           </a>
        </li>
        <li>
           <a className="s-sidebar__nav-link" href="/admin/turf">
              <i className="fa fa-building"></i><em>Turf</em>
           </a>
        </li>
        <li>
           <a className="s-sidebar__nav-link" href="/admin/booking">
              <i className="fa fa-calendar"></i><em>Bookings</em>
           </a>
        </li>
     </ul>
  </nav>
</div>



  );
}

export default Sidebar;