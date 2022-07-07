const hre = require("hardhat");

const USDC = require('./abi/Usdc.json')
const EASYBLOCK_DISTRIBUTOR = require('./abi/EasyBlockDistributor.json')
const EASYBLOCK = require('./abi/EasyBlock.json')

const INCREMENT = 50;

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
    const usdcContract = await hre.ethers.getContractAt(USDC.abi, USDC.address);
    const easyblockDistributorContract = await hre.ethers.getContractAt(EASYBLOCK_DISTRIBUTOR.abi, EASYBLOCK_DISTRIBUTOR.address);
    const easyblockContract = await hre.ethers.getContractAt(EASYBLOCK.abi, EASYBLOCK.address);

    async function distribute(amount) {
        amount = amount * 1000000
        console.log("Amount in net USDC: ", amount)
        sleep(10000)
        // const SHARE_HOLDER_COUNT = await easyblockContract.holderCount();
        const SHARE_HOLDER_COUNT = await easyblockContract.holderCount();
        console.log("Holders: ", SHARE_HOLDER_COUNT);
        let start = 1900;
        let end = start + INCREMENT;

        // Give the approval
        await usdcContract.approve(easyblockDistributorContract.address, amount);
        sleep(10000);
        // Disable buy shares
        await easyblockContract.toggleSharePurchaseEnabled(false);
        sleep(10000);
        // Distribute
        while(start < SHARE_HOLDER_COUNT) {
            console.log("Distributing: ", start, " -> ", end);
            await easyblockDistributorContract.distribute(start, end, amount, USDC.address)
            console.log("Distributed: ", start, " -> ", end);

            start += INCREMENT;
            end += INCREMENT;
            if(end > SHARE_HOLDER_COUNT) {
                end = SHARE_HOLDER_COUNT;
            }

            sleep(30000);
        }
    }

    await distribute(2297);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


