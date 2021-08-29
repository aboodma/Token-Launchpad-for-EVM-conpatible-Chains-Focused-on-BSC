import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import { styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import "@ethersproject/shims";
import { ethers } from "ethers";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledButton = withStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

const SaleDetails = ({ id, supply, presale, liquidity, softcap }) => {
  const ts = { textAlign: "left", marginLeft: "10vw" };
  return (
    <div>
      <p style={ts}>Sale ID: {id}</p>
      <p style={ts}>Total Supply: {supply}</p>
      <p style={ts}>Tokens for Presale: {presale}</p>
      <p style={ts}>Tokens for Liquidity: {liquidity}</p>
      <p style={ts}>Softcap: {softcap} ETH</p>
    </div>
  );
};

var provider;
var signer;
var accounts;
//test
async function connect() {
  try {
    await window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    accounts = await provider.send("eth_requestAccounts", []);
  } catch (e) {
    console.log("Could not get a wallet connection");
    return;
  }

  var balance = await provider.getBalance(await signer.getAddress());
  console.log("Account:", await signer.getAddress());

  document.querySelector("#address").textContent = await signer.getAddress();
  document.querySelector("#balance").textContent =
    ethers.utils.formatEther(balance);

  if ((await signer.getChainId()) == 56) {
    console.log("Connected to BSC mainnet");
    document.querySelector("#chain").textContent = "BSC Mainnet";
  } else if ((await signer.getChainId()) == 97) {
    console.log("Connected to BSC testnet");
    document.querySelector("#chain").textContent = "BSC Testnet";
  } else {
    console.log("Unknwonn chain");
    document.querySelector("#chain").textContent = "Unknown chain";
  }

  await AnyTokenConnection();
}

// variable to save the contract object
var AnyTokenContract;
var connectedTokenAddress;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
//*******************************
// HARCODE THE TOKEN ADDRESS HERE
//*******************************

async function AnyTokenConnection() {
  //var input_address = document.querySelector('#token_address_input').value
  //if(input_address == ""){
  //  input_address = "0x46844d25911501ce5436015ee6d2241335ec33e0"
  //}

  var input_address = "0x6d15c15A6a6AcDc357E2d830eCE7e1C8F0378a56";

  console.log("--> CONNECTION TO BEP-20 START...");
  //This is not the real ABI this are just some of the standarts that we need
  const ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];

  //here the contract object is created
  const address = input_address;
  try {
    AnyTokenContract = new ethers.Contract(address, ABI, signer);
    connectedTokenAddress = input_address;
    //Now that we have the contract object and the ABI we can call functions
    const name = await AnyTokenContract.name();
    const symbol = await AnyTokenContract.symbol();
    const decimals = await AnyTokenContract.decimals();
    const balance = ethers.utils.formatEther(
      await AnyTokenContract.balanceOf(await signer.getAddress())
    );
    console.log("Name: ", name);
    console.log("Symbol: ", symbol);
    console.log("Decimals", decimals);
    console.log("Balance", balance);
    document.querySelector(".t_name").textContent = name;
    document.querySelector("#t_symbol").textContent = symbol;
    document.querySelector("#t_decimals").textContent = decimals;
    document.querySelector("#t_balance").textContent = balance;
    console.log("-- fend --");
  } catch (e) {
    console.log(
      "No connection stablished, check wallet connection or token address"
    );
  }
}

// variable to save the contract object
var PreSaleContract;
var PreSaleAddress;
var presaleOpen;
// takes a contract address, creates a contract object and uses it to get the name, decimals, etc
async function PreSaleConnection() {
  var input_address = document.querySelector("#presale_address_input").value;
  if (input_address == "") {
    input_address = "0x13717002fdd408E1969bEE9e5FA0224e76023445";
  }
  console.log("--> CONNECTION TO PRESALE CONTRACT...");
  console.log(input_address);

  //This is not the real ABI this are just some of the standarts that we need
  const ABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_minBNB",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_maxBNB",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "EmergencyWithdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "SeeAddressContribution",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "cap_",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "claimTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "contributions",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount_",
          type: "uint256",
        },
      ],
      name: "depositPreSaleTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "finalize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "isOpen",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "liqTokens",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "liqTokens_",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxBNB",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minBNB",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "moneyRaised",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner_",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "preSaleCompleted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "rate",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "saleTokens",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "seeAllowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "seeBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount_",
          type: "uint256",
        },
      ],
      name: "sendTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "send_BNB_back",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "send_tokens_contribution",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenAddress_",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr_",
          type: "address",
        },
      ],
      name: "tokenAllocation",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "uniswapV2Router",
      outputs: [
        {
          internalType: "contract IUniswapV2Router02",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  try {
    //here the contract object is created
    const address = input_address;
    PreSaleContract = new ethers.Contract(address, ABI, signer);

    //Now that we have the contract object and the ABI we can call functions
    const owner = await PreSaleContract.owner_();
    const bnbRaised = ethers.utils.formatEther(
      await PreSaleContract.moneyRaised()
    );
    const status = await PreSaleContract.preSaleCompleted();
    const tokenAddress = await PreSaleContract.tokenAddress_();
    const minBNB = ethers.utils.formatEther(await PreSaleContract.minBNB());
    const maxBNB = ethers.utils.formatEther(await PreSaleContract.maxBNB());
    const cap = ethers.utils.formatEther(await PreSaleContract.cap_());
    const isOpen = await PreSaleContract.isOpen();
    const myAllocation = ethers.utils.formatEther(
      await PreSaleContract.ftokenAllocation(await signer.getAddress())
    );
    const myContribution = ethers.utils.formatEther(
      await PreSaleContract.SeeAddressContribution(await signer.getAddress())
    );
    console.log("isOpen: ", isOpen);
    console.log("preSaleCompleted: ", status);
    console.log("bnbRaised: ", bnbRaised);
    console.log("cap: ", cap);
    console.log("minBNB: ", minBNB);
    console.log("maxBNB: ", maxBNB);
    console.log("myContribution: ", myContribution);
    console.log("myAllocation: ", myAllocation);
    console.log("tokenAddress: ", tokenAddress);
    console.log("owner: ", owner);

    document.querySelector("#bnbRaised").textContent = bnbRaised;
    document.querySelector("#cap").textContent = cap;
    document.querySelector("#minBNB").textContent = minBNB;
    document.querySelector("#maxBNB").textContent = maxBNB;
    document.querySelector("#myContribution").textContent = myContribution;
    document.querySelector("#myAllocation").textContent = myAllocation;
    presaleOpen = isOpen;

    PreSaleAddress = input_address;

    console.log("-- fend --");
  } catch (e) {
    console.log(
      "No connection stablished, check wallet connection or token/presale address"
    );
    console.log(e);
  }
}

async function disconnectContracts() {
  AnyTokenContract = "";
  PreSaleContract = "";
}

async function depositBNB() {
  //bnb = ethers.utils.parseEther( bnb_ )
  await disconnectContracts();
  await PreSaleConnection();

  var temp_value = document.querySelector("#presale_bnb_input").value;
  console.log(temp_value);
  try {
    console.log(await PreSaleContract.owner_());
    const sent = await PreSaleContract.deposit({
      value: ethers.utils.parseEther(temp_value),
    });
    const receipt = await sent.wait();
    console.log("Status: ", receipt["status"]);
    console.log("Hash: ", receipt["transactionHash"]);
    if (receipt["status"] == 1) {
      document.querySelector("#load_approve").textContent = "Success";
      console.log(":)");
    } else {
      document.querySelector("#load_approve").textContent = "Failed";
    }
  } catch (e) {
    console.log("No deposit done");
    console.log(e);
  }
}

async function claimTokens() {
  await disconnectContracts();
  await PreSaleConnection();

  const sent = await PreSaleContract.claimTokens();
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function approvePreSale() {
  //bnb = ethers.utils.parseEther( bnb_ )
  await disconnectContracts();
  await AnyTokenConnection();

  const sent = await AnyTokenContract.approve(
    PreSaleAddress,
    ethers.BigNumber.from(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    )
  );
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function depositPreSaleTokens_() {
  await disconnectContracts();
  await AnyTokenConnection();

  //bnb = ethers.utils.parseEther( bnb_ )
  var dev_token_balance = await AnyTokenContract.balanceOf(
    await signer.getAddress()
  );
  AnyTokenContract = "";
  PreSaleConnection();
  const sent = await PreSaleContract.depositPreSaleTokens(dev_token_balance);
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function fin() {
  await disconnectContracts();
  await PreSaleConnection();
  //bnb = ethers.utils.parseEther( bnb_ )
  console.log("ADD LIQUIITY...");
  const sent = await PreSaleContract.finalize();
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("From: ", receipt["from"]);
}

async function DeployPresale() {
  disconnectContracts();
  console.log("START PRESALE CONTRACT DEPLOYMENT...");
  //bnb = ethers.utils.parseEther( bnb_ )

  const abi = [
    {
      inputs: [],
      name: "claimTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount_",
          type: "uint256",
        },
      ],
      name: "depositPreSaleTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "EmergencyWithdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "finalize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "send_BNB_back",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "send_tokens_contribution",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount_",
          type: "uint256",
        },
      ],
      name: "sendTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_minBNB",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_maxBNB",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "cap_",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "contributions",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isOpen",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "liqTokens",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "liqTokens_",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxBNB",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minBNB",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "moneyRaised",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner_",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "preSaleCompleted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "saleTokens",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "SeeAddressContribution",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
      ],
      name: "seeAllowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "seeBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenAddress_",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr_",
          type: "address",
        },
      ],
      name: "tokenAllocation",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "uniswapV2Router",
      outputs: [
        {
          internalType: "contract IUniswapV2Router02",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const bytecode = {
    generatedSources: [
      {
        ast: {
          nodeType: "YulBlock",
          src: "0:1634:1",
          statements: [
            {
              body: {
                nodeType: "YulBlock",
                src: "70:80:1",
                statements: [
                  {
                    nodeType: "YulAssignment",
                    src: "80:22:1",
                    value: {
                      arguments: [
                        {
                          name: "offset",
                          nodeType: "YulIdentifier",
                          src: "95:6:1",
                        },
                      ],
                      functionName: {
                        name: "mload",
                        nodeType: "YulIdentifier",
                        src: "89:5:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "89:13:1",
                    },
                    variableNames: [
                      {
                        name: "value",
                        nodeType: "YulIdentifier",
                        src: "80:5:1",
                      },
                    ],
                  },
                  {
                    expression: {
                      arguments: [
                        {
                          name: "value",
                          nodeType: "YulIdentifier",
                          src: "138:5:1",
                        },
                      ],
                      functionName: {
                        name: "validator_revert_t_address",
                        nodeType: "YulIdentifier",
                        src: "111:26:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "111:33:1",
                    },
                    nodeType: "YulExpressionStatement",
                    src: "111:33:1",
                  },
                ],
              },
              name: "abi_decode_t_address_fromMemory",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "offset",
                  nodeType: "YulTypedName",
                  src: "48:6:1",
                  type: "",
                },
                {
                  name: "end",
                  nodeType: "YulTypedName",
                  src: "56:3:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "64:5:1",
                  type: "",
                },
              ],
              src: "7:143:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "219:80:1",
                statements: [
                  {
                    nodeType: "YulAssignment",
                    src: "229:22:1",
                    value: {
                      arguments: [
                        {
                          name: "offset",
                          nodeType: "YulIdentifier",
                          src: "244:6:1",
                        },
                      ],
                      functionName: {
                        name: "mload",
                        nodeType: "YulIdentifier",
                        src: "238:5:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "238:13:1",
                    },
                    variableNames: [
                      {
                        name: "value",
                        nodeType: "YulIdentifier",
                        src: "229:5:1",
                      },
                    ],
                  },
                  {
                    expression: {
                      arguments: [
                        {
                          name: "value",
                          nodeType: "YulIdentifier",
                          src: "287:5:1",
                        },
                      ],
                      functionName: {
                        name: "validator_revert_t_uint256",
                        nodeType: "YulIdentifier",
                        src: "260:26:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "260:33:1",
                    },
                    nodeType: "YulExpressionStatement",
                    src: "260:33:1",
                  },
                ],
              },
              name: "abi_decode_t_uint256_fromMemory",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "offset",
                  nodeType: "YulTypedName",
                  src: "197:6:1",
                  type: "",
                },
                {
                  name: "end",
                  nodeType: "YulTypedName",
                  src: "205:3:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "213:5:1",
                  type: "",
                },
              ],
              src: "156:143:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "433:625:1",
                statements: [
                  {
                    body: {
                      nodeType: "YulBlock",
                      src: "480:16:1",
                      statements: [
                        {
                          expression: {
                            arguments: [
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "489:1:1",
                                type: "",
                                value: "0",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "492:1:1",
                                type: "",
                                value: "0",
                              },
                            ],
                            functionName: {
                              name: "revert",
                              nodeType: "YulIdentifier",
                              src: "482:6:1",
                            },
                            nodeType: "YulFunctionCall",
                            src: "482:12:1",
                          },
                          nodeType: "YulExpressionStatement",
                          src: "482:12:1",
                        },
                      ],
                    },
                    condition: {
                      arguments: [
                        {
                          arguments: [
                            {
                              name: "dataEnd",
                              nodeType: "YulIdentifier",
                              src: "454:7:1",
                            },
                            {
                              name: "headStart",
                              nodeType: "YulIdentifier",
                              src: "463:9:1",
                            },
                          ],
                          functionName: {
                            name: "sub",
                            nodeType: "YulIdentifier",
                            src: "450:3:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "450:23:1",
                        },
                        {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "475:3:1",
                          type: "",
                          value: "128",
                        },
                      ],
                      functionName: {
                        name: "slt",
                        nodeType: "YulIdentifier",
                        src: "446:3:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "446:33:1",
                    },
                    nodeType: "YulIf",
                    src: "443:2:1",
                  },
                  {
                    nodeType: "YulBlock",
                    src: "506:128:1",
                    statements: [
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "521:15:1",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "535:1:1",
                          type: "",
                          value: "0",
                        },
                        variables: [
                          {
                            name: "offset",
                            nodeType: "YulTypedName",
                            src: "525:6:1",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "550:74:1",
                        value: {
                          arguments: [
                            {
                              arguments: [
                                {
                                  name: "headStart",
                                  nodeType: "YulIdentifier",
                                  src: "596:9:1",
                                },
                                {
                                  name: "offset",
                                  nodeType: "YulIdentifier",
                                  src: "607:6:1",
                                },
                              ],
                              functionName: {
                                name: "add",
                                nodeType: "YulIdentifier",
                                src: "592:3:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "592:22:1",
                            },
                            {
                              name: "dataEnd",
                              nodeType: "YulIdentifier",
                              src: "616:7:1",
                            },
                          ],
                          functionName: {
                            name: "abi_decode_t_uint256_fromMemory",
                            nodeType: "YulIdentifier",
                            src: "560:31:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "560:64:1",
                        },
                        variableNames: [
                          {
                            name: "value0",
                            nodeType: "YulIdentifier",
                            src: "550:6:1",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    nodeType: "YulBlock",
                    src: "644:129:1",
                    statements: [
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "659:16:1",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "673:2:1",
                          type: "",
                          value: "32",
                        },
                        variables: [
                          {
                            name: "offset",
                            nodeType: "YulTypedName",
                            src: "663:6:1",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "689:74:1",
                        value: {
                          arguments: [
                            {
                              arguments: [
                                {
                                  name: "headStart",
                                  nodeType: "YulIdentifier",
                                  src: "735:9:1",
                                },
                                {
                                  name: "offset",
                                  nodeType: "YulIdentifier",
                                  src: "746:6:1",
                                },
                              ],
                              functionName: {
                                name: "add",
                                nodeType: "YulIdentifier",
                                src: "731:3:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "731:22:1",
                            },
                            {
                              name: "dataEnd",
                              nodeType: "YulIdentifier",
                              src: "755:7:1",
                            },
                          ],
                          functionName: {
                            name: "abi_decode_t_uint256_fromMemory",
                            nodeType: "YulIdentifier",
                            src: "699:31:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "699:64:1",
                        },
                        variableNames: [
                          {
                            name: "value1",
                            nodeType: "YulIdentifier",
                            src: "689:6:1",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    nodeType: "YulBlock",
                    src: "783:129:1",
                    statements: [
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "798:16:1",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "812:2:1",
                          type: "",
                          value: "64",
                        },
                        variables: [
                          {
                            name: "offset",
                            nodeType: "YulTypedName",
                            src: "802:6:1",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "828:74:1",
                        value: {
                          arguments: [
                            {
                              arguments: [
                                {
                                  name: "headStart",
                                  nodeType: "YulIdentifier",
                                  src: "874:9:1",
                                },
                                {
                                  name: "offset",
                                  nodeType: "YulIdentifier",
                                  src: "885:6:1",
                                },
                              ],
                              functionName: {
                                name: "add",
                                nodeType: "YulIdentifier",
                                src: "870:3:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "870:22:1",
                            },
                            {
                              name: "dataEnd",
                              nodeType: "YulIdentifier",
                              src: "894:7:1",
                            },
                          ],
                          functionName: {
                            name: "abi_decode_t_uint256_fromMemory",
                            nodeType: "YulIdentifier",
                            src: "838:31:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "838:64:1",
                        },
                        variableNames: [
                          {
                            name: "value2",
                            nodeType: "YulIdentifier",
                            src: "828:6:1",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    nodeType: "YulBlock",
                    src: "922:129:1",
                    statements: [
                      {
                        nodeType: "YulVariableDeclaration",
                        src: "937:16:1",
                        value: {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "951:2:1",
                          type: "",
                          value: "96",
                        },
                        variables: [
                          {
                            name: "offset",
                            nodeType: "YulTypedName",
                            src: "941:6:1",
                            type: "",
                          },
                        ],
                      },
                      {
                        nodeType: "YulAssignment",
                        src: "967:74:1",
                        value: {
                          arguments: [
                            {
                              arguments: [
                                {
                                  name: "headStart",
                                  nodeType: "YulIdentifier",
                                  src: "1013:9:1",
                                },
                                {
                                  name: "offset",
                                  nodeType: "YulIdentifier",
                                  src: "1024:6:1",
                                },
                              ],
                              functionName: {
                                name: "add",
                                nodeType: "YulIdentifier",
                                src: "1009:3:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "1009:22:1",
                            },
                            {
                              name: "dataEnd",
                              nodeType: "YulIdentifier",
                              src: "1033:7:1",
                            },
                          ],
                          functionName: {
                            name: "abi_decode_t_address_fromMemory",
                            nodeType: "YulIdentifier",
                            src: "977:31:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "977:64:1",
                        },
                        variableNames: [
                          {
                            name: "value3",
                            nodeType: "YulIdentifier",
                            src: "967:6:1",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              name: "abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "headStart",
                  nodeType: "YulTypedName",
                  src: "379:9:1",
                  type: "",
                },
                {
                  name: "dataEnd",
                  nodeType: "YulTypedName",
                  src: "390:7:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "value0",
                  nodeType: "YulTypedName",
                  src: "402:6:1",
                  type: "",
                },
                {
                  name: "value1",
                  nodeType: "YulTypedName",
                  src: "410:6:1",
                  type: "",
                },
                {
                  name: "value2",
                  nodeType: "YulTypedName",
                  src: "418:6:1",
                  type: "",
                },
                {
                  name: "value3",
                  nodeType: "YulTypedName",
                  src: "426:6:1",
                  type: "",
                },
              ],
              src: "305:753:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "1109:51:1",
                statements: [
                  {
                    nodeType: "YulAssignment",
                    src: "1119:35:1",
                    value: {
                      arguments: [
                        {
                          name: "value",
                          nodeType: "YulIdentifier",
                          src: "1148:5:1",
                        },
                      ],
                      functionName: {
                        name: "cleanup_t_uint160",
                        nodeType: "YulIdentifier",
                        src: "1130:17:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "1130:24:1",
                    },
                    variableNames: [
                      {
                        name: "cleaned",
                        nodeType: "YulIdentifier",
                        src: "1119:7:1",
                      },
                    ],
                  },
                ],
              },
              name: "cleanup_t_address",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "1091:5:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "cleaned",
                  nodeType: "YulTypedName",
                  src: "1101:7:1",
                  type: "",
                },
              ],
              src: "1064:96:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "1211:81:1",
                statements: [
                  {
                    nodeType: "YulAssignment",
                    src: "1221:65:1",
                    value: {
                      arguments: [
                        {
                          name: "value",
                          nodeType: "YulIdentifier",
                          src: "1236:5:1",
                        },
                        {
                          kind: "number",
                          nodeType: "YulLiteral",
                          src: "1243:42:1",
                          type: "",
                          value: "0xffffffffffffffffffffffffffffffffffffffff",
                        },
                      ],
                      functionName: {
                        name: "and",
                        nodeType: "YulIdentifier",
                        src: "1232:3:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "1232:54:1",
                    },
                    variableNames: [
                      {
                        name: "cleaned",
                        nodeType: "YulIdentifier",
                        src: "1221:7:1",
                      },
                    ],
                  },
                ],
              },
              name: "cleanup_t_uint160",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "1193:5:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "cleaned",
                  nodeType: "YulTypedName",
                  src: "1203:7:1",
                  type: "",
                },
              ],
              src: "1166:126:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "1343:32:1",
                statements: [
                  {
                    nodeType: "YulAssignment",
                    src: "1353:16:1",
                    value: {
                      name: "value",
                      nodeType: "YulIdentifier",
                      src: "1364:5:1",
                    },
                    variableNames: [
                      {
                        name: "cleaned",
                        nodeType: "YulIdentifier",
                        src: "1353:7:1",
                      },
                    ],
                  },
                ],
              },
              name: "cleanup_t_uint256",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "1325:5:1",
                  type: "",
                },
              ],
              returnVariables: [
                {
                  name: "cleaned",
                  nodeType: "YulTypedName",
                  src: "1335:7:1",
                  type: "",
                },
              ],
              src: "1298:77:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "1424:79:1",
                statements: [
                  {
                    body: {
                      nodeType: "YulBlock",
                      src: "1481:16:1",
                      statements: [
                        {
                          expression: {
                            arguments: [
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "1490:1:1",
                                type: "",
                                value: "0",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "1493:1:1",
                                type: "",
                                value: "0",
                              },
                            ],
                            functionName: {
                              name: "revert",
                              nodeType: "YulIdentifier",
                              src: "1483:6:1",
                            },
                            nodeType: "YulFunctionCall",
                            src: "1483:12:1",
                          },
                          nodeType: "YulExpressionStatement",
                          src: "1483:12:1",
                        },
                      ],
                    },
                    condition: {
                      arguments: [
                        {
                          arguments: [
                            {
                              name: "value",
                              nodeType: "YulIdentifier",
                              src: "1447:5:1",
                            },
                            {
                              arguments: [
                                {
                                  name: "value",
                                  nodeType: "YulIdentifier",
                                  src: "1472:5:1",
                                },
                              ],
                              functionName: {
                                name: "cleanup_t_address",
                                nodeType: "YulIdentifier",
                                src: "1454:17:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "1454:24:1",
                            },
                          ],
                          functionName: {
                            name: "eq",
                            nodeType: "YulIdentifier",
                            src: "1444:2:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1444:35:1",
                        },
                      ],
                      functionName: {
                        name: "iszero",
                        nodeType: "YulIdentifier",
                        src: "1437:6:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "1437:43:1",
                    },
                    nodeType: "YulIf",
                    src: "1434:2:1",
                  },
                ],
              },
              name: "validator_revert_t_address",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "1417:5:1",
                  type: "",
                },
              ],
              src: "1381:122:1",
            },
            {
              body: {
                nodeType: "YulBlock",
                src: "1552:79:1",
                statements: [
                  {
                    body: {
                      nodeType: "YulBlock",
                      src: "1609:16:1",
                      statements: [
                        {
                          expression: {
                            arguments: [
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "1618:1:1",
                                type: "",
                                value: "0",
                              },
                              {
                                kind: "number",
                                nodeType: "YulLiteral",
                                src: "1621:1:1",
                                type: "",
                                value: "0",
                              },
                            ],
                            functionName: {
                              name: "revert",
                              nodeType: "YulIdentifier",
                              src: "1611:6:1",
                            },
                            nodeType: "YulFunctionCall",
                            src: "1611:12:1",
                          },
                          nodeType: "YulExpressionStatement",
                          src: "1611:12:1",
                        },
                      ],
                    },
                    condition: {
                      arguments: [
                        {
                          arguments: [
                            {
                              name: "value",
                              nodeType: "YulIdentifier",
                              src: "1575:5:1",
                            },
                            {
                              arguments: [
                                {
                                  name: "value",
                                  nodeType: "YulIdentifier",
                                  src: "1600:5:1",
                                },
                              ],
                              functionName: {
                                name: "cleanup_t_uint256",
                                nodeType: "YulIdentifier",
                                src: "1582:17:1",
                              },
                              nodeType: "YulFunctionCall",
                              src: "1582:24:1",
                            },
                          ],
                          functionName: {
                            name: "eq",
                            nodeType: "YulIdentifier",
                            src: "1572:2:1",
                          },
                          nodeType: "YulFunctionCall",
                          src: "1572:35:1",
                        },
                      ],
                      functionName: {
                        name: "iszero",
                        nodeType: "YulIdentifier",
                        src: "1565:6:1",
                      },
                      nodeType: "YulFunctionCall",
                      src: "1565:43:1",
                    },
                    nodeType: "YulIf",
                    src: "1562:2:1",
                  },
                ],
              },
              name: "validator_revert_t_uint256",
              nodeType: "YulFunctionDefinition",
              parameters: [
                {
                  name: "value",
                  nodeType: "YulTypedName",
                  src: "1545:5:1",
                  type: "",
                },
              ],
              src: "1509:122:1",
            },
          ],
        },
        contents:
          "{\n\n    function abi_decode_t_address_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_address(value)\n    }\n\n    function abi_decode_t_uint256_fromMemory(offset, end) -> value {\n        value := mload(offset)\n        validator_revert_t_uint256(value)\n    }\n\n    function abi_decode_tuple_t_uint256t_uint256t_uint256t_address_fromMemory(headStart, dataEnd) -> value0, value1, value2, value3 {\n        if slt(sub(dataEnd, headStart), 128) { revert(0, 0) }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 32\n\n            value1 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 64\n\n            value2 := abi_decode_t_uint256_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := 96\n\n            value3 := abi_decode_t_address_fromMemory(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function validator_revert_t_address(value) {\n        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }\n    }\n\n    function validator_revert_t_uint256(value) {\n        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }\n    }\n\n}\n",
        id: 1,
        language: "Yul",
        name: "#utility.yul",
      },
    ],
    linkReferences: {},
    object:
      "6101206040526000600360006101000a81548160ff0219169083151502179055506000600360016101000a81548160ff02191690831515021790555060006006553480156200004d57600080fd5b50604051620025dc380380620025dc833981810160405281019062000073919062000186565b8360a081815250508260c081815250508160e081815250508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b8152505073d99d1c33f9fc3444f8101754abc46c52416550d173ffffffffffffffffffffffffffffffffffffffff166101008173ffffffffffffffffffffffffffffffffffffffff1660601b81525050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000264565b600081519050620001698162000230565b92915050565b60008151905062000180816200024a565b92915050565b600080600080608085870312156200019d57600080fd5b6000620001ad878288016200016f565b9450506020620001c0878288016200016f565b9350506040620001d3878288016200016f565b9250506060620001e68782880162000158565b91505092959194509250565b6000620001ff8262000206565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6200023b81620001f2565b81146200024757600080fd5b50565b620002558162000226565b81146200026157600080fd5b50565b60805160601c60a05160c05160e0516101005160601c6122af6200032d600039600081816107730152818161177401526118060152600081816107990152611154015260008181610aa501526110f101526000818161071b015281816108400152818161122001526112880152600081816105b7015281816106650152818161074d0152818161089a0152818161094801528181610acb01528181610bbe01528181610c9401528181610d9801528181610e4601528181611738015261184301526122af6000f3fe6080604052600436106101815760003560e01c80634b0b945e116100d15780639136a5ec1161008a578063cc6a1a0611610064578063cc6a1a0614610552578063d0e30db014610569578063d33aa8e514610573578063e76630791461058a57610181565b80639136a5ec146104d357806392ab244214610510578063b0b9603b1461052757610181565b80634b0b945e146103d55780634bb278f314610400578063517311ea14610417578063521886b3146104425780638aeb87071461046b5780638da5cb5b146104a857610181565b80634123fec71161013e578063440e1e6911610118578063440e1e691461031957806347535d7b1461035657806348c54b9d14610381578063490035511461039857610181565b80634123fec71461028657806342e94c90146102b157806343248084146102ee57610181565b806305ab421d1461018657806307fb363a146101af5780630d056513146101da57806310051089146102055780631694505e146102305780631e377df01461025b575b600080fd5b34801561019257600080fd5b506101ad60048036038101906101a891906119bc565b6105b5565b005b3480156101bb57600080fd5b506101c4610717565b6040516101d19190611e55565b60405180910390f35b3480156101e657600080fd5b506101ef61073f565b6040516101fc9190611e55565b60405180910390f35b34801561021157600080fd5b5061021a610749565b6040516102279190611c3a565b60405180910390f35b34801561023c57600080fd5b50610245610771565b6040516102529190611d5a565b60405180910390f35b34801561026757600080fd5b50610270610795565b60405161027d9190611e55565b60405180910390f35b34801561029257600080fd5b5061029b6107bd565b6040516102a89190611e55565b60405180910390f35b3480156102bd57600080fd5b506102d860048036038101906102d39190611993565b6107c3565b6040516102e59190611e55565b60405180910390f35b3480156102fa57600080fd5b506103036107db565b6040516103109190611d3f565b60405180910390f35b34801561032557600080fd5b50610340600480360381019061033b9190611993565b6107f2565b60405161034d9190611e55565b60405180910390f35b34801561036257600080fd5b5061036b610874565b6040516103789190611d3f565b60405180910390f35b34801561038d57600080fd5b5061039661088b565b005b3480156103a457600080fd5b506103bf60048036038101906103ba9190611993565b610a3e565b6040516103cc9190611e55565b60405180910390f35b3480156103e157600080fd5b506103ea610a87565b6040516103f79190611e55565b60405180910390f35b34801561040c57600080fd5b50610415610a91565b005b34801561042357600080fd5b5061042c610aa1565b6040516104399190611e55565b60405180910390f35b34801561044e57600080fd5b5061046960048036038101906104649190611a21565b610ac9565b005b34801561047757600080fd5b50610492600480360381019061048d9190611993565b610bba565b60405161049f9190611e55565b60405180910390f35b3480156104b457600080fd5b506104bd610c6c565b6040516104ca9190611c3a565b60405180910390f35b3480156104df57600080fd5b506104fa60048036038101906104f59190611993565b610c90565b6040516105079190611e55565b60405180910390f35b34801561051c57600080fd5b50610525610d44565b005b34801561053357600080fd5b5061053c610f85565b6040516105499190611e55565b60405180910390f35b34801561055e57600080fd5b50610567610f8b565b005b6105716110ef565b005b34801561057f57600080fd5b50610588611458565b005b34801561059657600080fd5b5061059f6116e1565b6040516105ac9190611c3a565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610610929190611cb5565b602060405180830381600087803b15801561062a57600080fd5b505af115801561063e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066291906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b81526004016106c093929190611c7e565b602060405180830381600087803b1580156106da57600080fd5b505af11580156106ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071291906119f8565b505050565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6000600454905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b60045481565b60076020528060005260406000206000915090505481565b6000600360009054906101000a900460ff16905090565b600080610869600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546108646005547f000000000000000000000000000000000000000000000000000000000000000061170a565b611720565b905080915050919050565b6000600360019054906101000a900460ff16905090565b6000610896336107f2565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b81526004016108f3929190611cb5565b602060405180830381600087803b15801561090d57600080fd5b505af1158015610921573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094591906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3033846040518463ffffffff1660e01b81526004016109a393929190611c7e565b602060405180830381600087803b1580156109bd57600080fd5b505af11580156109d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109f591906119f8565b506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600254905090565b610a9f600454600254611736565b565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401610b2693929190611c7e565b602060405180830381600087803b158015610b4057600080fd5b505af1158015610b54573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b7891906119f8565b506001600360016101000a81548160ff021916908315150217905550610b9f81600261170a565b600481905550610bb181600454611902565b60058190555050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b8152600401610c159190611c3a565b60206040518083038186803b158015610c2d57600080fd5b505afa158015610c41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c659190611a4a565b9050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e83306040518363ffffffff1660e01b8152600401610ced929190611c55565b60206040518083038186803b158015610d0557600080fd5b505afa158015610d19573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3d9190611a4a565b9050919050565b60005b600654811015610f825760006008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000610d94826107f2565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b330836040518363ffffffff1660e01b8152600401610df1929190611cb5565b602060405180830381600087803b158015610e0b57600080fd5b505af1158015610e1f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e4391906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3084846040518463ffffffff1660e01b8152600401610ea193929190611c7e565b602060405180830381600087803b158015610ebb57600080fd5b505af1158015610ecf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ef391906119f8565b506008600084815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905550508080610f7a9061201f565b915050610d47565b50565b60055481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611019576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161101090611db5565b60405180910390fd5b600047905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161106590611c25565b60006040518083038185875af1925050503d80600081146110a2576040519150601f19603f3d011682016040523d82523d6000602084013e6110a7565b606091505b50509050806110eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110e290611d75565b60405180910390fd5b5050565b7f0000000000000000000000000000000000000000000000000000000000000000341015611152576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114990611e35565b60405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000003411156111b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111ac90611dd5565b60405180910390fd5b600360009054906101000a900460ff1615611205576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111fc90611d95565b60405180910390fd5b34600260008282546112179190611e8c565b925050819055507f00000000000000000000000000000000000000000000000000000000000000006002541115611283576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127a90611e15565b60405180910390fd5b6112ac7f0000000000000000000000000000000000000000000000000000000000000000611918565b600254106112d0576001600360006101000a81548160ff0219169083151502179055505b6000805b60065481101561135d573373ffffffffffffffffffffffffffffffffffffffff166008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561134a57600191505b80806113559061201f565b9150506112d4565b5060001515811515146113a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139c90611df5565b60405180910390fd5b3360086000600654815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600660008154809291906114509061201f565b919050555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114dd90611db5565b60405180910390fd5b60005b6006548110156116c35760006008600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008273ffffffffffffffffffffffffffffffffffffffff168260405161159590611c25565b60006040518083038185875af1925050503d80600081146115d2576040519150601f19603f3d011682016040523d82523d6000602084013e6115d7565b606091505b505090508061161b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161161290611d75565b60405180910390fd5b816002600082825461162d9190611f6d565b925050819055506008600085815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000905550505080806116bb9061201f565b9150506114e9565b506000600360006101000a81548160ff021916908315150217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600081836117189190611ee2565b905092915050565b6000818361172e9190611f13565b905092915050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000846040518363ffffffff1660e01b81526004016117b1929190611cb5565b602060405180830381600087803b1580156117cb57600080fd5b505af11580156117df573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061180391906119f8565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f305d719827f00000000000000000000000000000000000000000000000000000000000000008560008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16426040518863ffffffff1660e01b81526004016118a996959493929190611cde565b6060604051808303818588803b1580156118c257600080fd5b505af11580156118d6573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906118fb9190611a73565b5050505050565b600081836119109190611f6d565b905092915050565b600080606483606361192a9190611f13565b6119349190611ee2565b905080915050919050565b60008135905061194e81612234565b92915050565b6000815190506119638161224b565b92915050565b60008135905061197881612262565b92915050565b60008151905061198d81612262565b92915050565b6000602082840312156119a557600080fd5b60006119b38482850161193f565b91505092915050565b600080604083850312156119cf57600080fd5b60006119dd8582860161193f565b92505060206119ee85828601611969565b9150509250929050565b600060208284031215611a0a57600080fd5b6000611a1884828501611954565b91505092915050565b600060208284031215611a3357600080fd5b6000611a4184828501611969565b91505092915050565b600060208284031215611a5c57600080fd5b6000611a6a8482850161197e565b91505092915050565b600080600060608486031215611a8857600080fd5b6000611a968682870161197e565b9350506020611aa78682870161197e565b9250506040611ab88682870161197e565b9150509250925092565b611acb81611fa1565b82525050565b611ada81611fb3565b82525050565b611ae981611fe9565b82525050565b611af88161200d565b82525050565b6000611b0b601483611e7b565b9150611b16826120c6565b602082019050919050565b6000611b2e601683611e7b565b9150611b39826120ef565b602082019050919050565b6000611b51600983611e7b565b9150611b5c82612118565b602082019050919050565b6000611b74600083611e70565b9150611b7f82612141565b600082019050919050565b6000611b97601883611e7b565b9150611ba282612144565b602082019050919050565b6000611bba602b83611e7b565b9150611bc58261216d565b604082019050919050565b6000611bdd602783611e7b565b9150611be8826121bc565b604082019050919050565b6000611c00601a83611e7b565b9150611c0b8261220b565b602082019050919050565b611c1f81611fdf565b82525050565b6000611c3082611b67565b9150819050919050565b6000602082019050611c4f6000830184611ac2565b92915050565b6000604082019050611c6a6000830185611ac2565b611c776020830184611ac2565b9392505050565b6000606082019050611c936000830186611ac2565b611ca06020830185611ac2565b611cad6040830184611c16565b949350505050565b6000604082019050611cca6000830185611ac2565b611cd76020830184611c16565b9392505050565b600060c082019050611cf36000830189611ac2565b611d006020830188611c16565b611d0d6040830187611aef565b611d1a6060830186611aef565b611d276080830185611ac2565b611d3460a0830184611c16565b979650505050505050565b6000602082019050611d546000830184611ad1565b92915050565b6000602082019050611d6f6000830184611ae0565b92915050565b60006020820190508181036000830152611d8e81611afe565b9050919050565b60006020820190508181036000830152611dae81611b21565b9050919050565b60006020820190508181036000830152611dce81611b44565b9050919050565b60006020820190508181036000830152611dee81611b8a565b9050919050565b60006020820190508181036000830152611e0e81611bad565b9050919050565b60006020820190508181036000830152611e2e81611bd0565b9050919050565b60006020820190508181036000830152611e4e81611bf3565b9050919050565b6000602082019050611e6a6000830184611c16565b92915050565b600081905092915050565b600082825260208201905092915050565b6000611e9782611fdf565b9150611ea283611fdf565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611ed757611ed6612068565b5b828201905092915050565b6000611eed82611fdf565b9150611ef883611fdf565b925082611f0857611f07612097565b5b828204905092915050565b6000611f1e82611fdf565b9150611f2983611fdf565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611f6257611f61612068565b5b828202905092915050565b6000611f7882611fdf565b9150611f8383611fdf565b925082821015611f9657611f95612068565b5b828203905092915050565b6000611fac82611fbf565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611ff482611ffb565b9050919050565b600061200682611fbf565b9050919050565b600061201882611fdf565b9050919050565b600061202a82611fdf565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561205d5761205c612068565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b7f43617020697320616c7265616479207265616368656400000000000000000000600082015250565b7f4e6f74206f776e65720000000000000000000000000000000000000000000000600082015250565b50565b7f4465706f7369742056616c756520697320546f6f204269670000000000000000600082015250565b7f596f75206861766520616c726561647920636f6e747269627574656420746f2060008201527f7468652070726573616c65000000000000000000000000000000000000000000602082015250565b7f52657665727465643a20424e42206465706f73697420776f756c6420676f206f60008201527f7665722063617000000000000000000000000000000000000000000000000000602082015250565b7f4465706f7369742056616c756520697320546f6f20536d616c6c000000000000600082015250565b61223d81611fa1565b811461224857600080fd5b50565b61225481611fb3565b811461225f57600080fd5b50565b61226b81611fdf565b811461227657600080fd5b5056fea2646970667358221220933f762d1d9d93a4033c07371249870670d73dece0ad782563a18b27a5679e4664736f6c63430008030033",
    opcodes:
      "PUSH2 0x120 PUSH1 0x40 MSTORE PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH1 0x0 PUSH1 0x6 SSTORE CALLVALUE DUP1 ISZERO PUSH3 0x4D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH3 0x25DC CODESIZE SUB DUP1 PUSH3 0x25DC DUP4 CODECOPY DUP2 DUP2 ADD PUSH1 0x40 MSTORE DUP2 ADD SWAP1 PUSH3 0x73 SWAP2 SWAP1 PUSH3 0x186 JUMP JUMPDEST DUP4 PUSH1 0xA0 DUP2 DUP2 MSTORE POP POP DUP3 PUSH1 0xC0 DUP2 DUP2 MSTORE POP POP DUP2 PUSH1 0xE0 DUP2 DUP2 MSTORE POP POP DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x80 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP PUSH20 0xD99D1C33F9FC3444F8101754ABC46C52416550D1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x100 DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x60 SHL DUP2 MSTORE POP POP CALLER PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP POP POP POP POP PUSH3 0x264 JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x169 DUP2 PUSH3 0x230 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH3 0x180 DUP2 PUSH3 0x24A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x80 DUP6 DUP8 SUB SLT ISZERO PUSH3 0x19D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH3 0x1AD DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP5 POP POP PUSH1 0x20 PUSH3 0x1C0 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP4 POP POP PUSH1 0x40 PUSH3 0x1D3 DUP8 DUP3 DUP9 ADD PUSH3 0x16F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x60 PUSH3 0x1E6 DUP8 DUP3 DUP9 ADD PUSH3 0x158 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 SWAP2 SWAP5 POP SWAP3 POP JUMP JUMPDEST PUSH1 0x0 PUSH3 0x1FF DUP3 PUSH3 0x206 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH3 0x23B DUP2 PUSH3 0x1F2 JUMP JUMPDEST DUP2 EQ PUSH3 0x247 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH3 0x255 DUP2 PUSH3 0x226 JUMP JUMPDEST DUP2 EQ PUSH3 0x261 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x80 MLOAD PUSH1 0x60 SHR PUSH1 0xA0 MLOAD PUSH1 0xC0 MLOAD PUSH1 0xE0 MLOAD PUSH2 0x100 MLOAD PUSH1 0x60 SHR PUSH2 0x22AF PUSH3 0x32D PUSH1 0x0 CODECOPY PUSH1 0x0 DUP2 DUP2 PUSH2 0x773 ADD MSTORE DUP2 DUP2 PUSH2 0x1774 ADD MSTORE PUSH2 0x1806 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x799 ADD MSTORE PUSH2 0x1154 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0xAA5 ADD MSTORE PUSH2 0x10F1 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x71B ADD MSTORE DUP2 DUP2 PUSH2 0x840 ADD MSTORE DUP2 DUP2 PUSH2 0x1220 ADD MSTORE PUSH2 0x1288 ADD MSTORE PUSH1 0x0 DUP2 DUP2 PUSH2 0x5B7 ADD MSTORE DUP2 DUP2 PUSH2 0x665 ADD MSTORE DUP2 DUP2 PUSH2 0x74D ADD MSTORE DUP2 DUP2 PUSH2 0x89A ADD MSTORE DUP2 DUP2 PUSH2 0x948 ADD MSTORE DUP2 DUP2 PUSH2 0xACB ADD MSTORE DUP2 DUP2 PUSH2 0xBBE ADD MSTORE DUP2 DUP2 PUSH2 0xC94 ADD MSTORE DUP2 DUP2 PUSH2 0xD98 ADD MSTORE DUP2 DUP2 PUSH2 0xE46 ADD MSTORE DUP2 DUP2 PUSH2 0x1738 ADD MSTORE PUSH2 0x1843 ADD MSTORE PUSH2 0x22AF PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x181 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x4B0B945E GT PUSH2 0xD1 JUMPI DUP1 PUSH4 0x9136A5EC GT PUSH2 0x8A JUMPI DUP1 PUSH4 0xCC6A1A06 GT PUSH2 0x64 JUMPI DUP1 PUSH4 0xCC6A1A06 EQ PUSH2 0x552 JUMPI DUP1 PUSH4 0xD0E30DB0 EQ PUSH2 0x569 JUMPI DUP1 PUSH4 0xD33AA8E5 EQ PUSH2 0x573 JUMPI DUP1 PUSH4 0xE7663079 EQ PUSH2 0x58A JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x9136A5EC EQ PUSH2 0x4D3 JUMPI DUP1 PUSH4 0x92AB2442 EQ PUSH2 0x510 JUMPI DUP1 PUSH4 0xB0B9603B EQ PUSH2 0x527 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4B0B945E EQ PUSH2 0x3D5 JUMPI DUP1 PUSH4 0x4BB278F3 EQ PUSH2 0x400 JUMPI DUP1 PUSH4 0x517311EA EQ PUSH2 0x417 JUMPI DUP1 PUSH4 0x521886B3 EQ PUSH2 0x442 JUMPI DUP1 PUSH4 0x8AEB8707 EQ PUSH2 0x46B JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x4A8 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 GT PUSH2 0x13E JUMPI DUP1 PUSH4 0x440E1E69 GT PUSH2 0x118 JUMPI DUP1 PUSH4 0x440E1E69 EQ PUSH2 0x319 JUMPI DUP1 PUSH4 0x47535D7B EQ PUSH2 0x356 JUMPI DUP1 PUSH4 0x48C54B9D EQ PUSH2 0x381 JUMPI DUP1 PUSH4 0x49003551 EQ PUSH2 0x398 JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x4123FEC7 EQ PUSH2 0x286 JUMPI DUP1 PUSH4 0x42E94C90 EQ PUSH2 0x2B1 JUMPI DUP1 PUSH4 0x43248084 EQ PUSH2 0x2EE JUMPI PUSH2 0x181 JUMP JUMPDEST DUP1 PUSH4 0x5AB421D EQ PUSH2 0x186 JUMPI DUP1 PUSH4 0x7FB363A EQ PUSH2 0x1AF JUMPI DUP1 PUSH4 0xD056513 EQ PUSH2 0x1DA JUMPI DUP1 PUSH4 0x10051089 EQ PUSH2 0x205 JUMPI DUP1 PUSH4 0x1694505E EQ PUSH2 0x230 JUMPI DUP1 PUSH4 0x1E377DF0 EQ PUSH2 0x25B JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x192 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1AD PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1A8 SWAP2 SWAP1 PUSH2 0x19BC JUMP JUMPDEST PUSH2 0x5B5 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1BB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1C4 PUSH2 0x717 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1D1 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1E6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1EF PUSH2 0x73F JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1FC SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x211 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x21A PUSH2 0x749 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x227 SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x23C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x245 PUSH2 0x771 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x252 SWAP2 SWAP1 PUSH2 0x1D5A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x267 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x270 PUSH2 0x795 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x27D SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x292 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x29B PUSH2 0x7BD JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2A8 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2BD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x2D8 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x2D3 SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0x7C3 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x2E5 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x2FA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x303 PUSH2 0x7DB JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x310 SWAP2 SWAP1 PUSH2 0x1D3F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x325 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x340 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x33B SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0x7F2 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x34D SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x362 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x36B PUSH2 0x874 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x378 SWAP2 SWAP1 PUSH2 0x1D3F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x38D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x396 PUSH2 0x88B JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3A4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3BF PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x3BA SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xA3E JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3CC SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x3E1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x3EA PUSH2 0xA87 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x3F7 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x40C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x415 PUSH2 0xA91 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x423 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x42C PUSH2 0xAA1 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x439 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x44E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x469 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x464 SWAP2 SWAP1 PUSH2 0x1A21 JUMP JUMPDEST PUSH2 0xAC9 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x477 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x492 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x48D SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xBBA JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x49F SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4B4 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4BD PUSH2 0xC6C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x4CA SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4DF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x4FA PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x4F5 SWAP2 SWAP1 PUSH2 0x1993 JUMP JUMPDEST PUSH2 0xC90 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x507 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x51C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x525 PUSH2 0xD44 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x533 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x53C PUSH2 0xF85 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x549 SWAP2 SWAP1 PUSH2 0x1E55 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x55E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x567 PUSH2 0xF8B JUMP JUMPDEST STOP JUMPDEST PUSH2 0x571 PUSH2 0x10EF JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x57F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x588 PUSH2 0x1458 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x596 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x59F PUSH2 0x16E1 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x5AC SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x610 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x62A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x63E JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x662 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x6C0 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x6DA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x6EE JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x712 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x4 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x4 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x7 PUSH1 0x20 MSTORE DUP1 PUSH1 0x0 MSTORE PUSH1 0x40 PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP2 POP SWAP1 POP SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH2 0x869 PUSH1 0x7 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD PUSH2 0x864 PUSH1 0x5 SLOAD PUSH32 0x0 PUSH2 0x170A JUMP JUMPDEST PUSH2 0x1720 JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH2 0x896 CALLER PUSH2 0x7F2 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8F3 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x90D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x921 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x945 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS CALLER DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x9A3 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x9BD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x9D1 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x9F5 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x2 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0xA9F PUSH1 0x4 SLOAD PUSH1 0x2 SLOAD PUSH2 0x1736 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD CALLER ADDRESS DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xB26 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xB40 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xB54 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xB78 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP PUSH2 0xB9F DUP2 PUSH1 0x2 PUSH2 0x170A JUMP JUMPDEST PUSH1 0x4 DUP2 SWAP1 SSTORE POP PUSH2 0xBB1 DUP2 PUSH1 0x4 SLOAD PUSH2 0x1902 JUMP JUMPDEST PUSH1 0x5 DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x70A08231 DUP4 PUSH1 0x40 MLOAD DUP3 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xC15 SWAP2 SWAP1 PUSH2 0x1C3A JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xC2D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xC41 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xC65 SWAP2 SWAP1 PUSH2 0x1A4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xDD62ED3E DUP4 ADDRESS PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xCED SWAP3 SWAP2 SWAP1 PUSH2 0x1C55 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP7 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xD05 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS STATICCALL ISZERO DUP1 ISZERO PUSH2 0xD19 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xD3D SWAP2 SWAP1 PUSH2 0x1A4A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0xF82 JUMPI PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH2 0xD94 DUP3 PUSH2 0x7F2 JUMP JUMPDEST SWAP1 POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 ADDRESS DUP4 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xDF1 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xE0B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xE1F JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xE43 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x23B872DD ADDRESS DUP5 DUP5 PUSH1 0x40 MLOAD DUP5 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xEA1 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1C7E JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0xEBB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0xECF JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0xEF3 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH1 0x8 PUSH1 0x0 DUP5 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP DUP1 DUP1 PUSH2 0xF7A SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0xD47 JUMP JUMPDEST POP JUMP JUMPDEST PUSH1 0x5 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x1019 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1010 SWAP1 PUSH2 0x1DB5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 SELFBALANCE SWAP1 POP PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1065 SWAP1 PUSH2 0x1C25 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x10A2 JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x10A7 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x10EB JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x10E2 SWAP1 PUSH2 0x1D75 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP POP JUMP JUMPDEST PUSH32 0x0 CALLVALUE LT ISZERO PUSH2 0x1152 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1149 SWAP1 PUSH2 0x1E35 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH32 0x0 CALLVALUE GT ISZERO PUSH2 0x11B5 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x11AC SWAP1 PUSH2 0x1DD5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND ISZERO PUSH2 0x1205 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x11FC SWAP1 PUSH2 0x1D95 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLVALUE PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x1217 SWAP2 SWAP1 PUSH2 0x1E8C JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH32 0x0 PUSH1 0x2 SLOAD GT ISZERO PUSH2 0x1283 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x127A SWAP1 PUSH2 0x1E15 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x12AC PUSH32 0x0 PUSH2 0x1918 JUMP JUMPDEST PUSH1 0x2 SLOAD LT PUSH2 0x12D0 JUMPI PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMPDEST PUSH1 0x0 DUP1 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x135D JUMPI CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x134A JUMPI PUSH1 0x1 SWAP2 POP JUMPDEST DUP1 DUP1 PUSH2 0x1355 SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0x12D4 JUMP JUMPDEST POP PUSH1 0x0 ISZERO ISZERO DUP2 ISZERO ISZERO EQ PUSH2 0x13A5 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x139C SWAP1 PUSH2 0x1DF5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x8 PUSH1 0x0 PUSH1 0x6 SLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP CALLVALUE PUSH1 0x7 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP PUSH1 0x6 PUSH1 0x0 DUP2 SLOAD DUP1 SWAP3 SWAP2 SWAP1 PUSH2 0x1450 SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 SWAP1 POP SSTORE POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x14E6 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x14DD SWAP1 PUSH2 0x1DB5 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 JUMPDEST PUSH1 0x6 SLOAD DUP2 LT ISZERO PUSH2 0x16C3 JUMPI PUSH1 0x0 PUSH1 0x8 PUSH1 0x0 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP PUSH1 0x0 PUSH1 0x7 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP PUSH1 0x0 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH1 0x40 MLOAD PUSH2 0x1595 SWAP1 PUSH2 0x1C25 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP8 GAS CALL SWAP3 POP POP POP RETURNDATASIZE DUP1 PUSH1 0x0 DUP2 EQ PUSH2 0x15D2 JUMPI PUSH1 0x40 MLOAD SWAP2 POP PUSH1 0x1F NOT PUSH1 0x3F RETURNDATASIZE ADD AND DUP3 ADD PUSH1 0x40 MSTORE RETURNDATASIZE DUP3 MSTORE RETURNDATASIZE PUSH1 0x0 PUSH1 0x20 DUP5 ADD RETURNDATACOPY PUSH2 0x15D7 JUMP JUMPDEST PUSH1 0x60 SWAP2 POP JUMPDEST POP POP SWAP1 POP DUP1 PUSH2 0x161B JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1612 SWAP1 PUSH2 0x1D75 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 PUSH1 0x2 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x162D SWAP2 SWAP1 PUSH2 0x1F6D JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP PUSH1 0x8 PUSH1 0x0 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD SWAP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 SSTORE PUSH1 0x7 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SSTORE POP POP POP DUP1 DUP1 PUSH2 0x16BB SWAP1 PUSH2 0x201F JUMP JUMPDEST SWAP2 POP POP PUSH2 0x14E9 JUMP JUMPDEST POP PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x1718 SWAP2 SWAP1 PUSH2 0x1EE2 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x172E SWAP2 SWAP1 PUSH2 0x1F13 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0x95EA7B3 PUSH32 0x0 DUP5 PUSH1 0x40 MLOAD DUP4 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x17B1 SWAP3 SWAP2 SWAP1 PUSH2 0x1CB5 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x17CB JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x17DF JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x1803 SWAP2 SWAP1 PUSH2 0x19F8 JUMP JUMPDEST POP PUSH32 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF305D719 DUP3 PUSH32 0x0 DUP6 PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND TIMESTAMP PUSH1 0x40 MLOAD DUP9 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x18A9 SWAP7 SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x1CDE JUMP JUMPDEST PUSH1 0x60 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP1 EXTCODESIZE ISZERO DUP1 ISZERO PUSH2 0x18C2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP GAS CALL ISZERO DUP1 ISZERO PUSH2 0x18D6 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x18FB SWAP2 SWAP1 PUSH2 0x1A73 JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 DUP4 PUSH2 0x1910 SWAP2 SWAP1 PUSH2 0x1F6D JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x64 DUP4 PUSH1 0x63 PUSH2 0x192A SWAP2 SWAP1 PUSH2 0x1F13 JUMP JUMPDEST PUSH2 0x1934 SWAP2 SWAP1 PUSH2 0x1EE2 JUMP JUMPDEST SWAP1 POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x194E DUP2 PUSH2 0x2234 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x1963 DUP2 PUSH2 0x224B JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1978 DUP2 PUSH2 0x2262 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x198D DUP2 PUSH2 0x2262 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x19A5 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x19B3 DUP5 DUP3 DUP6 ADD PUSH2 0x193F JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x19CF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x19DD DUP6 DUP3 DUP7 ADD PUSH2 0x193F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x19EE DUP6 DUP3 DUP7 ADD PUSH2 0x1969 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A0A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A18 DUP5 DUP3 DUP6 ADD PUSH2 0x1954 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A33 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A41 DUP5 DUP3 DUP6 ADD PUSH2 0x1969 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x1A5C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A6A DUP5 DUP3 DUP6 ADD PUSH2 0x197E JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1A88 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1A96 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x1AA7 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x1AB8 DUP7 DUP3 DUP8 ADD PUSH2 0x197E JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH2 0x1ACB DUP2 PUSH2 0x1FA1 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1ADA DUP2 PUSH2 0x1FB3 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1AE9 DUP2 PUSH2 0x1FE9 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH2 0x1AF8 DUP2 PUSH2 0x200D JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B0B PUSH1 0x14 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B16 DUP3 PUSH2 0x20C6 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B2E PUSH1 0x16 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B39 DUP3 PUSH2 0x20EF JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B51 PUSH1 0x9 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1B5C DUP3 PUSH2 0x2118 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B74 PUSH1 0x0 DUP4 PUSH2 0x1E70 JUMP JUMPDEST SWAP2 POP PUSH2 0x1B7F DUP3 PUSH2 0x2141 JUMP JUMPDEST PUSH1 0x0 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B97 PUSH1 0x18 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BA2 DUP3 PUSH2 0x2144 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1BBA PUSH1 0x2B DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BC5 DUP3 PUSH2 0x216D JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1BDD PUSH1 0x27 DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1BE8 DUP3 PUSH2 0x21BC JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C00 PUSH1 0x1A DUP4 PUSH2 0x1E7B JUMP JUMPDEST SWAP2 POP PUSH2 0x1C0B DUP3 PUSH2 0x220B JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1C1F DUP2 PUSH2 0x1FDF JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1C30 DUP3 PUSH2 0x1B67 JUMP JUMPDEST SWAP2 POP DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1C4F PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AC2 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1C6A PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1C77 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1AC2 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x60 DUP3 ADD SWAP1 POP PUSH2 0x1C93 PUSH1 0x0 DUP4 ADD DUP7 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CA0 PUSH1 0x20 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CAD PUSH1 0x40 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP5 SWAP4 POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x1CCA PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1CD7 PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xC0 DUP3 ADD SWAP1 POP PUSH2 0x1CF3 PUSH1 0x0 DUP4 ADD DUP10 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1D00 PUSH1 0x20 DUP4 ADD DUP9 PUSH2 0x1C16 JUMP JUMPDEST PUSH2 0x1D0D PUSH1 0x40 DUP4 ADD DUP8 PUSH2 0x1AEF JUMP JUMPDEST PUSH2 0x1D1A PUSH1 0x60 DUP4 ADD DUP7 PUSH2 0x1AEF JUMP JUMPDEST PUSH2 0x1D27 PUSH1 0x80 DUP4 ADD DUP6 PUSH2 0x1AC2 JUMP JUMPDEST PUSH2 0x1D34 PUSH1 0xA0 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP8 SWAP7 POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1D54 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AD1 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1D6F PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1AE0 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1D8E DUP2 PUSH2 0x1AFE JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DAE DUP2 PUSH2 0x1B21 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DCE DUP2 PUSH2 0x1B44 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1DEE DUP2 PUSH2 0x1B8A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E0E DUP2 PUSH2 0x1BAD JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E2E DUP2 PUSH2 0x1BD0 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1E4E DUP2 PUSH2 0x1BF3 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1E6A PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1C16 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1E97 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1EA2 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0x1ED7 JUMPI PUSH2 0x1ED6 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1EED DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1EF8 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 PUSH2 0x1F08 JUMPI PUSH2 0x1F07 PUSH2 0x2097 JUMP JUMPDEST JUMPDEST DUP3 DUP3 DIV SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F1E DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1F29 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP2 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DIV DUP4 GT DUP3 ISZERO ISZERO AND ISZERO PUSH2 0x1F62 JUMPI PUSH2 0x1F61 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 MUL SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F78 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH2 0x1F83 DUP4 PUSH2 0x1FDF JUMP JUMPDEST SWAP3 POP DUP3 DUP3 LT ISZERO PUSH2 0x1F96 JUMPI PUSH2 0x1F95 PUSH2 0x2068 JUMP JUMPDEST JUMPDEST DUP3 DUP3 SUB SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1FAC DUP3 PUSH2 0x1FBF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1FF4 DUP3 PUSH2 0x1FFB JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2006 DUP3 PUSH2 0x1FBF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2018 DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x202A DUP3 PUSH2 0x1FDF JUMP JUMPDEST SWAP2 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 EQ ISZERO PUSH2 0x205D JUMPI PUSH2 0x205C PUSH2 0x2068 JUMP JUMPDEST JUMPDEST PUSH1 0x1 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x12 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4661696C656420746F2073656E64204574686572000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x43617020697320616C7265616479207265616368656400000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4E6F74206F776E65720000000000000000000000000000000000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F204269670000000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x596F75206861766520616C726561647920636F6E747269627574656420746F20 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7468652070726573616C65000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x52657665727465643A20424E42206465706F73697420776F756C6420676F206F PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7665722063617000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH32 0x4465706F7369742056616C756520697320546F6F20536D616C6C000000000000 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH2 0x223D DUP2 PUSH2 0x1FA1 JUMP JUMPDEST DUP2 EQ PUSH2 0x2248 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x2254 DUP2 PUSH2 0x1FB3 JUMP JUMPDEST DUP2 EQ PUSH2 0x225F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH2 0x226B DUP2 PUSH2 0x1FDF JUMP JUMPDEST DUP2 EQ PUSH2 0x2276 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 SWAP4 EXTCODEHASH PUSH23 0x2D1D9D93A4033C07371249870670D73DECE0AD782563A1 DUP12 0x27 0xA5 PUSH8 0x9E4664736F6C6343 STOP ADDMOD SUB STOP CALLER ",
    sourceMap:
      "5514:7622:0:-:0;;;5893:5;5867:31;;;;;;;;;;;;;;;;;;;;5924:5;5904:25;;;;;;;;;;;;;;;;;;;;6190:1;6164:27;;6360:335;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;6451:4;6445:10;;;;;;6486:7;6465:28;;;;;;6524:7;6503:28;;;;;;6556:13;6541:28;;;;;;;;;;;;6617:42;6579:81;;;;;;;;;;;;6678:10;6670:5;;:18;;;;;;;;;;;;;;;;;;6360:335;;;;5514:7622;;7:143:1;;95:6;89:13;80:22;;111:33;138:5;111:33;:::i;:::-;70:80;;;;:::o;156:143::-;;244:6;238:13;229:22;;260:33;287:5;260:33;:::i;:::-;219:80;;;;:::o;305:753::-;;;;;475:3;463:9;454:7;450:23;446:33;443:2;;;492:1;489;482:12;443:2;535:1;560:64;616:7;607:6;596:9;592:22;560:64;:::i;:::-;550:74;;506:128;673:2;699:64;755:7;746:6;735:9;731:22;699:64;:::i;:::-;689:74;;644:129;812:2;838:64;894:7;885:6;874:9;870:22;838:64;:::i;:::-;828:74;;783:129;951:2;977:64;1033:7;1024:6;1013:9;1009:22;977:64;:::i;:::-;967:74;;922:129;433:625;;;;;;;:::o;1064:96::-;;1130:24;1148:5;1130:24;:::i;:::-;1119:35;;1109:51;;;:::o;1166:126::-;;1243:42;1236:5;1232:54;1221:65;;1211:81;;;:::o;1298:77::-;;1364:5;1353:16;;1343:32;;;:::o;1381:122::-;1454:24;1472:5;1454:24;:::i;:::-;1447:5;1444:35;1434:2;;1493:1;1490;1483:12;1434:2;1424:79;:::o;1509:122::-;1582:24;1600:5;1582:24;:::i;:::-;1575:5;1572:35;1562:2;;1621:1;1618;1611:12;1562:2;1552:79;:::o;5514:7622:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
  };
  if (connectedTokenAddress == null) {
    console.log("Not connected to a BEP-20 Token, NO PRESALE DEPLOYED");
    return;
  }

  // The factory we use for deploying contracts
  let factory = new ethers.ContractFactory(abi, bytecode, signer);

  // Deploy an instance of the contract

  //it takes cap, minbnb, maxbnb, token address
  console.log("Using Token address: " + connectedTokenAddress);
  let contract = await factory.deploy(
    ethers.BigNumber.from("1000000000000000000"),
    ethers.BigNumber.from("100000000000000000"),
    ethers.BigNumber.from("900000000000000000"),
    connectedTokenAddress
  );

  // The address is available immediately, but the contract
  // is NOT deployed yet
  console.log(contract.address);

  const receipt = await contract.deployTransaction.wait();
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
}

var pancake_factory;
async function addLiquidity() {
  //bnb = ethers.utils.parseEther( bnb_ )

  const tx = {
    from: signer.getAddress(),
    nonce: signer.getTransactionCount("latest"),
    gasPrice: 10500000000,
    gasLimit: 5000000,
  };

  const sent = await AnyTokenContract.approve(
    "0xfd1e8c5942d1cb264b1734d3d9b007c31013e399",
    ethers.BigNumber.from(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    )
  );
  document.querySelector("#load_approve").textContent = "Processing";
  const receipt = await sent.wait();
  console.log("Receipt: ", receipt);
  console.log("Status: ", receipt["status"]);
  console.log("Hash: ", receipt["transactionHash"]);
  console.log("Payer: ", receipt["from"]);
  if (receipt["status"] == 1) {
    document.querySelector("#load_approve").textContent = "Success";
    console.log(":)");
  } else {
    document.querySelector("#load_approve").textContent = "Failed";
  }
}

const MainContent = ({ title, subtitle, logo }) => {
  return (
    <div style={{ height: "845px" }}>
      <h2>{title}</h2>
      <p style={{ fontStyle: "italic" }}>{subtitle}</p>

      <Button
        onClick={connect}
        variant="contained"
        color="primary"
        disableElevation
      >
        Connect Wallet
      </Button>
      <br/> <br/>
      <div class="wallet-info">
        Address: <span id="address">-</span> <br />
        Balance: <span id="balance">0</span> BNB <br />
        Chain: <span id="chain">-</span>
      </div>
      <h5>Token details:</h5>
      <p>
        Name: <span class="t_name">-</span> <br />
        Symbol: <span id="t_symbol">-</span>
      </p>

      <h5>Developer Zone:</h5>
      <Button
        onClick={DeployPresale}
        variant="contained"
        color="primary"
        disableElevation
      >
        deploy
      </Button>

      <Button
        onClick={approvePreSale}
        variant="contained"
        color="primary"
        disableElevation
      >
        APPROVE
      </Button>
      <p></p>
      <Button
        onClick={depositPreSaleTokens_}
        variant="contained"
        color="primary"
        disableElevation
      >
        DEPOSIT TOKENS
      </Button>
      <p></p>

      <div class="presale-info">
        <h5>User Zone:</h5>
        <input id="presale_address_input"></input>
        <br /> <br />
        <Button
          onClick={PreSaleConnection}
          variant="contained"
          color="primary"
          disableElevation
        >
          Connect to presale
        </Button>
        <br />
        <br />
        <p>
          Total BNB Raised: <span id="bnbRaised">0</span> BNB
        </p>
        <p>
          BNB Cap: <span id="cap">0</span> BNB
        </p>
        <p>
          Min BNB Contribution: <span id="minBNB">0</span> BNB
        </p>
        <p>
          Max BNB Contribution: <span id="maxBNB">0</span> BNB
        </p>
        <p>
          My BNB Contribution: <span id="myContribution">0</span> BNB
        </p>
        <p>
          My Token Allocation: <span id="myAllocation">0</span>
          <span class="t_name"></span>
        </p>
        <p>
          BNB Cap: <span id="cap">0</span> BNB
        </p>
        <input id="presale_bnb_input"></input>
      </div>
      <br />
      <Button
        onClick={depositBNB}
        variant="contained"
        color="primary"
        disableElevation
      >
        Contribute BNB
      </Button>
      <p></p>
      <Button
        onClick={claimTokens}
        variant="contained"
        color="primary"
        disableElevation
      >
        Claim Tokens
      </Button>
      <Button
        onClick={fin}
        variant="contained"
        color="primary"
        disableElevation
      >
        Finalize
      </Button>

      <p>
        <span id="load_approve"></span>
      </p>
    </div>
  );
};

const WarnItem = ({ title, text }) => {
  const textStyle = { textAlign: "left" };
  const headStyle = { textAlign: "left", color: "red" };
  return (
    <>
      <h3 style={headStyle}>{title}</h3>
      <p style={textStyle}>{text}</p>
    </>
  );
};

const Warnings = () => {
  return (
    <div style={{ height: "845px" }}>
      <h1>Warnings</h1>
      <WarnItem
        title="Soft Cap Warning"
        text="The soft cap of this sale is very low."
      />
      <WarnItem
        title="Token Dump Warning"
        text="Too many tokens are held outside this sale. Make sure these tokens are burned, locked or the owner has a valid reason to hold them. Tokens held by teams can be sold to pull out liquidity and should be carefully examined."
      />
      <WarnItem
        title="Liquidity Percentage Warning"
        text="This sale has a very low liquidity percentage."
      />
      <WarnItem
        title="Sale Endtime Warning"
        text="The end time for this sale is longer than 2 hours."
      />
      <WarnItem
        title="Max Contribution Warning"
        text="This sale has a very high maximum contribution ratio to hardcap allotment. A few users might be able to buy large portions of the supply."
      />
    </div>
  );
};

const LeftPanel = () => {
  return (
    <Grid item sm={3} xs={12}>
      <Item>
        <Warnings />
      </Item>
    </Grid>
  );
};

const CenterPanel = () => {
  return (
    <Grid item sm={6} xs={12}>
      <Item>
        <MainContent
          title="Presale "
        />
      </Item>
    </Grid>
  );
};

const RightPanel = () => {
  return (
    <Grid item sm={3} xs={12}>
      <Item>
        <img src="disqus.png" alt="disqus comments" />
      </Item>
    </Grid>
  );
};

function BasicGrid() {
  return (
    <div style={{ marginTop: "3vh", backgroundColor: "gray" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </Grid>
      </Box>
    </div>
  );
}

export default BasicGrid;
