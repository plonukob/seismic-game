// Simple Seismic Encryption Demo
// This script demonstrates the concept of how Seismic encrypts transaction data

console.log("=== Seismic Encrypted Blockchain Demo ===\n");

// Simulate an address and a payment amount
const landlordAddress = "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC";
const rentAmount = 1000;

// Simulate a normal blockchain transaction
console.log("Normal Blockchain Transaction (PUBLIC):");
console.log("---------------------------------------");
console.log(`Sender: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F`);
console.log(`Function: payRent(address landlord, uint256 amount)`);
console.log(`Parameters:`);
console.log(`  - landlord: ${landlordAddress}`);
console.log(`  - amount: ${rentAmount}`);
console.log("---------------------------------------");
console.log("This transaction is VISIBLE to anyone on the blockchain!\n");

// Simulate Seismic encrypted transaction
console.log("Seismic Encrypted Transaction (PRIVATE):");
console.log("---------------------------------------");
console.log(`Sender: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F`);
console.log(`Function: payRent(saddress landlord, suint256 amount)`);
console.log(`Parameters: [encrypted]`);
console.log(`Encrypted Data: 0x7b2276657273696f6e223a312c226369706865727465787473223a5b22356236
38346236353935356237656333353265333766303438623034393033616333303036366232
6166666331383661306232386131643131623831613936225d7d`);
console.log("---------------------------------------");
console.log("The actual recipient and amount are HIDDEN in the encrypted data!\n");

// Explain Seismic encrypted types
console.log("Seismic Special Data Types:");
console.log("------------------------");
console.log("suint/sint - encrypted integers");
console.log("saddress - encrypted Ethereum addresses");
console.log("sbool - encrypted boolean values");
console.log("------------------------");
console.log("Using these types in smart contracts automatically encrypts the data!");

console.log("\nIn a real Seismic application:");
console.log("1. The landlord address would be completely hidden");
console.log("2. The rent amount would be completely hidden");
console.log("3. Only authorized parties would be able to decrypt the data");
console.log("4. The blockchain would still validate the transaction correctly"); 