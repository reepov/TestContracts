const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", function() {
    let acc1
    let acc2
    let payments

    beforeEach(async function(){
        [acc1, acc2] = await ethers.getSigners()
        const Payments = await ethers.getContractFactory("Payments", acc1)
        payments = await Payments.deploy()
         await payments.deployed()
    })

    it("should be deployed", async function(){
        expect(payments.address).to.be.properAddress
    })

    it("should have 0 ether by default", async function(){
        const balance = await payments.currentBalance()
        expect(balance).to.eq(0)
    })

    it("should be possible to send funds", async function(){
        const transact = await payments.connect(acc2).pay("hello from hardhat", {value: 100})
        await expect(() => transact).to.changeEtherBalances([acc2,payments], [-100, 100])
        await transact.wait()
        const newPayment = await payments.getPayment(acc2.address, 0)
        expect(newPayment.message).to.eq("hello from hardhat")
    })
})