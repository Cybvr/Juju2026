import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export const chatService = {
    async sendMessage(messages: { role: 'user' | 'model', parts: { text: string }[] }[]) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are Juju, an AI creative partner. 
            Your goal is to help users generate stunning images.
            
            When a user asks to create, generate, or "nano" something, you should respond with your creative thoughts AND a special command at the end of your message.
            The command format is: [GENERATE: your optimized image prompt]
            
            Example: "That sounds like a great idea! I'll create a vibrant banana for you. [GENERATE: a hyper-realistic nano banana with golden glitter, studio lighting, 8k]"
            
            Always be conversational and inspiring.`
        })

        const chat = model.startChat({
            history: messages.slice(0, -1),
        })

        const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text)
        const response = await result.response
        const text = response.text()

        // Extract generation intent
        const generateMatch = text.match(/\[GENERATE:\s*(.*?)\]/)
        const prompt = generateMatch ? generateMatch[1] : null
        const cleanText = text.replace(/\[GENERATE:.*?\]/, "").trim()

        return {
            text: cleanText,
            generatePrompt: prompt
        }
    }
}
