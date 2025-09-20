const ort = require("onnxruntime-node");
const fs = require("fs");

checkPhishing = async (urls) => {
  // Path to your downloaded ONNX model
  const modelPath = "./models/model.onnx";

  // Create an ONNX Runtime session
  const session = await ort.InferenceSession.create(modelPath, {
    executionProviders: ["cpu"],
  });

  // Prepare input tensor (string array)
  const inputTensor = new ort.Tensor("string", urls, [urls.length]);

  // Run inference
  const feeds = {};
  feeds["inputs"] = inputTensor; // "inputs" is the input name in the ONNX model
  const results = await session.run(feeds);

  // The output tensor name may vary, check session.outputNames if needed
  const outputName = session.outputNames[1]; // same as [1] in your Python Colab
  const probabilities = results[outputName].data;

  let output = [];

  // Display results
  urls.forEach((url, i) => {
    console.log(`URL: ${url}`);
    console.log(
      `Likelihood of being a phishing site: ${(
        probabilities[i * 2 + 1] * 100
      ).toFixed(2)}%`
    );
    console.log("----");
    output.push({ url: url, probability: probabilities[i * 2 + 1] });
  });
  return output;
};


module.exports = { checkPhishing };
