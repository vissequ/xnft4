const API_BASE_URL = window.location.origin; // Automatically picks the correct origin

document.addEventListener("DOMContentLoaded", () => {
    let showGIF = true; // Set this to false if you don't want to display the GIF.

    const tweetForm = document.getElementById("tweetForm");
    const message = document.getElementById("message");
    const connectWalletButton = document.getElementById("connectWallet");
    const walletInfo = document.getElementById("walletInfo");
    const mintButton = document.getElementById("mintButton");
    const gifDisplay = document.getElementById("gif-display");

    let userAddress = "";

    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                userAddress = accounts[0];
                walletInfo.textContent = `Connected: ${userAddress}`;
                console.log("Wallet connected:", userAddress);

                // Switch to Fantom network
                await switchToFantom();
            } catch (error) {
                console.error("Error connecting wallet:", error);
                walletInfo.textContent = "Failed to connect wallet.";
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    async function switchToFantom() {
        const fantomParams = {
            chainId: "0xFA", // Fantom mainnet chain ID
            chainName: "Fantom Opera",
            nativeCurrency: {
                name: "Fantom",
                symbol: "FTM",
                decimals: 18,
            },
            rpcUrls: ["https://rpc.ftm.tools"],
            blockExplorerUrls: ["https://ftmscan.com/"],
        };

        try {
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [fantomParams],
            });
            console.log("Switched to Fantom network.");
        } catch (error) {
            console.error("Error switching to Fantom network:", error);
            walletInfo.textContent = "Failed to switch to Fantom network.";
        }
    }

    connectWalletButton.addEventListener("click", connectWallet);

    const contractAddress = "0x44190eE275Ba0531795E7D2CB76e11C09F344399";
    const contractABI = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "AccessControlBadConfirmation",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "neededRole",
                        "type": "bytes32"
                    }
                ],
                "name": "AccessControlUnauthorizedAccount",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "balance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "needed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ERC1155InsufficientBalance",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "approver",
                        "type": "address"
                    }
                ],
                "name": "ERC1155InvalidApprover",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "idsLength",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "valuesLength",
                        "type": "uint256"
                    }
                ],
                "name": "ERC1155InvalidArrayLength",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "ERC1155InvalidOperator",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    }
                ],
                "name": "ERC1155InvalidReceiver",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "ERC1155InvalidSender",
                "type": "error"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "ERC1155MissingApprovalForAll",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "grantRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "tokenUri",
                        "type": "string"
                    }
                ],
                "name": "mintxNFT",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "callerConfirmation",
                        "type": "address"
                    }
                ],
                "name": "renounceRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "revokeRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "previousAdminRole",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "newAdminRole",
                        "type": "bytes32"
                    }
                ],
                "name": "RoleAdminChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleGranted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleRevoked",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "safeBatchTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "TransferBatch",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "TransferSingle",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "value",
                        "type": "string"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "URI",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "tokenURI",
                        "type": "string"
                    }
                ],
                "name": "xNFTMinted",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "ADMIN_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address[]",
                        "name": "accounts",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    }
                ],
                "name": "balanceOfBatch",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "DEFAULT_ADMIN_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    }
                ],
                "name": "getRoleAdmin",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "hasRole",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "MINTER_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "interfaceId",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "tokenCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "uri",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
    ];


    function showPleaseWait() {
        const pleaseWaitDiv = document.getElementById('please-wait');
        if (pleaseWaitDiv) {
            pleaseWaitDiv.style.display = 'flex';
        }
    }
    
    function hidePleaseWait() {
        const pleaseWaitDiv = document.getElementById('please-wait');
        if (pleaseWaitDiv) {
            pleaseWaitDiv.style.display = 'none';
        }
    }
    

    async function mintNFT(metadataURI) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const recipientAddress = "0x660B4AC6c45D8d710d14735B005835754BBbAFB8"; // Payment recipient
            const mintingFee = ethers.utils.parseEther("1.0"); // 1 FAN
        
            // Step 1: Send the minting fee to the recipient
            const paymentTx = await signer.sendTransaction({
                to: recipientAddress,
                value: mintingFee
            });
            console.log("Payment transaction sent:", paymentTx.hash);
            await paymentTx.wait(); // Wait for payment transaction to be mined
            console.log("Payment successful!");
    
            // Step 2: Call the minting function on the contract
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.mintxNFT(address, 1, metadataURI); // No `value` needed here
            showPleaseWait(); // Show the "please wait" message
    
            console.log("Minting transaction sent:", tx.hash);
            const receipt = await tx.wait();
            const event = receipt.events.find((e) => e.event === "xNFTMinted");
            const tokenId = event.args.tokenId.toNumber();
            console.log("Mint successful! Token ID:", tokenId);
    
            alert(`xNFT minted successfully! Token ID: ${tokenId}`);
        } catch (error) {
            console.error("Error minting xNFT:", error);
            alert("Failed to mint xNFT. Check the console for details.");
        } finally {
            hidePleaseWait(); // Hide the "please wait" message after completion or error
        }
    }
    

    async function fetchTweetDetails(url) {
        try {
            // Instead of showing a progress bar, show "Please wait..."
            message.textContent = "Please wait...";

            console.log("Fetching tweet details for URL:", url);

            const response = await fetch(`/api/get-tweet-details?tweetId=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Error fetching tweet details: ${response.statusText}`);
            }

            const { time, message: tweetMessage, username } = await response.json();
            console.log("Fetched Tweet Details:", { time, message: tweetMessage, username });

            const data = {
                time,
                message: tweetMessage,
                username,
                tokenId: Date.now(),
            };

            const gifResponse = await fetch("/api/create-gif", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!gifResponse.ok) {
                throw new Error(`Error creating GIF: ${gifResponse.statusText}`);
            }

            const gifResult = await gifResponse.json();
            console.log("GIF Created:", gifResult);

            // After GIF is created, if showGIF is true, display the GIF
            if (showGIF && gifResult.gifURI) {
                gifDisplay.src = gifResult.gifURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
                gifDisplay.style.display = "block";
            }

            message.textContent = "Ready to mint xNFT!";

            if (gifResult.success && mintButton) {
                mintButton.style.display = "inline-block";
                mintButton.onclick = () => {
                    const metadataURI = gifResult.metadataURI;
                    mintNFT(metadataURI);
                };
            } else {
                console.error("Mint button not found or GIF creation failed.");
            }
        } catch (error) {
            console.error("Error fetching tweet details or creating GIF:", error);
            if (message) {
                message.textContent = `Error: ${error.message}`;
            }
        }
    }

    tweetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const tweetUrl = document.getElementById("tweetUrl").value;

        console.log("Submitted URL:", tweetUrl);

        message.textContent = "Please wait...";
        fetchTweetDetails(tweetUrl);
    });
});
