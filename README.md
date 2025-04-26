# 📚 BookAgent: AI-Powered Collaborative Textbook Authoring

<!-- Optional: Add a project banner/logo here -->
<!-- ![BookAgent Banner](path/to/your/banner.png) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Planning](https://img.shields.io/badge/Status-Phase%201%20Planning-brightgreen)](./documentation/BookAgent_Roadmap.md)
[![Tech: React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tech: NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Tech: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tech: GCP](https://img.shields.io/badge/Cloud-GCP-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![Tech: Gemini](https://img.shields.io/badge/AI%20Model-Gemini%20(Vertex%20AI)-8954BF)](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models#gemini-models)

---

**BookAgent** is an innovative platform designed to empower educators, researchers, and authors to collaboratively create high-quality, pedagogically-sound textbooks and educational materials using advanced AI assistance. It leverages a multi-agent system powered by Google's Gemini models to streamline research, drafting, editing, and validation.

## ✨ Vision & Goals

Our vision is to revolutionize educational content creation by:

1.  **Accelerating Development:** Significantly reducing the time and effort required to produce comprehensive learning materials.
2.  **Enhancing Quality:** Integrating pedagogical best practices and fact-checking directly into the writing process.
3.  **Facilitating Collaboration:** Providing a seamless workflow for human authors and AI agents to work together effectively.
4.  **Enabling Personalization:** Laying the groundwork for content that can be adapted to different learning styles and objectives.

## 🚀 Core Features (Planned)

*   **Multi-Agent System:** Specialized AI agents (Director, Research, Writer, Editor, Fact-Checker, Pedagogy) collaborate on content creation tasks.
*   **Gemini-Powered Generation:** Utilizes Google's state-of-the-art Gemini models via Vertex AI for research, drafting, and analysis.
*   **Pedagogical Intelligence:** Agents designed to incorporate effective teaching strategies and learning design principles.
*   **Retrieval-Augmented Generation (RAG):** Fact-checking and grounding generated content against reliable sources and user-provided materials.
*   **Collaborative Workflow:** Intuitive UI for users to guide the AI, review drafts, provide feedback, and finalize content.
*   **User Document Integration:** Ability for users to upload their own notes, research, or existing drafts for the AI to reference.

## 🛠️ Technology Stack

*   **Frontend:** React, TypeScript
*   **Backend:** NestJS (Node.js), TypeScript
*   **API:** RESTful APIs (initially)
*   **AI:** Google Gemini 1.5 Pro (via Vertex AI)
*   **Cloud:** Google Cloud Platform (GCP)
*   **Database:** PostgreSQL, Vector Database (TBD for RAG)
*   **Containerization:** Docker

## 🧭 Project Status & Roadmap

BookAgent is currently in the **Phase 1 Planning** stage.

*   **Phase 1:** Foundational Framework & Core Generation (Defining architecture, basic agents, initial UI/UX)
*   **Phase 2:** Enhanced Agents, Validation & Pedagogy (Adding Editor/Fact-Checker/Pedagogy agents, RAG, user uploads)
*   **Phase 3:** Advanced Features & User Experience (Refining UI, advanced pedagogy, integrations)

For detailed planning, see the [Project Roadmap](./documentation/BookAgent_Roadmap.md) and [Technical Implementation](./documentation/technical_implementation.md).

## 📄 Documentation

All project planning, design documents, and research notes can be found in the `/documentation` directory.

*   [Overall Roadmap](./documentation/BookAgent_Roadmap.md)
*   [Technical Implementation Details](./documentation/technical_implementation.md)
*   [Multi-Agent System Design](./documentation/book_development_system.md)
*   [UI/UX Principles](./documentation/UI_UX_Principles.md)
*   [Workflow & Processes](./documentation/workflow_and_processes.md)
*   [Gemini API Plan](./documentation/gemini_api_development_plan.md)

## 🏁 Getting Started

*(Setup instructions will be added here once the project scaffolding is complete)*

1.  Clone the repository: `git clone https://github.com/SquizAI/BookAgent.git`
2.  Navigate to the project directory: `cd BookAgent`
3.  Install dependencies for backend: `cd backend && npm install`
4.  Install dependencies for frontend: `cd ../frontend && npm install`
5.  Configure environment variables (details TBD).
6.  Run backend: `cd ../backend && npm run start:dev`
7.  Run frontend: `cd ../frontend && npm start`

## 🤝 Contributing

*(Contribution guidelines will be added here)*

We welcome contributions! Please see `CONTRIBUTING.md` (to be created) for details on how to submit pull requests, report issues, and suggest features.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file (to be created) for details.

---

*Powered by SquizAI* ⚡
