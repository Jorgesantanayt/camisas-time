import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { fotoBase64, camisaNome, camisaImg } = await req.json();

    // Lê a imagem da camisa do disco
    const camisaPath = join(process.cwd(), "public", camisaImg);
    const camisaBuffer = readFileSync(camisaPath);
    const camisaBase64 = camisaBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: fotoBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: camisaBase64,
        },
      },
      {
        text: `Você é um editor de fotos especializado em moda esportiva. A primeira imagem é uma pessoa. A segunda imagem é a camisa "${camisaNome}". Coloque essa camisa na pessoa mantendo o rosto, corpo, pose e fundo originais. Resultado realista.`,
      },
    ]);

    const parts = result.response.candidates[0].content.parts;
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return Response.json({ erro: "Modelo não retornou imagem. Tente novamente." }, { status: 500 });
    }

    return Response.json({ imagem: imagePart.inlineData.data });
  } catch (e) {
    console.error(e);
    return Response.json({ erro: e.message || "Erro interno" }, { status: 500 });
  }
}