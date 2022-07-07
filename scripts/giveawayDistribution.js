const hre = require("hardhat");

const NFT = require('./abi/EasyBlockNFT.json')

function sleep(milis) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milis);
}

async function main() {
    // Get account
    const [owner] = await ethers.getSigners();
    // Get contracts
    const nftContract = await hre.ethers.getContractAt(NFT.abi, NFT.address);

    let currentToken = 596;

    async function send(amount, targetAdress) {
        for (let i = 0; i < amount; i++) {
            await nftContract.transferFrom(
                "0xdE6f949cEc8bA92A8D963E9A0065C03753802d14",
                targetAdress,
                currentToken
            );
            console.log("Sending to : ", targetAdress, " ", i, " ", currentToken);
            currentToken++;
            sleep(10000);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


