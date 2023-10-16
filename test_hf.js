import { HuggingFaceInference } from "langchain/llms/hf";

// const model = new HuggingFaceInference({
//   model: "gpt2",
//   apiKey: "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", // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
// });
import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({
});

const res = await model.call("1 + 1 =");
console.log(res);