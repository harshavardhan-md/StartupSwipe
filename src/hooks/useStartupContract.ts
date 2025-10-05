import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains'; 

const CONTRACT_ADDRESS = '0x39f41971507d421a211f8ca269eb44f7606a0155';

const ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "startupId", "type": "uint256"}],
    "name": "invest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "startupId", "type": "uint256"}],
    "name": "getStartupCoins",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "startupId", "type": "uint256"}
    ],
    "name": "getUserInvestment",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "startupId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Invested",
    "type": "event"
  }
] as const;

export function useStartupContract() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const investInStartup = async (startupId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'invest',
      args: [BigInt(startupId)],
      chain: sepolia, // Changed to sepolia
    });
  };

  const readStartupCoins = (startupId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getStartupCoins',
      args: [BigInt(startupId)],
      chainId: sepolia.id, // Changed to sepolia.id
    });
  };

  return {
    investInStartup,
    readStartupCoins,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}