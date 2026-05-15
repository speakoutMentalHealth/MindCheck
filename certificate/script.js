function verifyUser() {

  const fullName = document
    .getElementById("fullname")
    .value
    .trim()
    .toUpperCase();

  const phone = document
    .getElementById("phone")
    .value
    .trim();

  const message = document.getElementById("message");

  const foundUser = attendees.find(user =>
    user.name === fullName &&
    user.phone === phone
  );

  if (!foundUser) {

    message.style.color = "red";

    message.innerHTML =
      "User not found. Please check your details.";

    return;
  }

  message.style.color = "green";

  message.innerHTML =
    "Verified successfully. Download starting...";

  generateCertificate(foundUser.name);
}

function generateCertificate(name) {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("landscape");

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 300, 210, "F");

  // Border
  doc.setDrawColor(7, 58, 122);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(28);

  doc.setTextColor(244, 123, 32);

  doc.text(
    "CERTIFICATE OF PARTICIPATION",
    148,
    45,
    { align: "center" }
  );

  // Intro
  doc.setFontSize(16);
  doc.setTextColor(0,0,0);

  doc.text(
    "This certificate is proudly presented to",
    148,
    70,
    { align: "center" }
  );

  // Name
  doc.setFont("times", "bold");
  doc.setFontSize(30);

  doc.setTextColor(7, 58, 122);

  doc.text(
    name,
    148,
    95,
    { align: "center" }
  );

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  doc.setTextColor(40,40,40);

  doc.text(
    "for participating in the Leadership Development Summit 2026",
    148,
    120,
    { align: "center" }
  );

  doc.text(
    "organized by Senior Aid Foundation in partnership",
    148,
    135,
    { align: "center" }
  );

  doc.text(
    "with SpeakOut Mental Health Outreach",
    148,
    148,
    { align: "center" }
  );

  doc.text(
    "held at Nasarawa State College of Health Science",
    148,
    163,
    { align: "center" }
  );

  doc.text(
    "and Technology, Keffi, Nasarawa State.",
    148,
    176,
    { align: "center" }
  );

  // Save
  doc.save(name + "_certificate.pdf");
}
