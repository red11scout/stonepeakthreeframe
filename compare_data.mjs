import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get all companies from database
  const [rows] = await connection.execute('SELECT * FROM companies ORDER BY id');
  
  console.log(`Database has ${rows.length} companies\n`);
  
  // Load Excel source data
  const excelData = JSON.parse(fs.readFileSync('/home/ubuntu/excel_source_data.json', 'utf8'));
  console.log(`Excel has ${excelData.length} companies\n`);
  
  // Compare company names
  console.log('=== Company Name Comparison ===');
  const dbNames = rows.map(r => r.companyName);
  const excelNames = excelData.map(e => e.companyName);
  
  // Find missing in DB
  const missingInDb = excelNames.filter(n => !dbNames.includes(n));
  if (missingInDb.length > 0) {
    console.log('\nMissing in Database:');
    missingInDb.forEach(n => console.log(`  - ${n}`));
  }
  
  // Find extra in DB
  const extraInDb = dbNames.filter(n => !excelNames.includes(n));
  if (extraInDb.length > 0) {
    console.log('\nExtra in Database (not in Excel):');
    extraInDb.forEach(n => console.log(`  - ${n}`));
  }
  
  // Compare data for matching companies
  console.log('\n=== Data Discrepancies ===');
  let discrepancies = 0;
  
  for (const excel of excelData) {
    const db = rows.find(r => r.companyName === excel.companyName);
    if (!db) continue;
    
    const issues = [];
    
    // Compare input scores
    if (Math.abs(Number(db.ebitdaImpact) - excel.ebitdaImpact) > 0.01) {
      issues.push(`ebitdaImpact: DB=${db.ebitdaImpact} vs Excel=${excel.ebitdaImpact}`);
    }
    if (Math.abs(Number(db.revenueEnablement) - excel.revenueEnablement) > 0.01) {
      issues.push(`revenueEnablement: DB=${db.revenueEnablement} vs Excel=${excel.revenueEnablement}`);
    }
    if (Math.abs(Number(db.riskReduction) - excel.riskReduction) > 0.01) {
      issues.push(`riskReduction: DB=${db.riskReduction} vs Excel=${excel.riskReduction}`);
    }
    if (Math.abs(Number(db.organizationalCapacity) - excel.organizationalCapacity) > 0.01) {
      issues.push(`organizationalCapacity: DB=${db.organizationalCapacity} vs Excel=${excel.organizationalCapacity}`);
    }
    if (Math.abs(Number(db.dataAvailability) - excel.dataAvailability) > 0.01) {
      issues.push(`dataAvailability: DB=${db.dataAvailability} vs Excel=${excel.dataAvailability}`);
    }
    if (Math.abs(Number(db.techInfrastructure) - excel.techInfrastructure) > 0.01) {
      issues.push(`techInfrastructure: DB=${db.techInfrastructure} vs Excel=${excel.techInfrastructure}`);
    }
    if (Math.abs(Number(db.timelineFit) - excel.timelineFit) > 0.01) {
      issues.push(`timelineFit: DB=${db.timelineFit} vs Excel=${excel.timelineFit}`);
    }
    
    // Compare calculated scores
    if (Math.abs(Number(db.valueScore) - excel.valueScore) > 0.1) {
      issues.push(`valueScore: DB=${db.valueScore} vs Excel=${excel.valueScore}`);
    }
    if (Math.abs(Number(db.readinessScore) - excel.readinessScore) > 0.1) {
      issues.push(`readinessScore: DB=${db.readinessScore} vs Excel=${excel.readinessScore}`);
    }
    if (Math.abs(Number(db.priorityScore) - excel.priorityScore) > 0.1) {
      issues.push(`priorityScore: DB=${db.priorityScore} vs Excel=${excel.priorityScore}`);
    }
    
    // Compare EBITDA
    if (Math.abs(Number(db.ebitda) - excel.ebitda) > 1000) {
      issues.push(`ebitda: DB=${db.ebitda} vs Excel=${excel.ebitda}`);
    }
    
    if (issues.length > 0) {
      discrepancies++;
      console.log(`\n${excel.companyName}:`);
      issues.forEach(i => console.log(`  - ${i}`));
    }
  }
  
  console.log(`\n\nTotal discrepancies found: ${discrepancies} companies`);
  
  await connection.end();
}

main().catch(console.error);
