# tradetrust-sample-test

```
npm run test
node src/index.js
```

Uncomment the commented code in index.js to run for Sepolia.

Sepolia Result
```ts
===Verifying wrapped V2 Sepolia document===
chainId: 11155111
[
  {
    type: 'DOCUMENT_INTEGRITY',
    name: 'OpenAttestationHash',
    data: true,
    status: 'VALID'
  },
  {
    name: 'OpenAttestationEthereumTokenRegistryStatus',
    type: 'DOCUMENT_STATUS',
    status: 'VALID',
    data: { mintedOnAll: true, details: [Object] }
  },
  {
    status: 'SKIPPED',
    type: 'DOCUMENT_STATUS',
    name: 'OpenAttestationEthereumDocumentStoreStatus',
    reason: {
      code: 4,
      codeString: 'SKIPPED',
      message: `Document issuers doesn't have "documentStore" or "certificateStore" property or DOCUMENT_STORE method`
    }
  },
  {
    status: 'SKIPPED',
    type: 'DOCUMENT_STATUS',
    name: 'OpenAttestationDidSignedDocumentStatus',
    reason: {
      code: 0,
      codeString: 'SKIPPED',
      message: 'Document was not signed by DID directly'
    }
  },
  {
    name: 'OpenAttestationDnsTxtIdentityProof',
    type: 'ISSUER_IDENTITY',
    data: {
      identifier: 'example.tradetrust.io',
      value: '0x142Ca30e3b78A840a82192529cA047ED759a6F7e'
    },
    status: 'VALID'
  },
  {
    status: 'SKIPPED',
    type: 'ISSUER_IDENTITY',
    name: 'OpenAttestationDnsDidIdentityProof',
    reason: {
      code: 0,
      codeString: 'SKIPPED',
      message: 'Document was not issued using DNS-DID'
    }
  }
]
isValid true
```

Stability Result
```ts
===Verifying wrapped V3 Stability Testnet document===
chainId: 20180427
[
  {
    type: 'DOCUMENT_INTEGRITY',
    name: 'OpenAttestationHash',
    data: true,
    status: 'VALID'
  },
  {
    name: 'OpenAttestationEthereumTokenRegistryStatus',
    type: 'DOCUMENT_STATUS',
    status: 'VALID',
    data: { mintedOnAll: true, details: [Array] }
  },
  {
    status: 'SKIPPED',
    type: 'DOCUMENT_STATUS',
    name: 'OpenAttestationEthereumDocumentStoreStatus',
    reason: {
      code: 4,
      codeString: 'SKIPPED',
      message: `Document issuers doesn't have "documentStore" or "certificateStore" property or DOCUMENT_STORE method`
    }
  },
  {
    status: 'SKIPPED',
    type: 'DOCUMENT_STATUS',
    name: 'OpenAttestationDidSignedDocumentStatus',
    reason: {
      code: 0,
      codeString: 'SKIPPED',
      message: 'Document was not signed by DID directly'
    }
  },
  {
    name: 'OpenAttestationDnsTxtIdentityProof',
    type: 'ISSUER_IDENTITY',
    data: [ [Object] ],
    status: 'VALID'
  },
  {
    status: 'SKIPPED',
    type: 'ISSUER_IDENTITY',
    name: 'OpenAttestationDnsDidIdentityProof',
    reason: {
      code: 0,
      codeString: 'SKIPPED',
      message: 'Document was not issued using DNS-DID'
    }
  }
]
isValid true
```