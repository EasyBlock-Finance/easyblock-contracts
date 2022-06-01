const hre = require("hardhat");

const USDC = require('./abi/Usdc.json')
const EASYBLOCK = require('./abi/EasyBlock.json')
const SPOOKY = require('./abi/Spooky.json')
const WETH = require('./abi/Weth.json')


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
    const easyblockContract = await hre.ethers.getContractAt(EASYBLOCK.abi, EASYBLOCK.address);
    const spookyContract = await hre.ethers.getContractAt(SPOOKY.abi, SPOOKY.address);
    const wethContract = await hre.ethers.getContractAt(WETH.abi, WETH.address);

    // WITHDRAW AND BRIDGE FLOW START
    async function withdrawToManager() {
        console.log("Before Withdraw: ", await usdcContract.balanceOf(owner.address), " $USDC")
        await easyblockContract.withdrawToManager();
        sleep(30000);
    }

    async function convertTowETH(amount, slippage) {
        let conversionPath = ["0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", "0x74b23882a30290451A17c44f4F05243b6b58C76d"]
        // Get desired amount
        // let amountsOut = await Spooky.getAmountsOut(amount, conversionPath)
        // let minWethAmount = amountsOut[2]*(100-slippage)/100;
        // Get time
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        const deadline = timestampBefore + 3000;
        // Exchange
        await spookyContract.swapExactTokensForTokens(amount, 0, conversionPath, owner.address, deadline)
        sleep(30000)
    }

    async function bridgeToETH(amount) {
        await wethContract.Swapout(amount, owner.address);
        console.log("Swapout sent.")
    }

    async function withdrawAndTransferToEth() {
        // Get money
        await withdrawToManager();
        // Exchange
        let usdcAmount = await usdcContract.balanceOf(owner.address);
        console.log("USDC Balance: ", usdcAmount, " $USDC");
        await convertTowETH(usdcAmount, 1);
        // Bridge
        let wethBalance = await wethContract.balanceOf(owner.address);
        console.log("Weth Balance: ", wethBalance);
        await bridgeToETH(wethBalance);
    }
    // WITHDRAW AND BRIDGE FLOW END
    // await withdrawAndTransferToEth()

    await easyblockContract.withdrawToManager();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


