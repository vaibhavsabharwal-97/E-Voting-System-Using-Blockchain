import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/Constant";

export const TransactionContext = React.createContext();

// Safely check if window.ethereum exists
const ethereum = typeof window !== 'undefined' && window.ethereum ? window.ethereum : null;

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [showVoteOverlay, setShowVoteOverlay] = useState(false);
  const [voteData, setVoteData] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(!!ethereum);
  }, []);

  const createEthereumContract = () => {
    try {
      if (!ethereum) {
        console.error("MetaMask is not installed");
        return null;
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return transactionContract;
    } catch (error) {
      console.error("Error creating ethereum contract:", error);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        console.warn("MetaMask is not installed");
        return null;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        return accounts[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };

  const sendTransaction = async (election_id, candidate_id, user_id) => {
    try {
      if (!ethereum) {
        console.warn("MetaMask is not installed");
        return { valid: false, mess: "MetaMask is not installed" };
      }
      
      // Show the vote overlay before any blockchain interaction
      setShowVoteOverlay(true);
      setVoteData({
        electionId: election_id,
        candidateId: candidate_id,
        userId: user_id
      });
      
      const transactionsContract = createEthereumContract();
      
      if (!transactionsContract) {
        setShowVoteOverlay(false);
        setVoteData(null);
        return { valid: false, mess: "Failed to create Ethereum contract" };
      }

      try {
        // Add a small delay to ensure the overlay is visible
        await new Promise(resolve => setTimeout(resolve, 100));

        const transactionHash = await transactionsContract.addToBlockchain(
          currentAccount,
          user_id,
          election_id,
          candidate_id
        );

        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);

        const transactionsCount = await transactionsContract.getTransactionCount();
        console.log(transactionsCount);

        return { valid: true, mess: "Transaction Successful" };
      } catch (error) {
        throw error;
      } finally {
        // Add a small delay before hiding the overlay
        setTimeout(() => {
          setShowVoteOverlay(false);
          setVoteData(null);
        }, 500);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      
      // Add a small delay before hiding the overlay
      setTimeout(() => {
        setShowVoteOverlay(false);
        setVoteData(null);
      }, 500);
      
      if (error.code === "ACTION_REJECTED") {
        return { valid: false, mess: "User Rejected Transaction" };
      } else {
        return { valid: false, mess: "Internal Send Transaction Error" };
      }
    }
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) {
        console.warn("MetaMask is not installed");
        return [];
      }
      
      const transactionsContract = createEthereumContract();
      
      if (!transactionsContract) {
        console.error("Failed to create Ethereum contract");
        return [];
      }

      const availableTransactions =
        await transactionsContract.getAllTransaction();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressFrom: transaction.from,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          election_id: transaction.election_id,
          candidate_id: transaction.candidate_id,
          user_id: transaction.user_id,
        })
      );

      setTransactions(structuredTransactions);
      return structuredTransactions;
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  };

  return (
    <>
      <TransactionContext.Provider
        value={{
          connectWallet,
          currentAccount,
          sendTransaction,
          getAllTransactions,
          transactions,
          isMetaMaskInstalled,
          showVoteOverlay,
          voteData
        }}
      >
        {children}
      </TransactionContext.Provider>
    </>
  );
};
