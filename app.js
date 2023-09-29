import express from "express";
import { Web3 } from "web3";
import "dotenv/config";
import { CeramicClient } from "@ceramicnetwork/http-client";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { fromString } from "uint8arrays/from-string";
import CeramicContext from "./scripts/index.mjs";

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_URL = process.env.NODE_URL;
const web3 = new Web3(NODE_URL);

const composeClient = CeramicContext.composeClient;

const ceramic = new CeramicClient("http://localhost:7007");

//authenticate developer DID in order to create a write transaction
const authenticateDID = async (seed) => {
  const key = fromString(seed, "base16");
  const provider = new Ed25519Provider(key);
  const staticDid = new DID({
    resolver: KeyResolver.getResolver(),
    provider,
  });
  await staticDid.authenticate();
  ceramic.did = staticDid;
  return staticDid;
};

async function getTransferDetails(events) {
  for (let i = 0; i < events.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(i);
    const event = events[i];
    const query = await composeClient.executeQuery(`
    mutation {
      createVote(input: {
        content: {
          voter: "${"did:pkh:eip155:1:" + event.returnValues.voter}",
          support: ${event.returnValues.support},
        }
      }) 
      {
        document {
          id
          voter{
            id
          }
          support
        }
      }
    }
      `);
    console.log(query.data.createVote.document.voter.id);
  }

  const newQ = await composeClient.executeQuery(`
    query{
      voteIndex(first: 10){
        edges{
          node{
            id
          }
        }
      }
    }
  `);
  console.log(newQ.data.voteIndex.edges[0].node.id);
}

async function getJSON(address) {
  const abi = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`
  )
    .then((response) => response.json())
    .then((data) => data);
  let contractABI = "";
  contractABI = JSON.parse(abi.result);

  if (contractABI != "") {
    return contractABI;
  } else {
    console.log("Error");
  }
}

async function getEvents(address) {
  //this is just an example dummy seed phrase
  const did = await authenticateDID(
    "a6e782751d79e724c47380f1aad31f80df876c5cd94b11699e186d9bbc57fa38"
  );
  composeClient.setDID(did);
  const latestBlock = await web3.eth.getBlockNumber();
  const abi = await getJSON(address);
  const contract = new web3.eth.Contract(abi, address);
  const historicalBlock = latestBlock - BigInt(10000);
  console.log(
    `Latest block: ${latestBlock} - Historical block: ${historicalBlock}`
  );
  //specify which event type to listen to
  const events = await contract.getPastEvents("VoteEmitted", {
    fromBlock: historicalBlock,
    toBlock: "latest",
  });

  getTransferDetails(events);
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//input the contract address here - > Aave is the example listed below
getEvents("0xEC568fffba86c094cf06b22134B23074DFE2252c");
