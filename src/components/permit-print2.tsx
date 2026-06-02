"use client";

import { Download } from "lucide-react";

interface PermitPrint2Data {
  applicationNumber?: string;
  dateIssued?: string;
  permitNumber?: string;
  fee?: string;
  receiptNumber?: string;
  datePaid?: string;
  gisNo?: string;
  map?: string;
  block?: string;
  lot?: string;
  category?: string;
  projectNo?: string;
  permitNo?: string;
  estCost?: string;
  authNo?: string;
  balanceDue?: string;
  constClass?: string;
  useGroup?: string;
  lotSize?: string;
  zoning?: string;
  unitsGained?: string;
  unitsLost?: string;
  digSafeNo?: string;
  owner?: string;
  applicant?: string;
  atAddress?: string;
  issuedOn?: string;
  amendedOn?: string;
  expiresOn?: string;
  workDescription?: string;
  permitType?: string;
  formType?: string;
  inspectorName?: string;
  checkNo?: string;
  totalPaidAmount?: string;
  signature?: string;
  application?: {
    formType?: string;
  };
}

export default function PermitPrint2({
  data,
  isPermitIssued,
}: {
  data?: PermitPrint2Data;
  isPermitIssued: boolean;
}) {
  const permitData = {
    applicationNumber: data?.applicationNumber || "",
    dateIssued: data?.dateIssued || "",
    permitNumber: data?.permitNumber || "",
    fee: data?.fee || "$1.00",
    receiptNumber: data?.receiptNumber || "",
    datePaid: data?.datePaid || "",
    gisNo: data?.gisNo || "",
    map: data?.map || "104020",
    block: data?.block || "0",
    lot: data?.lot || "20",
    category: data?.category || "",
    projectNo: data?.projectNo || "",
    permitNo: data?.permitNo || "",
    estCost: data?.estCost || "$",
    authNo: data?.authNo || "",
    balanceDue: data?.balanceDue || "",
    constClass: data?.constClass || "",
    useGroup: data?.useGroup || "",
    lotSize: data?.lotSize || "",
    zoning: data?.zoning || "R3",
    unitsGained: data?.unitsGained || "",
    unitsLost: data?.unitsLost || "",
    digSafeNo: data?.digSafeNo || "",
    owner: data?.owner || "OCKWAY\nHIGHLANDS LLC",
    applicant: data?.applicant || "Applicant",
    atAddress: data?.atAddress || "16 CARRIAGE RD",
    issuedOn: data?.issuedOn || "",
    amendedOn: data?.amendedOn || "",
    expiresOn: data?.expiresOn || "",
    workDescription: data?.workDescription || "",
    permitType:
      data?.permitType ||
      data?.formType ||
      data?.application?.formType ||
      "",
    inspectorName: data?.inspectorName || "",
    checkNo: data?.checkNo || "",
    totalPaidAmount: data?.totalPaidAmount || "",
    signature: data?.signature || "",
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
        <title>Permit Print 2 - ${permitData.permitNumber}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          @page { size: letter portrait; margin: 0.35in; }
          @media print { body { background: #fff; } .download-btn { display: none; } }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.7; background: #fff; color: #111; }
          .download-btn { position: fixed; top: 18px; right: 18px; background: #0f4c81; color: #fff; border: none; padding: 8px 12px; border-radius: 3px; font-size: 11px; cursor: pointer; z-index: 10; }
          .page { position: relative; width: 100%; margin: 0; padding: 15px 35px; border: none; display: flex; flex-direction: column; gap: 6px; }
          .top-row { position: relative; display: flex; justify-content: center; align-items: center; font-size: 12px; color: #222; }
          .top-left { position: absolute; left: 0; }
          .header-block { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 0; }
          .logo-section { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 0; padding: 0; }
          .logo-img { width: 115px; height: 115px; object-fit: contain; }
          .dept-info { font-size: 14px; line-height: 1.3; font-weight: 700; text-align: left; color: #111; }
          .summary-table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .summary-table th, .summary-table td { border: 1px solid #999; padding: 8px 6px; }
          .summary-table th { text-align: left; font-weight: 800; }
          .summary-values td { color: #8b0000; font-weight: 700; font-size: 13px; }
          .main-row { display: flex; gap: 12px; align-items: flex-start; }
          .side-panel { width: 32%; border: 1px solid #999; }
          .side-panel table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .side-panel td { border: 1px solid #999; padding: 4px 6px; vertical-align: middle; line-height: 1.1; }
          .side-panel td.label { width: 50%; font-weight: 800; font-size: 13px; }
          .side-panel td.value { width: 50%; color: #8b0000; font-weight: 700; font-size: 13px; }
          .content-panel { width: 60%; display: flex; flex-direction: column; gap: 6px; align-items: stretch; }
          .content-panel .eyebrow { text-align: center; font-size: 13px; letter-spacing: 0px; font-weight: 800; text-transform: uppercase; }
          .content-panel .headline { text-align: center; font-size: 25px; font-weight: 900; line-height: 1.0; text-transform: uppercase; }
          .content-panel .subhead { text-align: center; font-size: 13px; font-weight: 800; font-style: italic; letter-spacing: 0.5px; }
          .field-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; border-bottom: 1px solid #111; padding: 3px 0; }
          .field-row.single { flex-direction: column; align-items: stretch; gap: 3px; }
          .field-block { display: flex; justify-content: flex-start; align-items: center; gap: 10px; width: 48%; padding: 0; }
          .field-row.single .field-block { width: 100%; }
          .field-block span.label { font-weight: 900; font-size: 13px; white-space: nowrap; min-width: 40%; }
          .field-block span.value { color: #8b0000; font-weight: 700; font-size: 13px; text-align: left; }
          .permission-box { border-top: 1px solid #999; border-bottom: 1px solid #999; padding: 14px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; }
          .permission-label { font-weight: 800; }
          .permission-value { color: #8b0000; font-weight: 700; white-space: pre-line; }
          .issued-row { display: flex; justify-content: space-between; gap: 14px; font-size: 12px; margin-top: 2px; }
          .issued-item { display: flex; gap: 8px; align-items: center; font-weight: 900; font-size: 13px; }
          .issued-item span { font-style: italic; }
          .issued-item strong { color: #8b0000; font-weight: 600; font-size: 13px; }
          .work-line { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; margin-top: 1px; }
          .work-title { font-size: 13px; font-weight: 900; letter-spacing: 0.2px; }
          .work-copy { font-size: 12px; font-weight: 700; color: #8b0000; }
          .notice { text-align: center; font-size: 13px; font-weight: 800; margin-top: 2px; }
          .panel-row { width: 100%; border: 1px solid #999; display: flex; flex-direction: column; }
          .panel-header { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #999; }
          .panel-header-cell { padding: 6px 8px; font-weight: 800; font-size: 12px; border-right: 1px solid #999; }
          .panel-header-cell:last-child { border-right: none; }
          .panel-content { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #999; }
          .panel-section { padding: 0; border-right: 1px solid #999; }
          .panel-section:last-child { border-right: none; }
          .panel-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .panel-table td { padding: 2px 4px; vertical-align: top; border-bottom: none; }
          .panel-table td.label { width: 50%; font-weight: 800; }
          .note-box { border: none; padding: 6px 8px; font-size: 12px; line-height: 1.3; margin-top: 0; }
          .note-footer { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-top: 2px; font-size: 11px; color: #111; }
          .note-footer-left { line-height: 1.35; width: 62%; }
          .note-footer-right { text-align: right; }
          .brand-logo { font-size: 14px; font-weight: 700; color: #1f7ea2; margin-bottom: 2px; }
          .brand { font-size: 11px; font-weight: 700; color: #111; }
          .bottom-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 2px; }
          .bottom-table th, .bottom-table td { border: 1px solid #999; padding: 6px 5px; }
          .bottom-table th { font-weight: 800; text-align: left; background: #f7f7f7; }
          .bottom-table td { font-size: 12px; text-align: center; }
          .bottom-table td:first-child { text-align: left; }
          .bottom-table td.permit-type { font-style: italic; color: #8b0000; font-weight: 700; }
          .bottom-table td.receipt-date { color: #8b0000; font-weight: 700; }
          .bottom-table td.highlight { color: #8b0000; font-weight: 700; }
        </style>
      </head>
      <body>
        <button class="download-btn" onclick="downloadPDF()">Download PDF</button>
        <div class="page" id="permit-content">
          <div class="top-row">
            <div class="top-left">${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="top-right">Application Form</div>
          </div>

          <div class="header-block">
            <div class="logo-section">
              <img src="/images/town_seal.png" alt="Logo" class="logo-img">
              <div class="dept-info">
                Anytown Building Department<br>
                17 Main Street<br>
                Anytown, MA 12345<br>
                (111) 111-1111
              </div>
            </div>
          </div>

          <table class="summary-table">
            <thead>
              <tr>
                <th>Application Number:</th>
                <th>Date Issued:</th>
                <th>Permit Number:</th>
                <th>FEE: $</th>
                <th>Receipt No.:</th>
                <th>Date Paid:</th>
              </tr>
            </thead>
            <tbody class="summary-values">
              <tr>
                <td>${permitData.applicationNumber}</td>
                <td>${permitData.dateIssued}</td>
                <td>${permitData.permitNumber}</td>
                <td>${permitData.fee}</td>
                <td>${permitData.receiptNumber}</td>
                <td>${permitData.datePaid}</td>
              </tr>
            </tbody>
          </table>

          <div class="main-row">
            <div class="side-panel">
              <table>
                <tbody>
                  <tr><td class="label">GIS No. :</td><td class="value">${permitData.gisNo}</td></tr>
                  <tr><td class="label">Map:</td><td class="value">${permitData.map}</td></tr>
                  <tr><td class="label">Block:</td><td class="value">${permitData.block}</td></tr>
                  <tr><td class="label">Lot:</td><td class="value">${permitData.lot}</td></tr>
                  <tr><td class="label">Category:</td><td class="value">${permitData.category}</td></tr>
                  <tr><td class="label">Project No. :</td><td class="value">${permitData.projectNo}</td></tr>
                  <tr><td class="label">Permit No. :</td><td class="value">${permitData.permitNo}</td></tr>
                  <tr><td class="label">Est. Cost: $</td><td class="value">${permitData.estCost}</td></tr>
                  <tr><td class="label">Auth. No. :</td><td class="value">${permitData.authNo}</td></tr>
                  <tr><td class="label">Balance Due:</td><td class="value">${permitData.balanceDue}</td></tr>
                  <tr><td class="label">Const. Class:</td><td class="value">${permitData.constClass}</td></tr>
                  <tr><td class="label">Use Group:</td><td class="value">${permitData.useGroup}</td></tr>
                  <tr><td class="label">Lot Size (Ac.):</td><td class="value">${permitData.lotSize}</td></tr>
                  <tr><td class="label">Zoning:</td><td class="value">${permitData.zoning}</td></tr>
                  <tr><td class="label">Units Gained:</td><td class="value">${permitData.unitsGained}</td></tr>
                  <tr><td class="label">Units Lost:</td><td class="value">${permitData.unitsLost}</td></tr>
                  <tr><td class="label">Dig Safe No. :</td><td class="value">${permitData.digSafeNo}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="content-panel">
              <div class="eyebrow">COMMONWEALTH OF MASSACHUSETTS</div>
              <div class="eyebrow">TOWN OF ANYTOWN</div>
             <div style="text-align:center; font-size:22px; font-weight:900; margin-top:6px;">
  ${permitData.permitType ? permitData.permitType.toUpperCase() + " PERMIT" : ""}
</div>
              <div class="subhead">PERMISSION IS HEREBY GRANTED TO:</div>
              <div class="field-row">
                <div class="field-block"><span class="label">licensed Person:</span><span class="value">&nbsp;</span></div>
                <div class="field-block"><span class="label">License:</span><span class="value">&nbsp;</span></div>
              </div>
              <div class="field-row single">
                <div class="field-block">
                  <span class="label">Owner:</span>
                  <span class="value">${permitData.owner}</span>
                </div>
              </div>
              <div class="field-row single">
                <div class="field-block">
                  <span class="label">Applicant:</span>
                  <span class="value">${permitData.applicant}</span>
                </div>
              </div>
              <div class="field-row single">
                <div class="field-block">
                  <span class="label">At:</span>
                  <span class="value">${permitData.atAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="issued-row">
            <div class="issued-item"><span>ISSUED ON:</span><strong>${permitData.issuedOn}</strong></div>
            <div class="issued-item"><span>AMENDED ON:</span><strong>${permitData.amendedOn}</strong></div>
            <div class="issued-item"><span>EXPIRES ON:</span><strong>${permitData.expiresOn}</strong></div>
          </div>

          <div class="work-line">
            <span class="work-title">TO PERFORM THE FOLLOWING WORK:</span>
            <span class="work-copy">${permitData.workDescription}</span>
          </div>
          <div class="notice">POST THIS CARD SO IT IS VISIBLE FROM THE STREET</div>

          <div class="panel-row">
            <div class="panel-header">
              <div class="panel-header-cell">G.D.S.</div>
              <div class="panel-header-cell">D.P.W.</div>
            </div>
            <div class="panel-content">
              <div class="panel-section">
                <table class="panel-table">
                  <tbody>
                    <tr><td class="label">Underground:</td><td></td></tr>
                    <tr><td class="label">Service:</td><td></td></tr>
                    <tr><td class="label">Rough:</td><td></td></tr>
                    <tr><td class="label">Final:</td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <div class="panel-section">
                <table class="panel-table">
                  <tbody>
                    <tr><td class="label">Meter:</td><td></td></tr>
                    <tr><td class="label">House No. :</td><td></td></tr>
                    <tr><td class="label">Water:</td><td></td></tr>
                    <tr><td class="label">Sewer:</td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="note-box">THIS PERMIT MAY BE REVOKED BY THE TOWN OF ANYTOWN UPON VIOLATION OF ANY OF ITS RULES AND REGULATIONS.</div>
          </div>

          <div class="note-footer">
            <div class="note-footer-left">"Persons contracting with unregistered contractors do not have access to the guaranty fund (as set forth in MGL c.142A)."</div>
            <div class="note-footer-right">
             <div class="brand-logo">${permitData.signature}</div>
              <div class="brand">${permitData.signature}</div>
            </div>
          </div>

          <table class="bottom-table">
            <thead>
              <tr>
                <th>Permit Type:</th>
                <th>Inspector Name:</th>
                <th>Receipt No. :</th>
                <th>Date Paid:</th>
                <th>Check No. :</th>
                <th>Total Paid Amount:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
               <td style="color:#8b0000; font-weight:700;">
 ${permitData.permitType ? permitData.permitType.toUpperCase() + " PERMIT" : ""}
</td>
                <td class="receipt-date">${permitData.signature}</td>
                <td class="receipt-date">${permitData.receiptNumber}</td>
                <td class="receipt-date">${permitData.datePaid}</td>
                <td class="receipt-date">${permitData.checkNo}</td>
                <td class="highlight">${permitData.totalPaidAmount}</td>
              </tr>
            </tbody>
          </table>

        
           <br/><br/>

       
        <script>
          function downloadPDF() {
            const element = document.getElementById('permit-content');
            const opt = {
              margin: 0,
              filename: 'permit2_${permitData.permitNumber}.pdf',
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
