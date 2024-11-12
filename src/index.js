const { utils } = require('@tradetrust-tt/tradetrust');
const { openAttestationVerifiers, verificationBuilder } = require('@tradetrust-tt/tt-verify');
const { providers } = require('ethers');

const VerifierOptions = {
    20180427: {
        provider: new providers.JsonRpcProvider("https://free.testnet.stabilityprotocol.com", 20180427)
    },
    11155111: {
        provider: new providers.JsonRpcProvider("https://rpc.sepolia.org", 11155111)
        // network: "sepolia"
    }
}

const verifyDocument = async (document) => {
    let chainId = 11155111; // Sepolia

    if (utils.isWrappedV2Document(document)) {
        const data = utils.getData(document);
        if (data?.network) {
            chainId = Number(data?.network?.chainId);
        }
    } else if (utils.isWrappedV3Document(document)) {
        if (document?.network) {
            chainId = Number(document?.network?.chainId);
        }
    }
    console.log("chainId:", chainId)

    const verify = verificationBuilder(openAttestationVerifiers, VerifierOptions[chainId]);
    const verificationStatus = await verify(document);
    console.log(verificationStatus);

    const isValid = ['DOCUMENT_INTEGRITY', 'DOCUMENT_STATUS', 'ISSUER_IDENTITY'].every((key) => {
        return verificationStatus.some((result) => result.type === key && result.status === 'VALID');
    });
    console.log('isValid', isValid);
}

// console.log('===Verifying wrapped V2 Sepolia document===');
// verifyDocument({
//     "version": "https://schema.openattestation.com/3.0/schema.json",
//     "@context": [
//         "https://www.w3.org/2018/credentials/v1",
//         "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
//         "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
//         "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json"
//     ],
//     "reference": "SERIAL_NUMBER_123",
//     "name": "Republic of Singapore Driving Licence",
//     "issuanceDate": "2010-01-01T19:23:24Z",
//     "validFrom": "2010-01-01T19:23:24Z",
//     "issuer": {
//         "id": "https://example.com",
//         "type": "OpenAttestationIssuer",
//         "name": "DEMO STORE"
//     },
//     "type": ["VerifiableCredential", "DrivingLicenceCredential", "OpenAttestationCredential"],
//     "credentialSubject": {
//         "id": "did:example:SERIAL_NUMBER_123",
//         "class": [
//             {
//                 "type": "3",
//                 "effectiveDate": "2010-01-01T19:23:24Z"
//             },
//             {
//                 "type": "3A",
//                 "effectiveDate": "2010-01-01T19:23:24Z"
//             }
//         ]
//     },
//     "openAttestationMetadata": {
//         "template": {
//             "name": "CUSTOM_TEMPLATE",
//             "type": "EMBEDDED_RENDERER",
//             "url": "https://localhost:3000/renderer"
//         },
//         "proof": {
//             "type": "OpenAttestationProofMethod",
//             "method": "TOKEN_REGISTRY",
//             "value": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e"
//         },
//         "identityProof": {
//             "type": "DNS-TXT",
//             "identifier": "example.tradetrust.io"
//         }
//     },
//     "attachments": [
//         {
//             "fileName": "sample.pdf",
//             "mimeType": "application/pdf",
//             "data": "BASE64_ENCODED_FILE"
//         }
//     ],
//     "proof": {
//         "type": "OpenAttestationMerkleProofSignature2018",
//         "proofPurpose": "assertionMethod",
//         "targetHash": "45f8d980262851107f5d69a88f34c1edbeea93b2df7b594db3dddcf461241010",
//         "proofs": [],
//         "merkleRoot": "45f8d980262851107f5d69a88f34c1edbeea93b2df7b594db3dddcf461241010",
//         "salts": "W3sidmFsdWUiOiJlYThhMmU2ODE2YTZhZGMyZGRhYzM0YmFkYTUxYTU5NzM3MWExYWM4OWNiNjgyOGViYmY2YmI3ZGJmNzg4MDYwIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiM2Q4MGQ1ZWZlY2I3YjIxMmM2Y2JiNTEwZTk1YzFkMGI5OWQ1OTU4M2NkNjkyNmZjYjMyZTcxMzkzOWFiNGI2MSIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiI4NWQ3NDdlMGZhYTZlMzQ5MjZkNmZiMzkwNjIyMjdhNjIxMGRlZDhmNGRiMDQwOWQ2ODFkNDJhZTI1YjFkYWJiIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6Ijc1MGM3M2U3M2E3YjFjZGRjYmZkNTUxZTUzN2RhOGI5NmZkODAyYTdkYWU4OTZhZWY1ODY5OGFhZGJkY2VkNWQiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiN2QxZTE1NDgwNWM0ZWI4NGQ1NzA0MGVkZTgxY2E1ODE2OThhOGE4Zjk5Njc1MTNiOTQzMjE1ZTUyOGE2OTA5ZSIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiJjYjA0NWVhODliOWQ2ODZkMzBkZmI0NDczNThkYTRhZDdjYWNjZTI0Y2I5YzY3YTYwY2U2NWE1OTg2NTQyMWZmIiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI3NTliMTcwYmJkYzAwMjdlNDU5M2NlZDU3Nzc0NjA4YmE1ZDA5Yzc5ZTkzMzJmN2IyZDI2ODMwNDU0YTMxY2YzIiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiY2Q0ZWVkYTcyZGYzYWIzNTE3ZDJkYWJhNTY3YTQ3NTk4YTMxNTIwNGQwZGY1M2U1NGMxNmIyN2NmYWE5NjI3ZCIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiYWIyYWM2NzgxNmI0NTRlMDgyOWUzYTU1NjJjNjliMGJkYzU0ZjgwODZlOTk3ZDdiNGFiMTU1MWI4Y2NkOGM5MSIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiZGM4ODg5MDFiMjEyZGMxOWE3MDQyNWY2N2Q1ZTI4YzlhYzgxNWJmNzlhOWFhMzU1ZDRjMTkzZDdkNjdmODdjYSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiZTg2YzRhYWU1MTgyODNhYjkxYTBkNmQ0M2EwYTAyOWExZjhjNjQ2YWRkYTMxNzBiNzM5ZGY4MWU2ZjAxMWZlNSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI2ZTQyOGUzMGUwNzZhN2M5ZjMyYjhkZGRlZGU0Yjc1MjRiZDUzZDIwYjdlNmQyODYyZTA3Nzc4YTRkNDM0NDg5IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjJlY2ZlMjFlMDYyNDEwYmRmMDQxYjk3N2IzZGJjMmQ1NGFkM2U3MjUwMDU1ZGMyZmJmM2MwYzVjNThhYjJhZTciLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjMDRiZGFiZTgxZTNjM2UyYzgzMmI3MjhlMjA5Yjg0Nzc2ZjYyNTViZTBhNmNkNzQwYTg3NGE3NmMzZDA4ZmFmIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiZjBjZjE5YTFjZGE3NDQ4ZjZmMzNlM2ZhOTcxNDU0ZGVmYTYzMzFjZmIzYTY5YzliZDY4ZmQyYjk5MzExMWQ0YSIsInBhdGgiOiJ0eXBlWzJdIn0seyJ2YWx1ZSI6IjBiNzJhYzhkZmE5NzQ0MWI5NjkxZDVkMzA3MmVmN2VjNzgwODJhOTM4ZDRjYzU1ZDE5MTFiMmQ1NDcyNDc3MDciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZjU4NDMyOGZmNWViODBmYTY2NGM1OWVlOGM5MmZiY2U2NDdlYmYwNzk5MWEwMzkyNWNkZjk5YzBlN2ZkODQzMiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6Ijc4MzcwNjBiMGYyZjViYmUxZjk5N2MwNzExNTc5OWI4Zjk2ZWVjZDhlN2NlODliNjU3NzY5YjQ1ZTI1OTFmNjMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIyY2I3YWY3OTUxYzI3YmZjOGRiZWM0ZGY3NjViYzRkMjgzN2UyNjdlZTAwZGQ3YTBmMjFhYjIzNmE4MGQ0M2VmIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiZWI1YzU5ZGVkNmZmOTJkMGRiYmI0ODljYjM4MjgxNmNjYmU4ODA5ODNhNDliNjE4MzJjODZjZGQ5MThiMTJlNSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjA0N2ZkZmM0MjcwOTFlZTJmMjI0M2ExOGRmZmM4Nzg4ODEzM2ViMjVhNjFkOWMzMzlhNTk3YTE0YjMxYTEzNjciLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiJlMjlkM2I3MjUzMjJiZTlkYjhlMTY2NzY5NTJlNTMwNmVmNDI5NjM1YTQwNzAzZWJlNmQxZjJhMjEyY2ViODBiIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiM2Q5NDFmZDA3NmFiOGRiNmQ1ZWEyMmU2MGY3MGNmODZiNjU3MDNjNDFiN2MzMWU4NDNkMjU3Y2EwZjdkYTgwOCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiZjI0NGNjOWEwZWVjNDZkNzdlNjg0NzFhOWQzN2Q4MjQyYmU2MjFiNmRjYTllYWRiNDhjNzA4Y2NlMDYwNmEzNiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6IjFiNTFjZjI2NWNkODhiNzJmNjBkODAzZTkxMGY2MDdkZTgxZWIyNTMyYzlmMjk3YzFmMWNlNzVhMWM4YWMyYTEiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImFhMzAwYTA2OTMwMTg3MjYzOWQ2YmY1MTFkZmJkNDBhMmRlOTZmNzU5ZDhmYzBiYzJjZGZhNmFmMzZhYzE4MzAiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiODA1YjcyNjc0MGFmMGE5NTY4MmU2MzFmNDUzZTA5MjBiMWU3ZWU3NjJmODE2M2IxMzU0YTMwODQ2NGNkOWQxYSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiNzY3Yzg0YjE1YjhkOTdkNzMwZTQ0OTMyMTZjNmU1ZmZkZmU0NDA3NjE3MDNmMmVlNDYwNWNhOTIyZDBjZjQyZCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiMzAyY2YxYWJjNGEwMGEzMWQyZDJkYmRkNWY4ZjA3N2ZhMjNhZjllZGViMGM2OTAzOTRjMTdmYTBiMjQ2ZmYzOCIsInBhdGgiOiJhdHRhY2htZW50c1swXS5maWxlTmFtZSJ9LHsidmFsdWUiOiI2NjQ5NTNiMzk0NDIxZDVjY2FiY2YyMTRhZjZlZTBkNjdlMDA4YjVmYmQ2YTU2MWI0YTkyZTgyMzA1MDRhOGIzIiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6IjY5NzE4YzE5MzlmMzljYWY1MzI0NzQ3MzFjZjhhMDlmMDg4OTRiYWIyNWM0YmU1N2VjZjBkOWQ4NmE5N2VlOWQiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZGF0YSJ9XQ==",
//         "privacy": {
//             "obfuscated": []
//         }
//     }
// });

console.log('===Verifying wrapped V3 Stability Testnet document===');
verifyDocument({
    "version": "https://schema.openattestation.com/2.0/schema.json",
    "data": {
        "issuer": {
            "partyName": "5b4a755a-2a64-493b-924d-8b28948bb545:string:Tremblay - Botsford",
            "phone": "a3e6680b-110d-4326-bab9-7cbc75e29a87:string:(698) 755-8130 x450",
            "email": "4c2e1d0b-de62-4289-8c5a-9c1a8b8b266c:string:Marcos40@gmail.com",
            "address": "c45e48f3-ec5a-4cd5-b0ef-e5a07a5a0e2d:string:812 Gislason Walks"
        },
        "shipper": {
            "partyName": "d9f9c0f6-80cd-438d-a319-4c895231cfb5:string:Robel LLC",
            "phone": "55d9f3f8-2c13-4ed6-8f33-53900ea1fd4a:string:337-592-9833 x23200",
            "email": "0e708b2c-720a-4956-adbb-9b1d579ae307:string:Daphney.Weissnat@yahoo.com",
            "address": "0d714c97-32f2-4ed1-bcb5-13cee0c1a5d9:string:14188 High Street"
        },
        "consignee": {
            "partyName": "4562fc27-6cb1-4c28-9e6b-e1afbb9818a7:string:Buckridge, Ledner and VonRueden",
            "phone": "3d3cb93c-2227-4c91-9686-01aac3fdf08c:string:917.849.4970 x226",
            "email": "ac67813b-ffd0-49d3-a12f-db7d96618421:string:Audra81@gmail.com",
            "address": "0a739044-3601-4950-a926-399fcfb13f63:string:7812 Walnut Street"
        },
        "notifyParty": {
            "partyName": "1714e390-beba-4e14-8d9c-98ca481a28b9:string:Kuhic - Feest",
            "phone": "a8a83d46-6af4-47c6-814d-0deea61fee33:string:421.824.3287 x6394",
            "email": "a70de43a-1516-414b-9ce6-b727b9382217:string:Gustave67@yahoo.com",
            "address": "453acd69-83cb-4c5b-9571-66504a0eb6ce:string:50994 Chapel Hill"
        },
        "vessel": "55a3ce99-fd8f-44a9-b2ab-d2c89c49da78:string:chapel",
        "referenceNo": "5c784fe9-6699-457f-a099-036951f0d15b:string:978-0-09-308073-8",
        "cargoGrossWeight": "ac9e69ba-5a97-492e-94cd-55547fa81720:string:3125656124653568",
        "measurement": "967c956b-bdbc-4b5e-bd0e-5e74a87b4e5c:string:10x10x10 meters",
        "portOfLoading": {
            "locationName": "afae671b-5534-4ed6-b6ec-047650d46bd7:string:West Francis"
        },
        "portOfDischarge": {
            "locationName": "84f77d14-2ecd-4ec4-8ba7-acbcf1faece3:string:Funkton"
        },
        "dateOfIssue": "d37b9b3c-8b86-4937-8733-18890cdcb3c9:string:11-12-2024",
        "shippedOnBoardDate": "b6cb356c-bdb9-44c2-abfa-8cb257466d4d:string:11-12-2024",
        "descriptionOfGoods": [
            "9d211195-b07f-42b8-af5e-44fe33497ebf:string:Fish",
            "bed1ffbc-8b39-47f7-921b-b04747bc5ba2:string:Shoes"
        ],
        "$template": {
            "name": "c2729efc-ba02-4433-bc82-5b1e0bc08b40:string:BILL_OF_LADING",
            "type": "40ba4ad7-d2be-4d3f-a97f-9986cf6f4429:string:EMBEDDED_RENDERER",
            "url": "516a4dc3-4905-4482-aea4-ce269bcccc81:string:https://tt-renderer.stabilityprotocol.com"
        },
        "id": "fa39b877-b680-4490-b3c6-84d78a12499b:string:5badd784-1315-4bff-a38f-94d40ea0f4b1",
        "network": {
            "chain": "949805b6-e2d5-4979-8819-e0f1b8022e94:string:FREE",
            "chainId": "33543d64-8073-4d14-8e68-00e770cdf04d:string:20180427"
        },
        "issuers": [
            {
                "name": "e3d11f05-625c-407b-bbaa-658058d60c3a:string:Stability Testnet - TradeTrust",
                "tokenRegistry": "3014cb1e-7594-4fb1-af92-c1cd3aa15c1a:string:0xc5b8057852aF1A61d4A8C48b89F248880ee3Fc43",
                "identityProof": {
                    "type": "9652374c-4464-4281-b900-7548f96fd618:string:DNS-TXT",
                    "location": "4760b179-36eb-41cb-975e-847b4c4fb334:string:tradetrust-testnet.stabilityprotocol.com"
                }
            }
        ]
    },
    "signature": {
        "type": "SHA3MerkleProof",
        "targetHash": "9475f440190dafb25429a318214da59a7ee23cb9d437cae3e1d25658d8bd5580",
        "proof": [],
        "merkleRoot": "9475f440190dafb25429a318214da59a7ee23cb9d437cae3e1d25658d8bd5580"
    }
})