const hre = require("hardhat");

const EASYBLOCK = require('./abi/EasyBlock.json')

async function main() {
    const easyblockContract = await hre.ethers.getContractAt(EASYBLOCK.abi, EASYBLOCK.address);

    let endCsv = "";
    let holderCount = await easyblockContract.holderCount();
    for (let i = 0; i < holderCount;) {
        try {
            let holderAddress = await easyblockContract.holders(i);
            let shareCount = await easyblockContract.shareCount(holderAddress);
            let newLine = (i + 1) + "," + holderAddress + "," + shareCount;
            endCsv += newLine;
            console.log(newLine);
            i++;
        } catch (e) {}
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


