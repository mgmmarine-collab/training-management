const router = require('express').Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Batch = require('../models/Batch');
const Candidate = require('../models/Candidate');
const { verifyToken } = require('./authRoutes');

// Export batch candidates to Excel
router.get('/batch-candidates-excel/:batchId', verifyToken, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId).populate('courseId');
    const candidates = await Candidate.find({ batchId: req.params.batchId });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Candidates');

    // Add headers
    worksheet.columns = [
      { header: 'S.No', key: 'sNo', width: 8 },
      { header: 'Name', key: 'name', width: 20 },
      { header: "Father's Name", key: 'fatherName', width: 20 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Aadhar', key: 'aadharNumber', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Exam Status', key: 'examStatus', width: 12 },
      { header: 'Exam Score', key: 'examScore', width: 12 },
      { header: 'Certificate', key: 'certificateStatus', width: 15 },
      { header: 'Placed', key: 'isPlaced', width: 10 },
      { header: 'Company', key: 'companyName', width: 20 },
      { header: 'Position', key: 'jobRole', width: 20 },
      { header: 'Salary (LPA)', key: 'salary', width: 12 }
    ];

    // Add data rows
    candidates.forEach(candidate => {
      worksheet.addRow({
        sNo: candidate.sNo,
        name: candidate.name,
        fatherName: candidate.fatherName,
        mobile: candidate.mobile,
        aadharNumber: candidate.aadharNumber,
        email: candidate.email,
        address: candidate.address,
        examStatus: candidate.examStatus,
        examScore: candidate.examScore,
        certificateStatus: candidate.certificateStatus,
        isPlaced: candidate.isPlaced ? 'Yes' : 'No',
        companyName: candidate.companyName,
        jobRole: candidate.jobRole,
        salary: candidate.salary
      });
    });

    // Style header row
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Batch_${batch.batchNumber}_Candidates.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export batch details to Excel
router.get('/batch-details-excel/:batchId', verifyToken, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId).populate('courseId');
    const candidates = await Candidate.find({ batchId: req.params.batchId });

    const workbook = new ExcelJS.Workbook();
    
    // Batch Details Sheet
    const detailSheet = workbook.addWorksheet('Batch Details');
    detailSheet.columns = [
      { header: 'Field', key: 'field', width: 20 },
      { header: 'Value', key: 'value', width: 40 }
    ];

    detailSheet.addRow({ field: 'Batch Number', value: batch.batchNumber });
    detailSheet.addRow({ field: 'Batch Name', value: batch.batchName });
    detailSheet.addRow({ field: 'Course', value: batch.courseId?.courseName });
    detailSheet.addRow({ field: 'Status', value: batch.status });
    detailSheet.addRow({ field: 'Start Date', value: batch.startDate?.toLocaleDateString() });
    detailSheet.addRow({ field: 'End Date', value: batch.endDate?.toLocaleDateString() });
    detailSheet.addRow({ field: 'Assessment Date', value: batch.assessmentDate?.toLocaleDateString() });
    detailSheet.addRow({ field: 'Certificate Issuing Date', value: batch.certificateIssuingDate?.toLocaleDateString() });
    detailSheet.addRow({ field: 'Total Candidates', value: candidates.length });

    const placedCount = candidates.filter(c => c.isPlaced).length;
    const certCount = candidates.filter(c => c.certificateStatus === 'issued').length;
    detailSheet.addRow({ field: 'Placed Candidates', value: placedCount });
    detailSheet.addRow({ field: 'Certified Candidates', value: certCount });

    // Candidates summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'S.No', key: 'sNo', width: 8 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Certificate', key: 'certificate', width: 15 },
      { header: 'Placement', key: 'placement', width: 15 }
    ];

    candidates.forEach(candidate => {
      summarySheet.addRow({
        sNo: candidate.sNo,
        name: candidate.name,
        status: candidate.examStatus,
        certificate: candidate.certificateStatus,
        placement: candidate.isPlaced ? `${candidate.companyName} - ${candidate.jobRole}` : 'Not Placed'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Batch_${batch.batchNumber}_Details.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export batch candidates to PDF
router.get('/batch-candidates-pdf/:batchId', verifyToken, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId).populate('courseId');
    const candidates = await Candidate.find({ batchId: req.params.batchId });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Batch_${batch.batchNumber}_Candidates.pdf`);

    doc.pipe(res);

    // Title
    doc.fontSize(18).font('Helvetica-Bold').text('Training Batch Report', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Batch ${batch.batchNumber}: ${batch.batchName}`, { align: 'center' });
    doc.fontSize(10).text(`Course: ${batch.courseId?.courseName}`, { align: 'center' });
    doc.moveDown();

    // Batch info
    doc.fontSize(10).font('Helvetica-Bold').text('Batch Information:');
    doc.fontSize(9).font('Helvetica')
      .text(`Status: ${batch.status}`)
      .text(`Start Date: ${batch.startDate?.toLocaleDateString()}`)
      .text(`End Date: ${batch.endDate?.toLocaleDateString()}`)
      .text(`Total Candidates: ${candidates.length}`);
    doc.moveDown();

    // Candidates table header
    doc.fontSize(10).font('Helvetica-Bold').text('Candidates List:', { underline: true });
    doc.moveDown(0.5);

    // Simple table
    candidates.forEach((candidate, index) => {
      doc.fontSize(8).font('Helvetica')
        .text(`${candidate.sNo}. ${candidate.name} | ${candidate.mobile} | ${candidate.email}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
