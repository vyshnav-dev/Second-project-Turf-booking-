import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import DataTable from 'react-data-table-component'; // Use DataTable for consistency
import '../../css/adhome.css'; // Use the same CSS file as AdminHome

const AdOwnerScreen = () => {
  const headerStyle = {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get(
          `/admin/adminowner?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.owners);
        setOwners(response.data.owners);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };

    fetchOwners();
  }, [currentPage, pageSize, searchQuery, setOwners, setTotalPages]);

  const blockOwner = async (ownerId) => {
    const result = await Swal.fire({
      title: 'Confirm Block Owner',
      text: 'Are you sure you want to block this owner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, block it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/blockowner?id=${ownerId}`);
        console.log('Blocked owner:', response.data.owners);
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner._id === ownerId ? { ...owner, isBlocked: true } : owner
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const unblockOwner = async (ownerId) => {
    const result = await Swal.fire({
      title: 'Confirm Unblock Owner',
      text: 'Are you sure you want to unblock this owner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unblock it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/unblockowner?id=${ownerId}`);
        console.log(response);
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner._id === ownerId ? { ...owner, isBlocked: false } : owner
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
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Option',
      cell: (row) =>
        !row.isBlocked ? (
          <Button variant="danger" onClick={() => blockOwner(row.id)}>
            Block
          </Button>
        ) : (
          <Button variant="success" onClick={() => unblockOwner(row.id)}>
            Unblock
          </Button>
        ),
    },
  ];

  return (
    <div className="admin-home-container">
      <Sidebar />
      <div className="admin-content">
        <h2 style={headerStyle}>Owner List</h2>
        <div style={{width:'40px'}} className="owsearch-bar">
          <input
            style={{ borderColor: 'black' }}
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <DataTable style={{ width: '100%' }} columns={columns} data={owners} pagination />
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

export default AdOwnerScreen;
