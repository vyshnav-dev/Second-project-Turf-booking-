import "../../css/ownerdashbord.css";
import { Suspense, lazy } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
function Owdashbord() {
  const { ownerInfo } = useSelector((state) => state.owner);

  const Owdashdiv = lazy(() => import("../../components/Owdashdiv"));

  const Owdashlinechart = lazy(() =>
    import("../../components/Owdashlinechart")
  );

  const Owdashbarchart = lazy(() => import("../../components/Owdashbarchart"));

  const generatePDFReport = async () => {
    try {
      // Replace 'ownerId' with the actual owner's ID
      const ownerId = ownerInfo._id;

      const response = await axios.get(
        `/owner/generate-pdf-report/${ownerId}`,
        {
          responseType: "blob", // To handle binary data (PDF)
        }
      );

      // Create a blob URL to trigger the file download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a link and simulate a click to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${ownerId}.pdf`;
      link.click();

      // Release the object URL when done
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      // Handle the error as needed
    }
  };

  return (
    <main className="omain-container">
      <div className="omain-title">
        <h3>DASHBORD</h3>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Owdashdiv />
      </Suspense>
      <div className="ochart">
        <Suspense fallback={<div>Loading...</div>}>
          <Owdashbarchart />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Owdashlinechart />
        </Suspense>
      </div>
      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}
      >
        <Button variant="primary" onClick={generatePDFReport}>
          Download
        </Button>
      </div>
    </main>
  );
}

export default Owdashbord;
