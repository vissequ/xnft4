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

                // Switch to Polygon network
                await switchToPolygon();
            } catch (error) {
                console.error("Error connecting wallet:", error);
                walletInfo.textContent = "Failed to connect wallet.";
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    async function switchToPolygon() {
        const polygonParams = {
            chainId: "0x89", // Polygon mainnet chain ID
            chainName: "Polygon Mainnet",
            nativeCurrency: {
                name: "Polygon",
                symbol: "POL",
                decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com"], // Reliable RPC URL for Polygon
            blockExplorerUrls: ["https://polygonscan.com/"], // Polygon block explorer
        };
        
        try {
            await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [polygonParams],
            });
            console.log("Switched to Polygon network.");
        } catch (error) {
            console.error("Error switching to Polygon network:", error);
            walletInfo.textContent = "Failed to switch to Polygon network.";
        }
    }

    connectWalletButton.addEventListener("click", connectWallet);

    const contractAddress = "0xB0772ED6d8d74bDD4Ef69e65BE27b506EcC0C839";
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
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "admin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FundsWithdrawn",
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
            "stateMutability": "payable",
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
            "inputs": [],
            "name": "withdrawFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
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
            "stateMutability": "payable",
            "type": "receive"
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
            "name": "MINT_FEE",
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
            const address = await signer.getAddress(); // User's address
    
            // Initialize the contract at the start
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
            console.log("mintNFT function called");
    
            // Debugging permissions (REMOVE THIS BLOCK if you no longer require role checks)
            const hasRole = await contract.hasRole(
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
                address
            );
            console.log("Has MINTER_ROLE:", hasRole);
    
            if (!hasRole) {
                console.warn("Wallet does not have MINTER_ROLE. Proceeding since roles are no longer required.");
            }
    
            // Mint NFT
            console.log("Calling mint function...");
    
            // Set dynamic gas fees
            const feeData = await provider.getFeeData();
            const maxFeePerGas = feeData.maxFeePerGas; // Current max fee (base + tip)
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas; // Tip for miners
    
            console.log("Max Fee Per Gas:", maxFeePerGas.toString());
            console.log("Max Priority Fee Per Gas:", maxPriorityFeePerGas.toString());
    
            // Set the minting fee (adjust as needed)
            const mintingFee = ethers.utils.parseEther("0.1"); // Replace with your required fee
            
            // Call the mint function with dynamic fees and minting payment
            const mintTx = await contract.mintxNFT(address, 1, metadataURI, { value: mintingFee });

            showPleaseWait();
    
            console.log("Minting transaction sent:", mintTx.hash);
    
            const receipt = await mintTx.wait();
            console.log("Mint successful:", receipt);
    
            // Debug events
            console.log("Contract Events:", receipt.events);
    
            const event = receipt.events.find((e) => e.event === "xNFTMinted");
            if (!event) {
                throw new Error("xNFTMinted event not found. Minting might have failed.");
            }
    
            const tokenId = event.args.tokenId.toNumber();
            console.log("Minted Token ID:", tokenId);

            hidePleaseWait();
    
            alert(`xNFT minted successfully! Token ID: ${tokenId}`);
        } catch (error) {
            console.error("Error during minting or payment process:", error);
    
            // Handle specific errors with custom messages
            if (error.message.includes("UNPREDICTABLE_GAS_LIMIT")) {
                alert("Transaction may fail due to gas issues. Please try again with higher fees.");
            } else if (error.message.includes("execution reverted")) {
                alert("Transaction reverted by the contract. Please check the minting fee and contract state.");
            } else {
                alert("Minting or payment failed. Check the console for details.");
            }
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
