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

  // Background
  doc.setFillColor(255, 255, 250);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Premium outer border
  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(2.8);
  doc.rect(8, 8, 281, 194);

  // Premium inner gold border
  doc.setDrawColor(244, 123, 32);
  doc.setLineWidth(0.8);
  doc.rect(14, 14, 269, 182);

  // Thin decorative inner border
  doc.setDrawColor(220, 185, 95);
  doc.setLineWidth(0.4);
  doc.rect(19, 19, 259, 172);

  // Top ribbon
  doc.setFillColor(7, 58, 122);
  doc.rect(0, 0, pageWidth, 15, "F");

  doc.setFillColor(244, 123, 32);
  doc.rect(0, 15, pageWidth, 3, "F");

  // Decorative side bars
  doc.setFillColor(7, 58, 122);
  doc.rect(12, 24, 2, 162, "F");
  doc.rect(283, 24, 2, 162, "F");

  doc.setFillColor(244, 123, 32);
  doc.rect(16, 24, 0.8, 162, "F");
  doc.rect(280.2, 24, 0.8, 162, "F");

  // Top logos centered together
  await addImageToPDF(doc, baseUrl + "synia.PNG", 111, 25, 28, 28);
  await addImageToPDF(doc, baseUrl + "speakout.PNG", 158, 25, 38, 28);

  // Divider between logos
  doc.setDrawColor(244, 123, 32);
  doc.setLineWidth(0.5);
  doc.line(148.5, 28, 148.5, 51);

  // Organization line
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(7, 58, 122);
  doc.text("Synia Aid Foundation", 125, 59, { align: "center" });
  doc.text("SpeakOut Mental Health Outreach", 177, 59, { align: "center" });

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(244, 123, 32);
  doc.text("CERTIFICATE OF PARTICIPATION", pageWidth / 2, 78, { align: "center" });

  // Small decorative line
  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(0.5);
  doc.line(65, 84, 232, 84);

  // Intro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(55, 55, 55);
  doc.text("This certificate is proudly presented to", pageWidth / 2, 96, { align: "center" });

  // Name
  doc.setFont("times", "bold");
  doc.setFontSize(32);
  doc.setTextColor(7, 58, 122);
  doc.text(name, pageWidth / 2, 115, { align: "center" });

  // Name underline
  doc.setDrawColor(244, 123, 32);
  doc.setLineWidth(0.8);
  doc.line(76, 121, 221, 121);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(45, 45, 45);

  doc.text(
    "for participating in the Leadership Development Summit 2026",
    pageWidth / 2,
    135,
    { align: "center" }
  );

  doc.text(
    "organized by Synia Aid Foundation in partnership with SpeakOut Mental Health Outreach",
    pageWidth / 2,
    147,
    { align: "center" }
  );

  doc.text(
    "held on Saturday, 23rd May, 2026 at Nasarawa State College of Health Science and Technology,",
    pageWidth / 2,
    159,
    { align: "center" }
  );

  doc.text(
    "Keffi, Nasarawa State.",
    pageWidth / 2,
    171,
    { align: "center" }
  );

  // Signature lines
  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(0.6);
  doc.line(38, 184, 104, 184);
  doc.line(193, 184, 259, 184);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(7, 58, 122);
  doc.text("Authorized Signatory", 71, 190, { align: "center" });
  doc.text("Program Coordinator", 226, 190, { align: "center" });

  // Footer text only — no bottom logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Exclusively covered by BDS Creative Studio", pageWidth / 2, 201, { align: "center" });

  // Certificate ID
  const certId = "LDS-2026-" + Math.floor(100000 + Math.random() * 900000);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text("Certificate ID: " + certId, 18, 201);

  doc.save(name.replaceAll(" ", "_") + "_Leadership_Summit_2026_Certificate.pdf");
}


