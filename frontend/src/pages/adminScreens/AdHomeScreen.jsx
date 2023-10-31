import  { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import DataTable from 'react-data-table-component';
import '../../css/adhome.css'

const AdminHome = () => {
  const headerStyle = {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `/admin/user?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.users);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, searchQuery, setUsers, setTotalPages]);

  const blockUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Confirm Block User',
      text: 'Are you sure you want to block this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, block it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/blockuser?id=${userId}`);
        console.log('Blocked user:', response.data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: true } : user
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const unblockUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Confirm Unblock User',
      text: 'Are you sure you want to unblock this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unblock it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/unblockuser?id=${userId}`);
        console.log('Unblocked user:', response.data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: false } : user
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      name: '#',
      cell: (row, index) => {
        return index + 1; // Display the row count number
      },
    },
    {
      name: 'Name',
      selector: 'name', // Replace with your actual property name for the user's name
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'email', // Replace with your actual property name for the user's email
      sortable: true,
    },
    {
      name: 'Option',
      cell: (row) => {
        return !row.isBlocked ? (
          <Button variant="danger" onClick={() => blockUser(row.id)}>
            Block
          </Button>
        ) : (
          <Button variant="success" onClick={() => unblockUser(row.id)}>
            Unblock
          </Button>
        );
      },
    },
  ];

  return (
    <div className="admin-home-container">
      <Sidebar />
      <div className="admin-content">
        <h2 style={headerStyle}>User List</h2>
        <div style={{width:'40px'}} className="adsearch-bar">
          <input
            style={{ borderColor: 'black' }}
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <DataTable style={{ width: '100%' }} columns={columns} data={users} pagination />
        <div className="pagination">
          <Button
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div style={{ margin: '0 1rem' }}>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
