// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { artifacts } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const AvaxPrice = await hre.ethers.getContractFactory("AvaxPrice");
  //testnet: 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
  const avaxPrice = await AvaxPrice.deploy("0x5498BB86BC934c8D34FDA08E81D444153d0D06aD");

  await avaxPrice.deployed();
  saveDappFiles(avaxPrice);
  console.log("avaxPrice deployed to:", avaxPrice.address);
}

function saveDappFiles(contract) {
  const fs = require('fs');
  const contractDir = __dirname + '/../frontend/contracts';
  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }
  const addressFileName = contractDir + '/avax-price.json';
  fs.writeFileSync(
    addressFileName,
    JSON.stringify({ Contract: contract.address }, undefined, 2)
  );
  console.log('Stored address in ', addressFileName);
  const ContractArtifact = artifacts.readArtifactSync('AvaxPrice');
  const artifactFileName = contractDir + '/AvaxPrice.json';
  fs.writeFileSync(
    artifactFileName,
    JSON.stringify(ContractArtifact, null, 2)
  );
  console.log('Stored artifact in ', artifactFileName)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
