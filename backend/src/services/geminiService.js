const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const geminiPhoto = async (prompt, imageBase64, mimeType = "image/jpeg") => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    console.log("Base64 length:", imageBase64 ? imageBase64.length : 0);
    console.log("MimeType:", mimeType);

    const res = await model.generateContent([prompt, imagePart]);
    return res.response.text();
  } catch (error) {
    console.log("error en la api de gemini", error);
    throw error;
  }
};






const geminiText = async (prompt) => {
  try {
    const res = await model.generateContent(prompt);
    return res.response.text();
    } catch (error) {
    console.log("errore en la api de gemini", error);
    }
};

module.exports = {
  geminiPhoto,
  geminiText,
};
