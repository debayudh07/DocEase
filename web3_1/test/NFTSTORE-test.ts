const { expect } = require("chai");
const { ethers } = require("hardhat");

let NFTSTORE: { marketplaceOwner: () => any; getListingFeePercent: () => any; createToken: (arg0: string, arg1: any) => any; getNFTListing: (arg0: number) => any; updateListingFeePercent: (arg0: number) => any; connect: (arg0: any) => { (): any; new(): any; updateListingFeePercent: { (arg0: number): any; new(): any; }; executeSale: { (arg0: number, arg1: { value: any; }): any; new(): any; }; }; getAllListedNFTs: () => any; getMyNFTs: () => any; };
let owner: { address: any; }, addr1: { address: any; }, addr2;

beforeEach(async function () {
  NFTSTORE = await ethers.deployContract("NFT");
  [owner, addr1, addr2] = await ethers.getSigners();
});

describe("Deployment", function () {
  it("Should set the right owner", async () => {
    const marketplaceOwner = await NFTSTORE.marketplaceOwner();
    expect(marketplaceOwner).to.equal(owner.address);
  });

  it("Should set the listing fee percentage", async function () {
    const listingFeePercentage = await NFTSTORE.getListingFeePercent();
    expect(listingFeePercentage).to.equal(20);
  });
});

describe("Creating NFTs", function () {
  it("Should create a new token and listing", async function () {
    const tokenURI = "https://example.com/nft";
    const price = ethers.parseEther("1");

    await NFTSTORE.createToken(tokenURI, price);

    const listing = await NFTSTORE.getNFTListing(1);
    expect(listing.tokenId).to.equal(1);
    expect(listing.owner).to.equal(owner.address);
    expect(listing.price).to.equal(price);
  });
});

describe("Updating Listing Fee", function () {
  it("Should update the listing fee percentage", async function () {
    await NFTSTORE.updateListingFeePercent(10);
    expect(await NFTSTORE.getListingFeePercent()).to.equal(10);
  });

  it("Should only allow owner to update the listing fee percentage", async function () {
    await expect(
      NFTSTORE.connect(addr1).updateListingFeePercent(10)
    ).to.be.revertedWith("Only owner can call this function");
  });
});



describe("Retrieving NFTs", function () {
  beforeEach(async function () {
    const tokenURI1 = "https://example.com/nft1";
    const tokenURI2 = "https://example.com/nft2";
    const price = ethers.parseEther("1");

    await NFTSTORE.createToken(tokenURI1, price);
    await NFTSTORE.createToken(tokenURI2, price);
  });

  it("Should retrieve all listed NFTs", async function () {
    const allNFTs = await NFTSTORE.getAllListedNFTs();
    expect(allNFTs.length).to.equal(2);
  });

  it("Should retrieve my NFTs", async function () {
    const myNFTs = await NFTSTORE.getMyNFTs();
    expect(myNFTs.length).to.equal(2);
  });
});