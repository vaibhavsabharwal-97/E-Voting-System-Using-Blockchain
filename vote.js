const { ethers } = require("ethers");
const { contractABI } = require("./constant.js");

// Check command line arguments
if (process.argv.length !== 4) {
    console.log("Usage: node vote.js <electionId> <candidateName>");
    process.exit(1);
}

const electionId = process.argv[2];
const candidateName = process.argv[3];

// Contract address
const contractAddress = "0xeAb179B1c758549e284035b517A3A01bD41C5099";

async function vote() {
    try {
        // Connect to Ganache
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:1337");
        
        // Create wallet instance
        const privateKey = "0x05b5b26d0c5fff8117d32922e464fc93106d6d1b5485cb5c7cf6bae9b619321c";
        const wallet = new ethers.Wallet(privateKey, provider);

        // Create contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Send vote transaction
        const tx = await contract.vote(electionId, candidateName);
        console.log("Transaction hash:", tx.hash);

        // Wait for transaction to be mined
        await tx.wait();
        console.log("✅ Vote confirmed!");

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

// Execute the vote function
vote(); 