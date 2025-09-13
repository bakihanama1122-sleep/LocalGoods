# E-commerce Platform for Local Goods & Antiques

<div align="center">
<!--   <img src="https://capsule-render.vercel.app/api?type=waving&color=2a3c24&height=200&section=header&text=Local+Heritage+Marketplace&fontSize=35&fontColor=fff&animation=twinkling" alt="Local Heritage Banner"/>
  <br/> -->
  <img width="100%" src="./public/github_banner_2.png" alt="E-commerce Banner"/>
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="6"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2500&pause=1000&color=0F766E&center=true&vCenter=true&width=800&lines=Shop+Local+🛍;Local+Goods,+Global+Love+🌏;Empowering+Local+Sellers+💼" alt="Typing Animation" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="6"/>
</p>

<p align="center">
  <b>🎓 Academic Project - Software Engineering Practice Course</b>
</p>

---

## 📊 Project Insights

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Closed PRs</b></td>
            <td><b>🛠 Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/AnilKumt/LocalGoods?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/AnilKumt/LocalGoods?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/AnilKumt/LocalGoods?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/AnilKumt/LocalGoods?style=flat&logo=github"/></td>
            <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/AnilKumt/LocalGoods?style=flat&color=critical&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/AnilKumt/LocalGoods?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/AnilKumt/LocalGoods?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

---

## 🎯 About This Project

> *🏺 Bridging tradition with technology*  
> This e-commerce platform is designed to support local artisans, antique dealers, and heritage enthusiasts by providing a modern marketplace for traditional goods and cultural artifacts.

*Key Features:*
- 🛒 *Local Product Showcase* - Dedicated space for regional artisans
- 🏛 *Antique Authentication* - heritage items
<!-- - 📱 *Mobile-First Design* - Optimized for all devices
- 🔐 *Secure Transactions* - Safe payment processing
- 🌍 *Community Driven* - Supporting local economies -->

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=2500&pause=1000&color=DC2626&center=true&vCenter=true&width=600&lines=Built+with+Modern+Tech+Stack+💻;Nx+Monorepo+Architecture+🏗;Academic+Project+" alt="Tech Stack Animation"/>
</p>

---

## 🏗 Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Seller Dashboard   │  Admin Dashboard      │
│     (Next.js)     │   (React)           │    (React)            │
│                   │   (Next.js)         │    (Next.js)          │
└─────────────┬─────────────┬─────────────────┬───────────────────┘
              │             │                 │
              │             │                 │
┌─────────────▼─────────────▼─────────────────▼───────────────────┐
│                       API GATEWAY                               │
│                    (Express.js/NextJS)                          │
└─────────────┬─────────────┬─────────────────┬───────────────────┘
              │             │                 │
┌─────────────▼─────────────▼─────────────────▼───────────────────┐
│                    MICROSERVICES LAYER                          │
├─────────────┬─────────────┬─────────────────┬───────────────────┤
│   User      │  Product    │   Order         │  Payment          │
│  Service    │  Service    │  Service        │  Service          │
│ (Node.js)   │ (Node.js)   │ (Node.js)       │ (Node.js)         │
└─────────────┴─────────────┴─────────────────┴───────────────────┘
              │             │                 │
┌─────────────▼─────────────▼─────────────────▼───────────────────┐
│                      DATA LAYER                                 │
├─────────────┬─────────────┬─────────────────┬───────────────────┤
│  MongoDB    │   MongoDB   │   Redis Cache   │   ImageKit        │
│  (Users &   │ (Products & │  (Sessions &    │   (Images &       │
│   Orders)   │ Inventory)  │   Cache)        │   Documents)      │
└─────────────┴─────────────┴─────────────────┴───────────────────┘
```

### Backend Services Overview

| Service | Technology | Purpose | Port |
|---------|------------|---------|------|
| *API Gateway* | Express.js | Request routing, authentication | 3000 |
| *User Service* | Node.js + TypeScript | User management, authentication | 3001 |
| *Product Service* | Node.js + TypeScript | Product catalog, search | 3002 |
| *Order Service* | Node.js + TypeScript | Order processing, tracking | 3003 |
| *Payment Service* | Node.js + TypeScript | Payment processing, invoicing | 3004 |
| *Notification Service* | Node.js + TypeScript | Email, SMS, push notifications | 3005 |

---

## 📁 Nx Monorepo Structure

```
LocalGoods/
├── apps/                          # Applications
│   ├── api-gateway/               # Express.js API Gateway
│   ├── auth-service/              # Authentication Service              
├── packages/                      # Shared utilities
|   ├── error-handler/             
│   ├── middleware/                
├── docs/                         # Documentation
│   ├── api/                      # API documentation
│   ├── architecture/             # System architecture
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE.md                   # MIT License
├── README.md                    # This file
├── nx.json                      # Nx workspace configuration
├── package.json                 # Root dependencies
```

---

## 🚀 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)


### Database & Storage
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)


<!-- ### DevOps & Tools
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Nx](https://img.shields.io/badge/Nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) -->

---

## 🏃‍♂ Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB
- Redis

### Installation

1. *Clone the Repository*
   ```
   git clone https://github.com/AnilKumt/LocalGoods.git
   cd LocalGoods
   ```

2. *Install Dependencies*
   ```bash
   npm install
   # or
   yarn install
   ```

3. *Environment Setup*
   ```bash
   cp .env.example .env
   ```

4. *Start Development Server*
   ```bash
   # Start all services
   npm run start
   
   # Or start specific apps
   npx nx serve web-app
   npx nx serve api-gateway
   ```

5. *Access Applications*
   - Web App: http://localhost:8080
   - API Gateway: http://localhost:6001
   <!-- - Admin Dashboard: http://localhost:4201 -->

---

## 📊 Features Overview

| Feature | Description | Status |
|---------|-------------|--------|
| *User Authentication* | JWT-based auth with role management | 📅 Planned |
| *Product Catalog* | Advanced search, filtering, categorization | 📅 Planned |
| *Shopping Cart* | Persistent cart, guest checkout | 📅 Planned |
| *Order Management* | Order tracking, history, cancellation |📅 Planned |
| *Payment Integration* | payment gateways | 📅 Planned |
| *Admin Dashboard* | Analytics, inventory, user management | 📅 Planned |
| *AI Recommendations* | ML-based product suggestions | 📅 Planned |

---


## 📚 Documentation

- [Problem Statement document](https://drive.google.com/file/d/1-3j64WxglpiKoj3YPfysKK2KjOjeR43l/view?usp=sharing)
- [Software Requirement Specification](https://drive.google.com/file/d/1ijne6Q9LSeGNK4VVcsFMMGtDJqI2-Jsv/view?usp=sharing)
- [Architecture Guide](./docs/architecture/README.md)
---

## 🤝 Contributing

We welcome contributions from fellow students and developers! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Development Workflow

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Make your changes.
4. Commit your changes: git commit -m 'feat: add amazing feature'
5. Push to the branch: git push origin feature/amazing-feature
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 👥 Team & Collaborators

<div align="center">
  <h3>Team</h3>
</div>


<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/AnilKumt">
        <img width="120" src="https://github.com/AnilKumt.png" width="80" alt="Team Member 1"/>
        <br />
        <sub><b>Anil Kumawat</b></sub>
        <br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/aditya-kumar-seth">
        <img width="120" src="https://github.com/aditya-kumar-seth.png" width="80" alt="Team Member 2"/>
        <br />
        <sub><b>Aditya Kumar Seth</b></sub>
        <br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Prak-bhar">
        <img width="120" src="https://github.com/Prak-bhar.png" width="80" alt="Team Member 3"/>
        <br />
        <sub><b>Prakhar Bhardhwaj</b></sub>
        <br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Sowmya0327">
        <img width="120" src="https://github.com/Sowmya0327.png" width="80" alt="Team Member 4"/>
        <br />
        <sub><b>Sowmya</b></sub>
        <br />
      </a>
    </td>
  </tr>
</table>

### Contributors
<!-- readme: contributors -start -->
<p align="center">
    <img height="80" width="80" src="https://contrib.rocks/image?repo=AnilKumt/LocalGoods" alt="Contributors"/>
</p>
<!-- readme: contributors -end -->

---

## Contact

- *Issues*: [GitHub Issues](https://github.com/AnilKumt/LocalGoods/issues)
- *Discussions*: [GitHub Discussions](https://github.com/AnilKumt/LocalGoods/discussions)

---

## Acknowledgments

- *Course*: Software Engineering Practice
- *Semester*: 5th


---

## 📈 Project Status

![Built with Love](https://img.shields.io/badge/Built%20With-❤-red?style=for-the-badge)
![Academic Project](https://img.shields.io/badge/Academic-Project-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---


<div align="center">
  <img src="./public/prod_banner_2.png" alt="Local Products Showcase" width="100%"/>
  <p><i>Celebrating local craftsmanship and cultural heritage</i></p>
</div>

---

<div align="center">
  <p><b>🏺 Preserving tradition through technology 🏺</b></p>
  <p><sub>Made with ❤ by Software Engineering Practice Team</sub></p>
</div>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>
