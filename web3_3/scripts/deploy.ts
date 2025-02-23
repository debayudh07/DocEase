import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

async function main(): Promise<void> {
  try {
    // Get the contract factories for Faucet and Docease
    
    const Docease: ContractFactory = await ethers.getContractFactory("Docease");

    

    console.log("Deploying Docease...");
    // Deploy the Docease contract
    const docease = await Docease.deploy();

    // Get the deployment transaction for Docease
    const doceaseDeploymentTx = docease.deploymentTransaction();
    if (!doceaseDeploymentTx) {
      throw new Error("Docease deployment transaction is null");
    }

    // Wait for the Docease deployment transaction to be mined
    console.log("Waiting for Docease deployment transaction to be mined...");
    const doceaseReceipt = await doceaseDeploymentTx.wait();

    if (doceaseReceipt && doceaseReceipt.contractAddress) {
      console.log("Docease deployed to:", doceaseReceipt.contractAddress);
      console.log("Docease transaction hash:", doceaseDeploymentTx.hash);
    } else {
      throw new Error("Docease deployment failed - no contract address");
    }
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });