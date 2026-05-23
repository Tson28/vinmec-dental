/**
 * Fix corrupted Payment records in MongoDB.
 * Run ONCE: node fixCorruptedPayments.js
 * 
 * Fixes:
 * 1. Records with missing invoiceNumber (set from pre-save hook)
 * 2. Records with invalid createdAt ("Invalid Date" stored as string)
 * 3. Records with missing reason field
 */
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vinamec";

async function fix() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;

  // ── 1. Find and fix records with missing invoiceNumber ──────────────────────
  const withoutInvoice = await db
    .collection("payments")
    .find({ invoiceNumber: { $exists: false } })
    .toArray();

  console.log(`\n[1] Records without invoiceNumber: ${withoutInvoice.length}`);

  for (const payment of withoutInvoice) {
    const createdAt = payment.createdAt;
    const year = createdAt instanceof Date ? createdAt.getFullYear() : new Date().getFullYear();
    const month = createdAt instanceof Date ? createdAt.getMonth() + 1 : new Date().getMonth() + 1;

    const count = await db.collection("payments").countDocuments({
      createdAt: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const invoiceNumber = `INV-${year}${String(month).padStart(2, "0")}-${String(count + 1).padStart(4, "0")}`;

    await db.collection("payments").updateOne(
      { _id: payment._id },
      { $set: { invoiceNumber } }
    );
    console.log(`  Fixed _id=${payment._id} → ${invoiceNumber}`);
  }

  // ── 2. Remove records with string "Invalid Date" in createdAt ────────────────
  const invalidDate = await db
    .collection("payments")
    .find({ createdAt: "Invalid Date" })
    .toArray();

  console.log(`\n[2] Records with "Invalid Date": ${invalidDate.length}`);
  if (invalidDate.length > 0) {
    const ids = invalidDate.map((p) => p._id);
    const result = await db.collection("payments").deleteMany({ _id: { $in: ids } });
    console.log(`  Deleted ${result.deletedCount} corrupted records`);
  }

  // ── 3. Add reason field if missing ─────────────────────────────────────────
  const withoutReason = await db
    .collection("payments")
    .find({ reason: { $exists: false } })
    .toArray();

  console.log(`\n[3] Records without reason field: ${withoutReason.length}`);
  if (withoutReason.length > 0) {
    const ids = withoutReason.map((p) => p._id);
    const result = await db.collection("payments").updateMany(
      { _id: { $in: ids } },
      { $set: { reason: "" } }
    );
    console.log(`  Updated ${result.modifiedCount} records`);
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const total = await db.collection("payments").countDocuments();
  console.log(`\n✅ Done! Total payments in DB: ${total}`);

  await mongoose.disconnect();
  process.exit(0);
}

fix().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
