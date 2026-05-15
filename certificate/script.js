function verifyUser() {
  const fullName = document.getElementById("fullname").value.trim().toUpperCase();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message");

  const foundUser = attendees.find(user =>
    user.name === fullName &&
    user.phone === phone
  );

  if (!foundUser) {
    message.style.color = "red";
    message.innerHTML = "User not found. Please check your details.";
    return;
  }

  message.style.color = "green";
  message.innerHTML = "Verified successfully. Download starting...";
  generateCertificate(foundUser.name);
}

async function addImageToPDF(doc, imagePath, x, y, width, height) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      doc.addImage(dataURL, "PNG", x, y, width, height);
      resolve();
    };

    img.onerror = function () {
      console.log("Image failed:", imagePath);
      resolve();
    };

    img.src = imagePath;
  });
}

async function generateCertificate(name) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape", "mm", "a4");

  const pageWidth = 297;
  const pageHeight = 210;
  const baseUrl = "https://speakoutmentalhealth.github.io/MindCheck/certificate/";

  const certId = "LDS-2026-" + Math.floor(100000 + Math.random() * 900000);

  // Background
  doc.setFillColor(255, 253, 245);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Navy outer frame
  doc.setDrawColor(3, 39, 90);
  doc.setLineWidth(4);
  doc.rect(5, 5, 287, 200);

  // Gold frame
  doc.setDrawColor(202, 145, 38);
  doc.setLineWidth(1.3);
  doc.rect(11, 11, 275, 188);

  // Inner fine frame
  doc.setDrawColor(244, 190, 88);
  doc.setLineWidth(0.5);
  doc.rect(16, 16, 265, 178);

  // Top navy band
  doc.setFillColor(3, 39, 90);
  doc.rect(0, 0, pageWidth, 13, "F");

  // Gold accent band
  doc.setFillColor(202, 145, 38);
  doc.rect(0, 13, pageWidth, 3, "F");

  // Decorative center notch
  doc.setFillColor(202, 145, 38);
  doc.triangle(140, 13, 157, 13, 148.5, 24, "F");

  // Centered logos
  await addImageToPDF(doc, baseUrl + "synia.PNG", 103, 24, 36, 32);

  doc.setDrawColor(202, 145, 38);
  doc.setLineWidth(0.5);
  doc.line(148.5, 27, 148.5, 56);

  await addImageToPDF(doc, baseUrl + "speakout.PNG", 158, 24, 42, 32);

  // Main certificate title
  doc.setFont("times", "bold");
  doc.setFontSize(41);
  doc.setTextColor(170, 113, 18);
  doc.text("CERTIFICATE", pageWidth / 2, 82, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(3, 39, 90);
  doc.text("OF PARTICIPATION", pageWidth / 2, 94, { align: "center" });

  // Decorative lines beside subtitle
  doc.setDrawColor(202, 145, 38);
  doc.setLineWidth(0.8);
  doc.line(78, 92, 118, 92);
  doc.line(179, 92, 219, 92);

  // Intro
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(35, 45, 65);
  doc.text("This certificate is proudly presented to", pageWidth / 2, 110, { align: "center" });

  // Recipient name
  doc.setFont("times", "bold");
  doc.setFontSize(32);
  doc.setTextColor(3, 39, 90);
  doc.text(name, pageWidth / 2, 127, { align: "center" });

  // Recipient underline
  doc.setDrawColor(202, 145, 38);
  doc.setLineWidth(0.7);
  doc.line(82, 133, 215, 133);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(25, 35, 55);

  doc.text(
    "for participating in the Leadership Development Summit 2026",
    pageWidth / 2,
    146,
    { align: "center" }
  );

  doc.text(
    "organized by Synia Aid Foundation in partnership with SpeakOut Mental Health Outreach",
    pageWidth / 2,
    157,
    { align: "center" }
  );

  doc.text(
    "held on Saturday, 23rd May, 2026 at Nasarawa State College of Health Science and Technology,",
    pageWidth / 2,
    168,
    { align: "center" }
  );

  doc.text(
    "Keffi, Nasarawa State.",
    pageWidth / 2,
    179,
    { align: "center" }
  );

  // Signature lines
  doc.setDrawColor(3, 39, 90);
  doc.setLineWidth(0.6);
  doc.line(35, 188, 100, 188);
  doc.line(197, 188, 262, 188);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(3, 39, 90);
  doc.text("Authorized Signatory", 67.5, 194, { align: "center" });
  doc.text("Program Coordinator", 229.5, 194, { align: "center" });

  // Certificate ID
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(3, 39, 90);
  doc.text("Certificate ID: " + certId, 18, 196);

  doc.save(name.replaceAll(" ", "_") + "_Leadership_Summit_2026_Certificate.pdf");
}


