<div align="center">

# 📚 BookAgent: Co-Creating the Future of Textbooks <img src="./assets/bookagent-logo.png" alt="BookAgent Logo" width="40"/>

<!-- Typing SVG -->
[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Orbitron&size=30&duration=3500&color=8C43EA&center=true&vCenter=true&width=500&lines=AI+Powered+Authoring;Multi-Agent+Collaboration;Pedagogically+Sound+Content)](https://git.io/typing-svg)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status: Planning](https://img.shields.io/badge/Status-Phase%201%20Planning-brightgreen?style=for-the-badge)](./documentation/BookAgent_Roadmap.md)
<br>
<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
<a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
<a href="https://cloud.google.com/"><img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="GCP"></a>
<a href="https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models#gemini-models"><img src="https://img.shields.io/badge/Gemini_AI-8954BF?style=for-the-badge&logo=googlebigquery&logoColor=white" alt="Gemini AI"></a>

<!-- Banner GIF -->
<img src="./assets/bookagent-banner.gif" alt="BookAgent Banner" width="100%">

</div>

---

## <div align="center">🔮 Vision: The AI Co-Pilot for Textbook Creation 🔮</div>

**BookAgent** is architected as a sophisticated **Multi-Agent System**, leveraging **Google Gemini**, designed not just to assist, but to *collaborate* with educators and authors in crafting exceptional, pedagogically-optimized learning materials. We aim to fuse human insight with AI scale.

**Core Objectives:**

1.  **⚡ Accelerate:** Radically shorten the textbook development lifecycle.
2.  **🧠 Enhance:** Embed pedagogical intelligence and validation from the start.
3.  **🤝 Collaborate:** Create a seamless fusion of human creativity and AI capability.
4.  **🎯 Adapt:** Build the foundation for truly personalized educational content.

---

## <div align="center">🚀 Architecture & Core Features 🚀</div>

<div align="center">
<table><tr><td valign="top" width="50%">

### 🤖 Multi-Agent System

- **Director:** Orchestrates the workflow.
- **Research:** Gathers and synthesizes information.
- **Writer:** Drafts content based on research and prompts.
- **Editor (Phase 2):** Refines style, tone, and coherence.
- **Fact-Checker (Phase 2):** Validates claims using RAG.
- **Pedagogy (Phase 2):** Optimizes for learning objectives.

</td><td valign="top" width="50%">

### ✨ Key Capabilities

- **Gemini 1.5 Pro:** State-of-the-art AI via Vertex AI.
- **RAG:** Grounding generation in facts & **user docs** (P2).
- **Pedagogical Optimization:** AI focused on *how* to teach.
- **Collaborative UI:** Designed for iterative human-AI interaction.
- **Extensible Framework:** Modular design for future agents.

</td></tr></table>
</div>

### Phase 1 Workflow

```mermaid
flowchart LR
    A[User Interface\nReact] -->|Prompt/Topic| B(Director Agent)
    B -->|Request Research| C(Research Agent)
    C -->|Formulate Query| D{Gemini API}
    D -->|Research Results| C
    C -->|Compiled Research| B
    B -->|Request Draft| E(Writer Agent)
    E -->|Research + Prompt| D
    D -->|Generated Draft| E
    E -->|Final Draft| B
    B -->|Display Result| A

    style B fill:#E0234E,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#8954BF,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#8954BF,stroke:#333,stroke-width:2px,color:#fff
    style A fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
```

---

## <div align="center">🛠️ Tech Arsenal 🛠️</div>

<div align="center">

**Core Stack**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

**AI & Cloud**

![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Vertex AI (Gemini)](https://img.shields.io/badge/Vertex_AI-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white) <!-- Using GCP logo -->
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## <div align="center">🧭 Project Status & Roadmap 🧭</div>

Currently navigating **Phase 1: Foundational Framework & Core Generation**.

➡️ **Track our progress via the [Project Roadmap](./documentation/BookAgent_Roadmap.md)**

---

## <div align="center">📄 Core Documentation Vault 📄</div>

Explore the blueprints of BookAgent:

*   [Technical Implementation Details](./documentation/technical_implementation.md)
*   [Multi-Agent System Design](./documentation/book_development_system.md)
*   [UI/UX Principles](./documentation/UI_UX_Principles.md)
*   [Workflow & Processes](./documentation/workflow_and_processes.md)
*   [Gemini API Development Plan](./documentation/gemini_api_development_plan.md)
*   [Ethical Considerations](./documentation/Ethical_Considerations.md)

---

## <div align="center">🏁 Setup & Launch (Coming Soon) 🏁</div>

*(Detailed instructions for setting up the development environment and running the application will be added here once the initial scaffolding is complete and tested.)*

---

## <div align="center">🤝 Contributing 🤝</div>

*(Contribution guidelines (`CONTRIBUTING.md`) are under development.)*

---

## <div align="center">📜 License 📜</div>

Licensed under the MIT License. See `LICENSE` file (to be created).

---

<div align="center">
<em>An Innovation by SquizAI</em> ⚡
</div>
