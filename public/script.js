const chatInput = document.querySelector(".chat-input textarea");
const micBtn = document.querySelector(".bi-mic");
const sendChatBtn = document.querySelector(".bi-send");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const inputTakeHeight = chatInput.scrollHeight;

sendChatBtn.addEventListener("click", () => {
  sendChatBtn.style.background = "lightblue";
  setTimeout(() => {
    sendChatBtn.style.background = "";
  }, 300);
  userMessage = chatInput.value.trim();

  // reseting
  chatInput.value = "";
  chatInput.style.height = `${inputTakeHeight}px`;

  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi(
      `<i class="spinner-border"></i>`,
      "incoming"
    );
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 400);
});

micBtn.addEventListener("click", () => {
  micBtn.style.background = "lightblue";
  setTimeout(() => {
    micBtn.style.background = "";
  }, 300);

  var speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript);
    chatInput.innerHTML = transcript;
  });

  if (speech == true) {
    recognition.start();
  }
});

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="bi bi-robot"></span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = async (incomingChatLi) => {
  const URL = "https://openrouter.ai/api/v1/chat/completions";
  const PASS_KEY =
    "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";
  const API_REQ_OBJ = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PASS_KEY}`,
      "HTTP-Referer": "",
      "X-Title": "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-3n-e2b-it:free",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  const messageEle = incomingChatLi.querySelector("p");

  try {
    const response = await fetch(URL, API_REQ_OBJ);
    const data = await response.json();

    messageEle.textContent = data.choices[0].message.content.trim();
  } catch (error) {
    messageEle.classList.add("errorr");
    messageEle.textContent = "Oops! Something went wrong.";
  } finally {
    () => chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
