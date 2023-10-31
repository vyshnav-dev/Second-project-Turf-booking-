
import '../../css/dashbord.css'
import { Suspense,lazy} from 'react';
import { Button } from 'react-bootstrap';

import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const DashdivDetails = lazy(() => import('../../components/DashdivDetails'));

const Dashbarchart = lazy(() => import('../../components/Dashbarchart'));

const Dashlinechart = lazy(() => import('../../components/Dashlinechart'));

function Dashbord() {
    


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
    <div className='dashcover' style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
        <Sidebar/>
    <main className="dmain-container">
        
        <div className="dmain-title">
            <h3>DASHBORD</h3>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <DashdivDetails />
        </Suspense>
        <div className="chart">
        

        <Suspense fallback={<div>Loading...</div>}>
          <Dashbarchart/>
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <Dashlinechart />
        </Suspense>

        

      </div>
      <div style={{display:'flex',justifyContent:'end', marginTop:'2rem'}}>
      <Button  variant='primary' onClick={generatePDFReport}>Download</Button>
      </div>
      
    </main>
    
    </div>
  );
}

export default Dashbord;
