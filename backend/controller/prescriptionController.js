const Product = require("../models/Product");
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Fuzzy match helper: checks if medicine name from prescription
 * partially matches a product title in the database
 */
function fuzzyMatch(prescriptionName, productTitle) {
    const pName = prescriptionName.toLowerCase().trim();
    const pTitle = productTitle.toLowerCase().trim();

    // Direct inclusion check
    if (pTitle.includes(pName) || pName.includes(pTitle)) {
        return true;
    }

    // Check if any word from prescription name is a significant match
    const prescWords = pName.split(/\s+/);
    const titleWords = pTitle.split(/\s+/);

    for (const pw of prescWords) {
        if (pw.length < 3) continue; // Skip very short words
        for (const tw of titleWords) {
            if (tw.length < 3) continue;
            // Check if one word starts with the other (handles partial matches)
            if (tw.startsWith(pw) || pw.startsWith(tw)) {
                return true;
            }
            // Levenshtein-like: if words are very similar (allow 2 char difference for long words)
            if (Math.abs(pw.length - tw.length) <= 2 && pw.length >= 4) {
                let matches = 0;
                const minLen = Math.min(pw.length, tw.length);
                for (let i = 0; i < minLen; i++) {
                    if (pw[i] === tw[i]) matches++;
                }
                if (matches / minLen >= 0.75) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * @route   POST /api/prescription/analyze
 * @desc    Analyze a prescription image using Groq Llama 4 Scout and match products
 */
const analyzePrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No prescription image uploaded" });
        }

        // Read the uploaded image and convert to base64
        const imagePath = path.join(__dirname, "../../uploads", req.file.filename);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");
        const mimeType = req.file.mimetype;

        console.log(`[Prescription AI] Analyzing prescription: ${req.file.filename}`);

        // Send to Groq Llama 4 Scout for vision analysis
        const completion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `You are a medical prescription reader AI. Analyze this prescription image and extract ALL medicine/drug names mentioned in it.

IMPORTANT RULES:
1. Return ONLY a JSON array of medicine names, nothing else.
2. Use generic/common medicine names (not brand names when possible).
3. Include only the medicine/drug names, NOT dosage, frequency, or other details.
4. If you cannot read the prescription clearly, return what you can identify.
5. Return the response in this exact format: ["Medicine1", "Medicine2", "Medicine3"]
6. If no medicines are found, return: []

Example output: ["Amoxicillin", "Ibuprofen", "Metformin"]`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            temperature: 0.3,
            max_completion_tokens: 1024,
            top_p: 1,
        });

        const aiResponse = completion.choices[0]?.message?.content || "[]";
        console.log(`[Prescription AI] Raw AI response: ${aiResponse}`);

        // Parse the AI response to extract medicine names
        let extractedMedicines = [];
        try {
            // Try to find JSON array in the response
            const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
            if (jsonMatch) {
                extractedMedicines = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error("[Prescription AI] Failed to parse AI response:", parseError);
            // Fallback: try to extract medicine names from plain text
            extractedMedicines = aiResponse
                .split(/[,\n]/)
                .map((s) => s.replace(/[\[\]"'0-9.]/g, "").trim())
                .filter((s) => s.length > 2);
        }

        console.log(`[Prescription AI] Extracted medicines: ${JSON.stringify(extractedMedicines)}`);

        // Fetch all products from database
        const allProducts = await Product.find({});

        // Match extracted medicines with products in database
        const matchedProducts = [];
        const unmatchedMedicines = [];

        for (const medicine of extractedMedicines) {
            let found = false;
            for (const product of allProducts) {
                if (fuzzyMatch(medicine, product.title)) {
                    // Avoid duplicate matches
                    if (!matchedProducts.find((p) => p._id.toString() === product._id.toString())) {
                        matchedProducts.push(product);
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                unmatchedMedicines.push(medicine);
            }
        }

        console.log(`[Prescription AI] Matched ${matchedProducts.length} products, ${unmatchedMedicines.length} unmatched`);

        // Clean up uploaded file after processing (optional - keep for reference)
        // fs.unlinkSync(imagePath);

        res.json({
            success: true,
            extractedMedicines,
            matchedProducts: matchedProducts.map((p) => ({
                _id: p._id,
                unique_id: p.unique_id,
                title: p.title,
                price: p.price,
                imgsrc: p.imgsrc,
                category: p.category,
                countInStock: p.countInStock,
                indication: p.indication,
                dosage: p.dosage,
            })),
            unmatchedMedicines,
            prescriptionImage: `/uploads/${req.file.filename}`,
        });
    } catch (error) {
        console.error("[Prescription AI] Error:", error);
        res.status(500).json({
            message: "Failed to analyze prescription",
            error: error.message,
        });
    }
};

module.exports = { analyzePrescription };
