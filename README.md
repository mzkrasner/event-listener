# ComposeDB as a Blockchain Indexer

This repository shows a very simple way to listen for smart contract events and write them to ComposeDB on Ceramic.

## Getting Started

1. Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

3. Create a .env file and enter the required environment variable outlined in .env.example (you can copy-pase the one I've left in there)

4. Run the application (make sure you are using node version 16):

#### Development
```bash
nvm use 16
npm run dev
```

## Learn More

To learn more about Ceramic please visit the following links

- [Ethereum Attestation Service](https://attest.sh/) - Details on how to define attestation schemas and create on/off-chain attestations!
- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB Sandbox](https://composedb.js.org/sandbox) - Test your GraphQL query skills against a real dataset directly in your browser without any local dependencies

