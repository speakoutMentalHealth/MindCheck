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

  doc.setFillColor(255, 255, 248);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(2.5);
  doc.rect(8, 8, 281, 194);

  doc.setDrawColor(244, 123, 32);
  doc.setLineWidth(0.8);
  doc.rect(14, 14, 269, 182);

  doc.setFillColor(7, 58, 122);
  doc.rect(0, 0, pageWidth, 18, "F");

  doc.setFillColor(244, 123, 32);
  doc.rect(0, 18, pageWidth, 3, "F");

  await addImageToPDF(doc, baseUrl + "Synia.PNG", 20, 25, 30, 30);
  await addImageToPDF(doc, baseUrl + "speakout.PNG", 230, 25, 42, 28);
  await addImageToPDF(doc, baseUrl + "bds.PNG", 134, 171, 28, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(7, 58, 122);
  doc.text("Synia Aid Foundation", 35, 62, { align: "center" });
  doc.text("SpeakOut Mental Health Outreach", 251, 62, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(244, 123, 32);
  doc.text("CERTIFICATE OF PARTICIPATION", pageWidth / 2, 78, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text("This certificate is proudly presented to", pageWidth / 2, 94, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(7, 58, 122);
  doc.text(name, pageWidth / 2, 112, { align: "center" });

  doc.setDrawColor(244, 123, 32);
  doc.setLineWidth(0.7);
  doc.line(78, 117, 219, 117);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(45, 45, 45);

  doc.text("for participating in the Leadership Development Summit 2026", pageWidth / 2, 132, { align: "center" });
  doc.text("organized by Synia Aid Foundation in partnership with SpeakOut Mental Health Outreach", pageWidth / 2, 144, { align: "center" });
  doc.text("held on Saturday, 23rd May, 2026 at Nasarawa State College of Health Science and Technology,", pageWidth / 2, 156, { align: "center" });
  doc.text("Keffi, Nasarawa State.", pageWidth / 2, 168, { align: "center" });

  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(0.5);
  doc.line(35, 180, 100, 180);
  doc.line(197, 180, 262, 180);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(7, 58, 122);
  doc.text("Authorized Signatory", 67.5, 187, { align: "center" });
  doc.text("Program Coordinator", 229.5, 187, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Exclusively covered by BDS Creative Studio", pageWidth / 2, 205, { align: "center" });

  const certId = "LDS-2026-" + Math.floor(100000 + Math.random() * 900000);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text("Certificate ID: " + certId, 18, 205);

  doc.save(name.replaceAll(" ", "_") + "_Leadership_Summit_2026_Certificate.pdf");
}
