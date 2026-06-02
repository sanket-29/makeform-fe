"use client";

import { Download } from "lucide-react";

interface PermitData {
  ownerName?: string;
  workType?: string;
  address?: string;
  zoning?: string;
  map?: string;
  block?: string;
  lot?: string;
  useGroup?: string;
  constructionType?: string;
  constructionCost?: string;
  licConstSup?: string;
  homeImpContractor?: string;
  buildingLength?: string;
  buildingWidth?: string;
  buildingHeight?: string;
  remarks?: string;
  permitNo?: string;
  dateIssued?: string;
  fee?: string;
  signature?: string;
  formType?: string;
}

export default function PermitPrint({
  data,
  isPermitIssued,
}: {
  data?: PermitData;
  isPermitIssued: boolean;
}) {
  const permitData = {
    ownerName: data?.ownerName || "CODY, BRIAN ERIC & BRUCE &",
    workType: data?.workType || "qqq",
    address: data?.address || "16 ABBOTSFORD RD",
    zoning: data?.zoning || "R5",
    map: data?.map || "30",
    block: data?.block || "0",
    lot: data?.lot || "52",
    useGroup: data?.useGroup || "R-3",
    constructionType: data?.constructionType || "Type III-B",
    constructionCost: data?.constructionCost || "$675000.00",
    licConstSup: data?.licConstSup || "",
    homeImpContractor: data?.homeImpContractor || "",
    buildingLength: data?.buildingLength || "300",
    buildingWidth: data?.buildingWidth || "300",
    buildingHeight: data?.buildingHeight || "30",
    remarks: data?.remarks || "",
    permitNo: data?.permitNo || "R-25-0002",
    dateIssued: data?.dateIssued || "10/07/25",
    fee: data?.fee || "$200.00",
    signature: data?.signature || "Schneider",
    formType: data?.formType || "",
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to view the permit");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Building Permit - ${permitData.permitNo}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          @page { size: letter portrait; margin: 0.4in; }
          @media print { body { background: #fff; } .download-btn { display: none; } }
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.3; background: #f5f5f5; color: #000; }
          .download-btn { position: fixed; top: 18px; right: 18px; background: #0f4c81; color: #fff; border: none; padding: 8px 12px; border-radius: 3px; font-size: 10px; cursor: pointer; z-index: 10; }
          
          .page { width: 7.5in; height: 10in; margin: 20px auto; background: #fff; border: 2px solid #000; display: grid; grid-template-columns: 45% 55%; grid-template-rows: auto 1fr; }
          
          .top-meta { grid-column: 1 / -1; display: grid; grid-template-columns: 45% 55%; align-items: center; font-size: 12px; padding: 4px 8px; border-bottom: 1px solid #000; margin: 0; }
          .top-meta span:last-child { justify-self: center; }
          
          .content-wrapper { display: contents; }
          
          .left-panel { border-right: 1px solid #000; padding: 10px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
          .right-panel { padding: 14px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; font-size: 13px; }
          
          .section-title { font-weight: bold; font-size: 14px; text-align: center; margin: 6px 0 3px 0; padding: 3px 0; border-bottom: 2px solid #000; padding-bottom: 3px; }
          
          .table { width: 100%; border-collapse: collapse; margin: 0; font-size: 16px; background: #fff; }
          .table thead { }
          .table th { background: #fff; border: 1px solid #000; padding: 8px 6px; font-weight: bold; text-align: center; font-size: 13px; }
          .table tbody tr td { border: 1px solid #000; padding: 8px 8px; text-align: left; min-height: 30px; font-size: 14px; }
          
          .remarks-section { margin: 6px 0; padding: 6px; font-size: 11px; line-height: 1.4; background: #f9f9f9; }
          .left-remarks { margin-top: 8px; padding-top: 6px; border-top: 1px solid #000; font-size: 9px; line-height: 1.3; }
          
          .logo-section { display: flex; justify-content: center; align-items: center; gap: 14px; margin-bottom: 8px; padding-bottom: 8px; }
          .logo-img { width: 100px; height: auto; border-radius: 50%; border: 2px solid #000; object-fit: contain; background: #fff; flex-shrink: 0; }
          .dept-info { font-size: 15px; line-height: 1.3; font-weight: bold; margin: 0; text-align: center; }
          
          .title-section { text-align: center; padding: 4px; margin: 3px 0; background: #f9f9f9; }
          .title-section h1 { font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0; padding: 0; line-height: 1; }
          .title-section p { font-size: 9px; margin: 2px 0 0 0; line-height: 1; }
          
          .detail-row { display: flex; gap: 8px; margin: 3px 0; font-size: 11px; align-items: center; flex-wrap: wrap; }
          .detail-label { font-weight: bold; white-space: nowrap; min-width: auto; }
          .detail-value { color: #8b0000; font-weight: bold; }
          .detail-small { font-size: 11px; font-style: italic; margin: 2px 0 6px 200px; text-align: left; width: auto; }
          .size-label { color: #000; font-weight: normal; margin: 0 3px; }
          .size-value { color: #8b0000; font-weight: bold; display: inline-block; }
          .size-item { display: inline-flex; margin-right: 52px; align-items: center; }
          
          .grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 3px 0; font-size: 11px; }
          .grid-row-zoning { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin: 3px 0; font-size: 11px; }
          .grid-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 3px 0; font-size: 11px; }
          
          .disclaimer-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 3px 0; font-size: 11px; line-height: 1.3; }
          .disclaimer-text { text-align: justify; margin: 0; }
          
          .bottom-box { border: 2px solid #000; padding: 10px; margin-top: 8px; }
          
          .bottom-row { display: grid; grid-template-columns: 2fr; gap: 10px; margin: 8px 0 0 0; font-size: 11px; padding-top: 3px; }
          .bottom-row > div:first-child { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .bottom-value-large { font-size: 12px; }
          
          .signature-section { text-align: right; margin: 3px 20px 0 0; padding-top: 3px; font-size: 11px; }
          
          .footer-text { text-align: center; font-size: 9px; font-weight: bold; margin-top: 8px; }
        </style>
      </head>
      <body>
        <button class="download-btn" onclick="downloadPDF()">Download PDF</button>
        <div class="page" id="permit-content">
          <div class="top-meta">
            <span>${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'})}</span>
            <span>Application Form</span>
          </div>

          <div class="left-panel">
            <div class="section-title">INSPECTION RECORD</div>
            <table class="table">
              <thead>
                <tr><th>INSPECTION</th><th>BY</th><th>DATE</th></tr>
              </thead>
              <tbody>
                <tr><td>Excavation</td><td></td><td></td></tr>
                <tr><td>Foundation</td><td></td><td></td></tr>
                <tr><td>Rough Frame</td><td></td><td></td></tr>
                <tr><td>Insulation</td><td></td><td></td></tr>
                <tr><td>Final</td><td></td><td></td></tr>
                <tr><td>Electrical Rough</td><td></td><td></td></tr>
                <tr><td>Electrical Final</td><td></td><td></td></tr>
                <tr><td>Plumbing Rough</td><td></td><td></td></tr>
                <tr><td>Plumbing Final</td><td></td><td></td></tr>
                <tr><td>Gas Rough</td><td></td><td></td></tr>
                <tr><td>Gas Final</td><td></td><td></td></tr>
              </tbody>
              <tr><td colspan="3">Remarks : ${permitData.remarks}</td></tr>
            </table>
            <div class="section-title">FINAL APPROVALS</div>
            <table class="table">
              <tbody>
                <tr><td>Fire</td><td></td><td></td></tr>
                <tr><td>Health</td><td></td><td></td></tr>
                <tr><td>Water & Sewer</td><td></td><td></td></tr>
                <tr><td>Planning & Conservation</td><td></td><td></td></tr>
                <tr><td>Other</td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>

          <div class="right-panel">
            <div class="logo-section">
              <img src="/images/town_seal.png" alt="Logo" class="logo-img">
              <div class="dept-info">
                Anytown Building Department<br>
                17 Main Street<br>
                Anytown, MA 12345<br>
                (111) 111-1111
              </div>
            </div>
            

            <div class="title-section">
              <h1>${permitData.formType ? permitData.formType.toUpperCase() + " PERMIT" : "PERMIT"}</h1>
            </div>

            <div class="detail-row"><div class="detail-label">Is issued to :</div><div class="detail-value">${permitData.ownerName}</div></div>
            <div class="detail-small">(Owner)</div>
            <div class="detail-row"><div class="detail-label">to</div><div class="detail-value">${permitData.workType}</div></div>
            <div class="detail-small">(build, alter, demolish)</div>
            <div class="detail-row"><div class="detail-label">at</div><div class="detail-value">${permitData.address}</div></div>

            <div class="grid-row-zoning">
              <div><strong>Zoning :</strong> <span class="detail-value">${permitData.zoning}</span></div>
              <div><strong>Map :</strong> <span class="detail-value">${permitData.map}</span></div>
              <div><strong>Block :</strong> <span class="detail-value">${permitData.block}</span></div>
              <div><strong>Lot :</strong> <span class="detail-value">${permitData.lot}</span></div>
            </div>

            <div class="grid-row-2">
              <div><strong>Use Group :</strong> <span class="detail-value">${permitData.useGroup}</span></div>
              <div><strong>Construction Type :</strong> <span class="detail-value">${permitData.constructionType}</span></div>
            </div>

            <div class="detail-row"><div class="detail-label">Construction cost (\$) :</div><div class="detail-value">${permitData.constructionCost}</div></div>

            <div class="grid-row">
              <div><strong>Lic Const. Sup. :</strong> <span class="detail-value">${permitData.licConstSup}</span></div>
              <div><strong># :</strong> <span class="detail-value">&nbsp;</span></div>
            </div>

            <div class="grid-row">
              <div><strong>Home Imp. Contractor :</strong> <span class="detail-value">${permitData.homeImpContractor}</span></div>
              <div><strong># :</strong> <span class="detail-value">&nbsp;</span></div>
            </div>

            <div class="detail-row"><div class="detail-label">Building Size :</div><div class="detail-value"><span class="size-item"><span class="size-label">Length:</span> <span class="size-value">${permitData.buildingLength}</span></span><span class="size-item"><span class="size-label">Width:</span> <span class="size-value">${permitData.buildingWidth}</span></span><span class="size-item"><span class="size-label">Height:</span> <span class="size-value">${permitData.buildingHeight}</span></span></div></div>
            <div class="remarks-section">
              <strong>Remarks :</strong><br>
              ${permitData.remarks || '"Person contracting with unregistered contractors do not have access to the guaranty fund (as set forth in MGL c.142A)"'}
            </div>

            <div class="disclaimer-wrapper">
              <div class="disclaimer-text">WORK SHALL NOT PROCEED UNTIL THE INSPECTOR HAS APPROVED THE VARIOUS STAGES OF CONSTRUCTION.</div>
              <div class="disclaimer-text">PERMIT WILL BECOME NULL AND VOID IF CONSTRUCTION IS NOT STARTED WITHIN SIX MONTHS OF DATE THE PERMIT IS ISSUED AS NOTED ABOVE.</div>
              <div class="disclaimer-text">MINIMUM OF THREE CALLED INSPECTIONS REQUIRED FOR ALL CONSTRUCTION WORK; 1. FOUNDATION OR FOOTING. 2. PRIOR TO COVERING STRUCTURAL MEMBERS. (READY FOR LATH OR FINISH COVERINGS) 3. FINAL INSPECTION BEFORE OCCUPANCY.</div>
              <div class="disclaimer-text">APPROVED PLANS MUST BE RETAINED ON JOB AND THIS CARD KEPT POSTED UNTIL FINAL INSPECTION HAS BEEN MADE. WHERE A CERTIFICATE OF OCCUPANCY IS REQUIRED, SUCH BUILDING SHALL NOT BE OCCUPIED UNTIL FINAL INSPECTION HAS BEEN MADE.</div>
            </div>

            <div class="bottom-row">
              <div>
                <div>Permit No. :</strong> <span class="detail-value bottom-value-large">${permitData.permitNo}</span></div>
                <div>Date Issued :</strong> <span class="detail-value bottom-value-large">${permitData.dateIssued}</span></div>
                <div>Fee(\$) :</strong> <span class="detail-value">${permitData.fee}</span></div>
              </div>
              <div class="bottom-right">
                <div class="signature-section">${permitData.signature}</div>
              </div>
            </div>

            <div class="footer-text">POST THIS CARD SO IT IS VISIBLE FROM THE STREET</div>
          </div>
        </div>

        <script>
          function downloadPDF() {
            const element = document.getElementById('permit-content');
            const opt = {
              margin: 0,
              filename: 'permit_${permitData.permitNo}.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
  <div className="flex justify-center">
    <button
      onClick={handlePrint}
      disabled={!isPermitIssued}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition ${
        isPermitIssued
          ? "bg-blue-600 hover:bg-blue-500"
          : "bg-gray-600 cursor-not-allowed opacity-60"
      }`}
    >
      <Download size={18} />
      View & Download Permit
    </button>
  </div>

  <div
    className={`rounded-lg p-4 text-sm ${
      isPermitIssued
        ? "bg-blue-900/20 border border-blue-400/30 text-blue-300"
        : "bg-red-900/20 border border-red-400/30 text-red-300"
    }`}
  >
    <p>
      {isPermitIssued
        ? "Click the button above to open the permit in a new tab. You can then download it as a PDF."
        : "Please issue the permit first"}
    </p>
  </div>
</div>
  );
}
