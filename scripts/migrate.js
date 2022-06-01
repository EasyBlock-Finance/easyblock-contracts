const hre = require("hardhat");

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
    const easyblockContract = await hre.ethers.getContractAt(EASYBLOCK.abi, EASYBLOCK.address);

    async function migrate() {
        const SHARE_HOLDER_COUNT = 2104;
        console.log("Holders: ", SHARE_HOLDER_COUNT);
        let start = 0;
        let end = start + INCREMENT;

        // Migrate
        while(start < SHARE_HOLDER_COUNT) {
            console.log("Migrating: ", start, " -> ", end);
            await easyblockContract.copyFromPrevious(start, end, 100)
            console.log("Migrated: ", start, " -> ", end);

            start += INCREMENT;
            end += INCREMENT;
            if(end > SHARE_HOLDER_COUNT) {
                end = SHARE_HOLDER_COUNT;
            }

            sleep(10000);
        }
    }

    await migrate();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


