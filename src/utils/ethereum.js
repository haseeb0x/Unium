import { BrowserProvider, parseEther } from 'ethers';

export const ETH_PRICE_USD = 3000;

/**
 * Connects MetaMask wallet and returns provider/signer info.
 * @returns {{ address: string, provider: BrowserProvider, signer: object, network: string }}
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it from metamask.io');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  const chainNames = {
    1n: 'Mainnet',
    5n: 'Goerli',
    11155111n: 'Sepolia',
    137n: 'Polygon',
    80001n: 'Mumbai',
    56n: 'BSC',
    43114n: 'Avalanche',
    42161n: 'Arbitrum',
    10n: 'Optimism',
    8453n: 'Base',
    31337n: 'Localhost',
  };

  const networkName = chainNames[network.chainId] || `Chain ${network.chainId}`;

  return { address, provider, signer, network: networkName };
}

/**
 * Sends ETH from signer to toAddress.
 * @param {object} signer - ethers Signer
 * @param {string} toAddress - recipient Ethereum address
 * @param {string} amountEth - amount in ETH (e.g. "0.5")
 * @returns {string} transaction hash
 */
export async function sendPayment(signer, toAddress, amountEth) {
  if (!signer) throw new Error('No wallet signer available. Please connect your wallet.');
  if (!toAddress || toAddress.length < 10) throw new Error('Invalid recipient address.');

  const tx = await signer.sendTransaction({
    to: toAddress,
    value: parseEther(amountEth),
  });

  const receipt = await tx.wait();
  return receipt.hash;
}

/**
 * Formats an Ethereum address to a short display form.
 * @param {string} addr
 * @returns {string} e.g. "0x1234...abcd"
 */
export function formatAddress(addr) {
  if (!addr || addr.length < 10) return addr || '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Converts wei (bigint) to a human-readable ETH string.
 * @param {bigint|string|number} wei
 * @returns {string}
 */
export function weiToEth(wei) {
  const ethValue = Number(BigInt(wei)) / 1e18;
  return ethValue.toFixed(4);
}

/**
 * Converts USD to ETH at the mock fixed rate.
 * @param {number} usd
 * @returns {string} ETH amount rounded to 4 decimal places
 */
export function usdToEth(usd) {
  const eth = usd / ETH_PRICE_USD;
  return eth.toFixed(4);
}

/**
 * Returns the Sepolia Etherscan URL for a transaction hash.
 * @param {string} hash
 * @returns {string}
 */
export function etherscanUrl(hash) {
  return `https://sepolia.etherscan.io/tx/${hash}`;
}
