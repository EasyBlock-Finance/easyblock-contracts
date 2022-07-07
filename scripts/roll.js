const hre = require("hardhat");

const ROLL = require('./abi/roll.json')

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
    const rollContract = await hre.ethers.getContractAt(ROLL.abi, ROLL.address);

    async function roll(amount, maxNumber) {
        for(let i = 0; i < amount; i++) {
            await rollContract.prepareRandom();
            console.log("Start Rolling: ", i);
            sleep(30000);
            await rollContract.roll(maxNumber);
            console.log("Rolled: ", i);
            sleep(30000);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


