require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const GifEncoder = require("gif-encoder");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const { execSync } = require("child_process");

const app = express();

// Configurable Test Mode
const testMode = false; // Set to true for mock tweet data

// Environment variables for API keys
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Paths for serving static files
const publicDir = path.join(__dirname, "public");
const frontendDir = path.join(__dirname, "frontend");

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

app.use(express.json());
app.use(cors());
app.use(express.static(publicDir));
app.use(express.static(frontendDir)); // Serve frontend static files

// Serve the frontend index.html as the default route
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

// Fetch tweet details from Twitter API or use mock data if testMode is true
app.get("/api/get-tweet-details", async (req, res) => {
    const { tweetId } = req.query;

    if (testMode) {
        console.log("Test mode active: returning mock tweet data.");
        const currentZuluTime = new Date().toISOString();
        return res.json({
            time: currentZuluTime,
            message: "Mock tweet 223 message for testing duplicate sentence for format testing.",
            username: "testUsername",
        });
    }

    if (!tweetId) {
        return res.status(400).json({ error: "Tweet ID is required" });
    }

    try {
        const tweetIdExtracted = tweetId.split("/").pop(); // Extract the numeric tweet ID

        const twitterResponse = await axios.get(
            `https://api.twitter.com/2/tweets/${tweetIdExtracted}`,
            {
                headers: {
                    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
                },
                params: {
                    "tweet.fields": "created_at,text",
                    expansions: "author_id",
                },
            }
        );

        const tweetData = twitterResponse.data;

        const createdAt = tweetData.data?.created_at || "Unknown";
        const text = tweetData.data?.text || "No text available for this tweet.";
        const username = tweetData.includes?.users?.[0]?.username || "Unknown";

        res.json({
            time: createdAt,
            message: text,
            username,
        });
    } catch (error) {
        console.error("Error fetching tweet details:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to fetch tweet details." });
    }
});

// Helper: Upload a file to Pinata
async function uploadFileToPinata(filePath) {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        form,
        {
            maxContentLength: "Infinity",
            maxBodyLength: "Infinity",
            headers: {
                ...form.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        }
    );
    return response.data.IpfsHash;
}

// API: Upload Metadata
app.post("/api/upload-metadata", async (req, res) => {
    try {
        const { tokenId, metadata } = req.body;

        if (!tokenId || !metadata) {
            return res.status(400).json({ error: "Token ID and metadata are required" });
        }

        const metadataFilename = `${tokenId}.json`;
        const metadataPath = path.join(publicDir, metadataFilename);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        const cid = await uploadFileToPinata(metadataPath);
        console.log(`Metadata uploaded to Pinata. CID: ${cid}`);

        res.json({ success: true, cid, fileName: metadataFilename });
    } catch (error) {
        console.error("Error uploading metadata:", error);
        res.status(500).json({ error: "Failed to upload metadata." });
    }
});

app.post("/api/create-gif", async (req, res) => {
    try {
        const { time, message, username, tokenId } = req.body;

        console.log("Processing data:", { time, message, username, tokenId });

        const folderPath = path.join(publicDir, `upload-${Date.now()}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        const templateGifPath = path.join(__dirname, "template.gif");
        const gifPath = path.join(folderPath, "output.gif");

        // Check if the template image exists
        if (!fs.existsSync(templateGifPath)) {
            throw new Error(`Template GIF not found at ${templateGifPath}`);
        }

        // Function to break the message into lines
        function formatMessage(text) {
            const words = text.split(' ');
            const lines = [];
            for (let i = 0; i < words.length; i += 5) {
                lines.push(words.slice(i, i + 5).join(' '));
            }
            return lines.join('\n');
        }
        
        // function formatMessage(text) {
        //     return "Static test message\nwith multiple lines.";
        // }
        

        // Format the message with line breaks
        const formattedMessage = formatMessage(message);
        console.log("Formatted Message:\n", formattedMessage);


        // Add text to the image using ImageMagick
        console.log("Adding text with ImageMagick...");
        const command = `convert ${templateGifPath} -fill white -pointsize 24 \
            -annotate +50+200 "Time: ${time}" \
            -annotate +50+250 "@${username}" \
            -annotate +50+300 "${formattedMessage}" ${gifPath}`;
            execSync(`convert ${templateGifPath} -fill white -font "DejaVu-Sans" -pointsize 24 \
                -annotate +50+200 "Time: ${time}" \
                -annotate +50+250 "@${username}" \
                -annotate +50+300 "${formattedMessage}" \
                -debug annotate ${gifPath}`);
            
                
        console.log(`GIF with text saved at: ${gifPath}`);

        // Upload the GIF to Pinata
        const gifCID = await uploadFileToPinata(gifPath);
        console.log(`GIF uploaded to Pinata. CID: ${gifCID}`);

        const metadata = {
            name: `xNFT #${tokenId}`,
            description: "Visit xNFT.pw to immortalize any post on X by turning it into an NFT!",
            image: `ipfs://${gifCID}`,
            attributes: [
                { trait_type: "Post Zulu Time", value: time },
                { trait_type: "Post Message", value: message || "No text available" },
                { trait_type: "X Username", value: username },
            ],
        };

        const metadataFilename = `${tokenId}.json`;
        const metadataPath = path.join(folderPath, metadataFilename);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        console.log("Metadata JSON created:", metadataPath);

        const metadataCID = await uploadFileToPinata(metadataPath);
        console.log(`Metadata uploaded to Pinata. CID: ${metadataCID}`);

        res.json({
            success: true,
            gifURI: `ipfs://${gifCID}`,
            metadataURI: `ipfs://${metadataCID}`,
        });
    } catch (error) {
        console.error("Error processing GIF:", error);
        res.status(500).json({ error: "Failed to process GIF and upload metadata." });
    }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
