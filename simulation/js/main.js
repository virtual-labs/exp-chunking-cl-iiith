// Step 1: Handle Language Selection
async function handleLanguageSelection() {
  const langOpt = parseInt(document.getElementById("lang_opt").value); // Ensure langOpt is a number
  const simulationArea = document.getElementById("simulationArea");

  if (langOpt === 0) {
    simulationArea.innerHTML = "<p>Please select a language to proceed.</p>";
    return;
  }

  const examples = await loadExamples(langOpt);

  simulationArea.innerHTML = `
      <label for="example_opt" style="margin-right: 10px;">Select Example:</label>
      <select id="example_opt" style="margin-bottom: 20px; margin-top: 20px" onchange="handleExampleSelection(${langOpt})">
        <option value="-1" selected>---Select an example---</option>
        ${examples
          .map(
            (example, index) =>
              `<option value="${index}">${example.text}</option>`
          )
          .join("")}
      </select>
      <div id="taskArea"></div>
      <div id="outputArea"></div>
    `;
}

// Step 2: Handle Example Selection
async function handleExampleSelection(langOpt) {
  langOpt = parseInt(langOpt); // Ensure langOpt is a number
  const exampleOpt = parseInt(document.getElementById("example_opt").value);
  const taskArea = document.getElementById("taskArea");
  const outputArea = document.getElementById("outputArea");

  if (exampleOpt === -1) {
    taskArea.innerHTML = "<p>Please select an example to proceed.</p>";
    outputArea.innerHTML = ""; // Clear output area
    return;
  }

  // Clear the old taskArea and outputArea content
  taskArea.innerHTML = "";
  outputArea.innerHTML = "";

  // Wait for examples to load
  const examples = await loadExamples(langOpt);
  console.log(`Examples for langOpt ${langOpt}:`, examples); // Debugging log

  const chunkOptions = loadChunkOptions();

  // Ensure the selected example is valid
  if (!examples || !examples[exampleOpt]) {
    taskArea.innerHTML = "<p>Error: Unable to load the selected example.</p>";
    return;
  }

  const selectedExample = examples[exampleOpt];
  const words = selectedExample.text.split(" ");
  const correctChunks = selectedExample.chunkData
    .split(" ")
    .map((pair) => pair.split("/")[2]);

  let taskHTML = `
      <table border="1">
        <tr><th>Word</th><th>Chunk</th><th>Feedback</th><th>Correct Answer</th></tr>
        ${words
          .map(
            (word, index) => `
          <tr>
            <td>${word}</td>
            <td>
              <select id="chunk_${index}">
                <option value="">---Select Chunk---</option>
                ${chunkOptions
                  .map((chunk) => `<option value="${chunk}">${chunk}</option>`)
                  .join("")}
              </select>
            </td>
            <td id="feedback_${index}"></td>
            <td id="correct_${index}"></td>
          </tr>
        `
          )
          .join("")}
      </table>
      <button onclick="validateChunks(${exampleOpt}, ${langOpt})">Submit</button>
      <button onclick="showCorrectChunks(${exampleOpt}, ${langOpt})">Get Answer</button>
    `;

  taskArea.innerHTML =
    `<p>Selected Example: ${selectedExample.text}</p>` + taskHTML;
}

// Utility: Load Examples from JSON
async function loadExamples(langOpt) {
  const filePath =
    langOpt === 1 ? "json/englishExamples.json" : "json/hindiExamples.json";
  console.log(`Loading examples from: ${filePath}`); // Debugging log

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Successfully loaded examples from ${filePath}`); // Debugging log
    return data;
  } catch (error) {
    console.error("Error loading examples:", error);
    alert(
      "Failed to load examples. Please check the console for more details."
    );
    return [];
  }
}

// Utility: Load Chunk Options
function loadChunkOptions() {
  return [
    "B-NP",
    "B-VP",
    "B-ADVP",
    "B-ADJP",
    "B-JJP",
    "B-PP",
    "B-SBAR",
    "B-CCP",
    "B-PRT",
    "B-INTJ",
    "B-LST",
    "B-UCP",
    "B-VGF",
    "B-VGNF",
    "B-VGNN",
    "I-NP",
    "I-VP",
    "I-ADVP",
    "I-JJP",
    "I-PP",
    "I-SBAR",
    "I-CCP",
    "I-PRT",
    "I-INTJ",
    "I-LST",
    "I-UCP",
    "I-VGF",
    "I-VGNN",
  ];
}

// Step 3: Validate Chunks
async function validateChunks(exampleOpt, langOpt) {
  const examples = await loadExamples(langOpt);
  const selectedExample = examples[exampleOpt];
  const correctChunks = selectedExample.chunkData
    .split(" ")
    .map((pair) => pair.split("/")[2]);

  let isCorrect = true;

  selectedExample.text.split(" ").forEach((word, index) => {
    const dropdown = document.getElementById(`chunk_${index}`);
    const userChunk = dropdown.value;
    const feedbackCell = document.getElementById(`feedback_${index}`);
    if (userChunk === correctChunks[index]) {
      feedbackCell.innerHTML = `<img src="images/right.png" alt="Correct" width="20">`;
    } else {
      feedbackCell.innerHTML = `<img src="images/wrong.png" alt="Incorrect" width="20">`;
      isCorrect = false;
    }
  });

  // Replace the output message
  const outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = isCorrect
    ? `<p>All chunks are correct! Well done!</p>`
    : `<p>Some chunks are incorrect. Please try again.</p>`;
}

// Step 4: Show Correct Chunks
async function showCorrectChunks(exampleOpt, langOpt) {
  const examples = await loadExamples(langOpt);
  const selectedExample = examples[exampleOpt];
  const correctChunks = selectedExample.chunkData
    .split(" ")
    .map((pair) => pair.split("/")[2]);

  selectedExample.text.split(" ").forEach((word, index) => {
    const correctCell = document.getElementById(`correct_${index}`);
    correctCell.innerHTML = correctChunks[index];
  });

  // Replace the output message
  const outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = `<p>Correct answers have been displayed in the table.</p>`;
}
