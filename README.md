# 🚀 AI Interview Coach: Explain, Code, Review

> A revolutionary AI-powered platform designed to simulate realistic technical interviews and provide instant, multi-dimensional feedback—helping aspiring engineers master not just coding, but also crucial communication and problem-solving skills.

<p align="center">
  <img src="https://github.com/user-attachments/assets/708d3147-93f1-4f55-8356-faf1dc2d76be" width="100%" />
  <img src="https://github.com/user-attachments/assets/ea5843c3-4b09-4f28-8bc4-f554060b95d7" width="100%" />
  <img src="https://github.com/user-attachments/assets/04341119-511e-44fa-b25a-0726e6fef25e" width="100%" />
  <img src="https://github.com/user-attachments/assets/d3a94088-8ef5-4626-9db2-2ed4dfc06e71" width="100%" />
  <img src="https://github.com/user-attachments/assets/a9ae923c-8eea-4924-9826-2006ab29366f" width="100%" />
  <img src="https://github.com/user-attachments/assets/6b1d1fe9-425f-4138-aea4-562807698e81" width="100%" />
  <img src="https://github.com/user-attachments/assets/990c5612-e0f1-4bae-bb19-cb9cc590a510" width="100%" />
  <img src="https://github.com/user-attachments/assets/82a22e65-6575-49f0-97a4-97dc4f0f8cf1" width="100%" />
</p>

---

## 🧠 Why This Project?

Traditional interview prep platforms often fail to provide *personalized feedback* on a candidate’s **communication** and **problem-solving approach**. **AI Interview Coach** fills that gap by evaluating:

* Problem comprehension
* Verbal explanation
* Code correctness & style

The goal: to build your **technical confidence** and **communication clarity**—crucial for acing real-world interviews.

---

## ✨ Key Features

* **🔍 Multi-Stage AI Feedback**

  * **Problem Understanding** — Evaluates clarity, accuracy, and edge case awareness
  * **Solution Explanation** — Assesses flow, correctness, and complexity analysis
  * **Code Review** — Critiques for logic, readability, and style

* **🎙️ Voice-to-Text Input**

  * Speak your explanation naturally using OpenAI's Whisper API

* **💻 Embedded Code Editor**

  * Integrated Monaco Editor with syntax highlighting

* **🌑 Modern UI**

  * Clean, dark-themed interface focused on productivity

* **⏳ Loading States & Animations**

  * Real-time feedback on AI processing

* **🗃️ Session History**

  * Basic local persistence for reviewing past attempts

* **📚 Curated Practice Problems**

  * A handpicked set of LeetCode-style challenges

---

## 🛠 Tech Stack

### 🖥 Frontend

* [React](https://react.dev/)
* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)

### 🔧 Backend (via Next.js API Routes)

* **Node.js**
* [OpenAI API](https://openai.com/api/)

  * GPT-4 / GPT-4o-mini
  * Whisper (speech-to-text)

### 🧑‍💻 Developer Tools

* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [`@monaco-editor/react`](https://www.npmjs.com/package/@monaco-editor/react)
* [`react-markdown`](https://www.npmjs.com/package/react-markdown)
* [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin)
* [Docker](https://www.docker.com/)
* Git & GitHub

---

## 📈 Impact & Learning Highlights

This project was a deep dive into modern full-stack development and multi-modal AI systems. Key takeaways:

* 🧠 **Prompt Engineering**
  Crafted advanced GPT-4 prompts for layered AI feedback
* 🏗 **State Management Architecture**
  Used React “lifting state up” patterns for persistent and shareable state
* 🎙 **Voice Integration**
  Built a real-time voice-to-text system using MediaRecorder + Whisper
* 🔁 **Concurrent API Handling**
  Orchestrated simultaneous calls to Whisper and GPT for a smooth UX
* 🎨 **UX Polish**
  Designed responsive UI with subtle animations and dynamic feedback
* 💅 **Rich Markdown Rendering**
  Styled explanations and code critiques using Markdown + Tailwind typography

---

## 🏃‍♀️ Running Locally

### ✅ Prerequisites

* Node.js (LTS)
* npm or Yarn
* Docker Desktop
* OpenAI API Key

### ⚙️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/TalipTun/ai-interview-coach.git
   cd ai-interview-coach
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file:

   ```
   OPENAI_API_KEY=your_openai_secret_key_here
   ```

4. **Start the LeetCode API (Docker)**

   ```bash
   docker run -p 3001:3000 alfaarghya/alfa-leetcode-api:2.0.1
   ```

   Visit `http://localhost:3001/problems?limit=1` to confirm it's running.

5. **Start the dev server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔮 Roadmap

* ✅ AI-powered interview feedback (Complete)
* 🔐 Authentication & user profiles
* 📊 Progress analytics dashboard
* 🧠 System Design & Behavioral interview modes
* 🎯 Dynamic filtering for problem difficulty & topics
* 👤 Custom interviewer personalities

---

## 👤 Author

**Talip Tun**
[LinkedIn](https://www.linkedin.com/in/talip-tun/) • [GitHub](https://github.com/TalipTun)

---

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Let me know if you’d like this exported as a Markdown file or if you want a light/dark mode badge, deploy button, or anything extra added!
