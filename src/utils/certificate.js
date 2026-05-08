import { jsPDF } from "jspdf";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export async function generateCertificate(email, courseName, userId) {
  const doc = new jsPDF({ orientation: "landscape" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(245, 245, 250);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");

  doc.setFontSize(34);
  doc.setTextColor(48, 47, 52);
  doc.text("Certificate of Completion", width / 2, 50, { align: "center" });

  doc.setFontSize(14);
  doc.text("This certifies that", width / 2, 80, { align: "center" });

  doc.setFontSize(20);
  doc.text(email, width / 2, 100, { align: "center" });

  doc.setFontSize(14);
  doc.text("has successfully completed the course", width / 2, 120, { align: "center" });

  doc.setFontSize(18);
  doc.text(courseName, width / 2, 140, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, width / 2, 170, { align: "center" });

  const filename = `certificate_${courseName.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);

  // Save certificate record to Firestore if userId provided
  if (userId) {
    try {
      await addDoc(collection(db, "certificates"), {
        userId,
        courseName,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to save certificate record:", err);
    }
  }
}


