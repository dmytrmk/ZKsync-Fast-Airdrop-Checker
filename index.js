const fs = require('fs');
const colors = require('colors');

// Function to load the eligibility list
function loadEligibilityList(filePath) {
  return new Promise((resolve, reject) => {
    const eligibilitySet = new Map();
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const rows = data.split('\n');
        rows.forEach((row) => {
          const [address, amount] = row.split(',');
          if (address && amount) {
            eligibilitySet.set(address.trim().toLowerCase(), amount.trim());
          }
        });
        resolve(eligibilitySet);
      }
    });
  });
}

// Function to load wallet addresses
function loadWalletAddresses(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const walletAddresses = data.split('\n').map((line) => line.trim());
        resolve(walletAddresses);
      }
    });
  });
}

// Function to check eligibility and log eligible addresses
async function checkEligibility(eligibilityFilePath, walletAddressesFilePath) {
  try {
    const eligibilitySet = await loadEligibilityList(eligibilityFilePath);
    const walletAddresses = await loadWalletAddresses(walletAddressesFilePath);

    walletAddresses.forEach((address) => {
      const lowerAddress = address.toLowerCase();
      if (eligibilitySet.has(lowerAddress)) {
        const amount = eligibilitySet.get(lowerAddress);
        console.log(colors.green(`${address} - Eligible Amount: ${amount}`));
        fs.appendFileSync(
          'eligible_addresses.txt',
          `${address.trim()}\t${amount}\n`
        );
      } else {
        console.log(`${address} is not eligible`);
      }
    });
  } catch (error) {
    console.error(colors.red('Error:'), error);
  }
}

// Paths to your files
const eligibilityFilePath = 'eligibility_list.csv';
const walletAddressesFilePath = 'wallet_addresses.txt';

// Check eligibility
checkEligibility(eligibilityFilePath, walletAddressesFilePath);
