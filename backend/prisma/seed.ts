import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. Courses ─────────────────────────────────────────────────────────────
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { code: 'BCA' },
      update: {},
      create: {
        code: 'BCA',
        name: 'Bachelor of Computer Applications',
        durationYears: 3,
        description: 'A 3-year undergraduate program focusing on computer applications, programming, and software development.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'BSc' },
      update: {},
      create: {
        code: 'BSc',
        name: 'Bachelor of Science (Computer Science)',
        durationYears: 3,
        description: 'A 3-year undergraduate science program with strong emphasis on mathematics and computer science fundamentals.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'MCA' },
      update: {},
      create: {
        code: 'MCA',
        name: 'Master of Computer Applications',
        durationYears: 2,
        description: 'A 2-year postgraduate program for advanced study in computer applications and software engineering.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'BTech' },
      update: {},
      create: {
        code: 'BTech',
        name: 'Bachelor of Technology (Computer Science & Engineering)',
        durationYears: 4,
        description: 'A 4-year flagship engineering program covering software, hardware, and systems engineering.',
      },
    }),
  ]);

  const [bca, bsc, mca, btech] = courses;
  console.log('✅ Courses created');

  // ─── 2. Fee Structures ──────────────────────────────────────────────────────
  const feeData = [
    // BCA Fees
    { courseId: bca.id, academicYear: '2022-2023', admissionFee: 8000, tuitionFee: 45000, registrationFee: 1500, totalFee: 54500 },
    { courseId: bca.id, academicYear: '2023-2024', admissionFee: 9000, tuitionFee: 48000, registrationFee: 1800, totalFee: 58800 },
    { courseId: bca.id, academicYear: '2024-2025', admissionFee: 10000, tuitionFee: 52000, registrationFee: 2000, totalFee: 64000 },
    // BSc Fees
    { courseId: bsc.id, academicYear: '2022-2023', admissionFee: 7000, tuitionFee: 38000, registrationFee: 1500, totalFee: 46500 },
    { courseId: bsc.id, academicYear: '2023-2024', admissionFee: 7500, tuitionFee: 40000, registrationFee: 1500, totalFee: 49000 },
    { courseId: bsc.id, academicYear: '2024-2025', admissionFee: 8500, tuitionFee: 44000, registrationFee: 2000, totalFee: 54500 },
    // MCA Fees
    { courseId: mca.id, academicYear: '2022-2023', admissionFee: 15000, tuitionFee: 75000, registrationFee: 3000, totalFee: 93000 },
    { courseId: mca.id, academicYear: '2023-2024', admissionFee: 16000, tuitionFee: 80000, registrationFee: 3500, totalFee: 99500 },
    { courseId: mca.id, academicYear: '2024-2025', admissionFee: 18000, tuitionFee: 88000, registrationFee: 4000, totalFee: 110000 },
    // BTech Fees
    { courseId: btech.id, academicYear: '2022-2023', admissionFee: 18000, tuitionFee: 90000, registrationFee: 4000, totalFee: 112000 },
    { courseId: btech.id, academicYear: '2023-2024', admissionFee: 20000, tuitionFee: 95000, registrationFee: 4500, totalFee: 119500 },
    { courseId: btech.id, academicYear: '2024-2025', admissionFee: 22000, tuitionFee: 105000, registrationFee: 5000, totalFee: 132000 },
  ];

  for (const fee of feeData) {
    await prisma.feeStructure.upsert({
      where: { courseId_academicYear: { courseId: fee.courseId, academicYear: fee.academicYear } },
      update: {},
      create: fee,
    });
  }
  console.log('✅ Fee structures created');

  // ─── 3. Batches ─────────────────────────────────────────────────────────────
  const batches = [
    // BCA Batches
    { courseId: bca.id, academicYear: '2022-2025', startYear: 2022, endYear: 2025 },
    { courseId: bca.id, academicYear: '2023-2026', startYear: 2023, endYear: 2026 },
    { courseId: bca.id, academicYear: '2024-2027', startYear: 2024, endYear: 2027 },
    // BSc Batches
    { courseId: bsc.id, academicYear: '2022-2025', startYear: 2022, endYear: 2025 },
    { courseId: bsc.id, academicYear: '2023-2026', startYear: 2023, endYear: 2026 },
    { courseId: bsc.id, academicYear: '2024-2027', startYear: 2024, endYear: 2027 },
    // MCA Batches
    { courseId: mca.id, academicYear: '2022-2024', startYear: 2022, endYear: 2024 },
    { courseId: mca.id, academicYear: '2023-2025', startYear: 2023, endYear: 2025 },
    { courseId: mca.id, academicYear: '2024-2026', startYear: 2024, endYear: 2026 },
    // BTech Batches
    { courseId: btech.id, academicYear: '2021-2025', startYear: 2021, endYear: 2025 },
    { courseId: btech.id, academicYear: '2022-2026', startYear: 2022, endYear: 2026 },
    { courseId: btech.id, academicYear: '2024-2028', startYear: 2024, endYear: 2028 },
  ];

  const createdBatches: Record<string, string> = {};
  for (const b of batches) {
    const batch = await prisma.batch.upsert({
      where: { courseId_academicYear: { courseId: b.courseId, academicYear: b.academicYear } },
      update: {},
      create: b,
    });
    createdBatches[`${b.courseId}-${b.academicYear}`] = batch.id;
  }
  console.log('✅ Batches created');

  // ─── 4. Student Statistics ───────────────────────────────────────────────────
  const statsData = [
    // BCA
    { key: `${bca.id}-2022-2025`, totalEnrolled: 118, studentsLeft: 8, studentsGraduated: 104 },
    { key: `${bca.id}-2023-2026`, totalEnrolled: 125, studentsLeft: 6, studentsGraduated: 0 },
    { key: `${bca.id}-2024-2027`, totalEnrolled: 132, studentsLeft: 2, studentsGraduated: 0 },
    // BSc
    { key: `${bsc.id}-2022-2025`, totalEnrolled: 95, studentsLeft: 5, studentsGraduated: 85 },
    { key: `${bsc.id}-2023-2026`, totalEnrolled: 102, studentsLeft: 4, studentsGraduated: 0 },
    { key: `${bsc.id}-2024-2027`, totalEnrolled: 110, studentsLeft: 1, studentsGraduated: 0 },
    // MCA
    { key: `${mca.id}-2022-2024`, totalEnrolled: 72, studentsLeft: 3, studentsGraduated: 68 },
    { key: `${mca.id}-2023-2025`, totalEnrolled: 78, studentsLeft: 2, studentsGraduated: 0 },
    { key: `${mca.id}-2024-2026`, totalEnrolled: 85, studentsLeft: 1, studentsGraduated: 0 },
    // BTech
    { key: `${btech.id}-2021-2025`, totalEnrolled: 180, studentsLeft: 12, studentsGraduated: 162 },
    { key: `${btech.id}-2022-2026`, totalEnrolled: 195, studentsLeft: 8, studentsGraduated: 0 },
    { key: `${btech.id}-2024-2028`, totalEnrolled: 210, studentsLeft: 3, studentsGraduated: 0 },
  ];

  for (const s of statsData) {
    const batchId = createdBatches[s.key];
    if (!batchId) continue;
    await prisma.studentStatistic.upsert({
      where: { batchId },
      update: {},
      create: { batchId, totalEnrolled: s.totalEnrolled, studentsLeft: s.studentsLeft, studentsGraduated: s.studentsGraduated },
    });
  }
  console.log('✅ Student statistics created');

  // ─── 5. Sample Students (BCA 2024-2027 batch) ────────────────────────────────
  const bcaBatchId = createdBatches[`${bca.id}-2024-2027`];
  const sampleStudents = [
    { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@student.edu', status: 'active' },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@student.edu', status: 'active' },
    { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@student.edu', status: 'active' },
    { firstName: 'Sneha', lastName: 'Mehta', email: 'sneha.mehta@student.edu', status: 'active' },
    { firstName: 'Kiran', lastName: 'Rao', email: 'kiran.rao@student.edu', status: 'dropped' },
  ];
  for (const s of sampleStudents) {
    await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, courseId: bca.id, batchId: bcaBatchId },
    });
  }
  console.log('✅ Sample students created');

  // ─── 6. Sample Applications ──────────────────────────────────────────────────
  await prisma.application.createMany({
    data: [
      { courseId: btech.id, firstName: 'Rahul', lastName: 'Singh', email: 'rahul.s@apply.com', phone: '9876543210', academicYear: '2025-2029', status: 'pending' },
      { courseId: mca.id, firstName: 'Anjali', lastName: 'Verma', email: 'anjali.v@apply.com', phone: '9812345678', academicYear: '2025-2027', status: 'approved' },
      { courseId: bca.id, firstName: 'Dev', lastName: 'Kumar', email: 'dev.k@apply.com', academicYear: '2025-2028', status: 'pending' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Sample applications created');

  // ─── 6. Sample Audit Logs ────────────────────────────────────────────────────
  const sampleAuditLogs = [
    {
      actionType: 'INSERT', tableName: 'Student', recordId: 'sample-001',
      newValue: { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav@example.com', status: 'active' },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'New student admission - BCA 2024 batch',
    },
    {
      actionType: 'UPDATE', tableName: 'FeeStructure', recordId: 'sample-002',
      oldValue: { tuitionFee: '45000.00', totalFee: '52000.00', academicYear: '2024-2025' },
      newValue: { tuitionFee: '48000.00', totalFee: '55000.00', academicYear: '2024-2025' },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'Annual fee revision approved by management',
    },
    {
      actionType: 'UPDATE', tableName: 'Application', recordId: 'sample-003',
      oldValue: { status: 'pending', email: 'priya.mehta@example.com' },
      newValue: { status: 'approved', email: 'priya.mehta@example.com' },
      userRole: 'Counselor', ipAddress: '192.168.1.20',
      deviceInfo: 'Mozilla/5.0 Firefox/119 Windows NT 10.0',
      changeReason: 'Application documents verified and approved',
    },
    {
      actionType: 'DELETE', tableName: 'Student', recordId: 'sample-004',
      oldValue: { firstName: 'Ravi', lastName: 'Patil', status: 'dropped', course: 'B.Sc' },
      newValue: null,
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 MacOS',
      changeReason: 'Student officially withdrew from institute',
    },
    {
      actionType: 'INSERT', tableName: 'Course', recordId: 'sample-005',
      newValue: { code: 'BTech', name: 'Bachelor of Technology', durationYears: 4 },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'New course added for academic year 2025',
    },
    {
      actionType: 'UPDATE', tableName: 'Ticket', recordId: 'sample-006',
      oldValue: { status: 'open', priority: 'high' },
      newValue: { status: 'resolved', priority: 'high' },
      userRole: 'Faculty', ipAddress: '10.0.0.15',
      deviceInfo: 'Mozilla/5.0 Safari/17 iPhone iOS 17',
      changeReason: 'Issue resolved by technical team',
    },
    {
      actionType: 'LOGIN', tableName: 'User', recordId: 'sample-007',
      newValue: { email: 'admin@institute.edu', loginTime: new Date().toISOString() },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: null,
    },
  ];

  for (const log of sampleAuditLogs) {
    await prisma.auditLog.create({ data: log });
  }
  console.log('✅ Sample audit logs created');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); })
  .finally(async () => { await prisma.$disconnect(); });
