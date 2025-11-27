# Aaharexpress: Revolutionizing Food Delivery with a Purpose 🍽️💡

## Introduction

Aaharexpress is more than just a food delivery platform—it's a movement towards a world where no one goes hungry. While traditional food delivery services focus on convenience, Aaharexpress introduces a unique feature that allows users to donate meals directly to those in need.

## Why Aaharexpress? 🌟

Food delivery apps like Zomato and Swiggy have made ordering food easier than ever, but they often overlook the pressing issue of hunger. Aaharexpress bridges this gap by integrating a donation system within its food delivery service.

## How It Works 🧐

1. **Order Food** – Browse and order from a variety of restaurants, just like any other food delivery service.
2. **Donate a Meal** – When placing an order, you get the option to donate a portion of food to someone in need.
3. **Direct Impact** – Your food donation goes directly to people who need it, ensuring that hunger is tackled effectively.

## Key Features 🚀

- **Standard Food Delivery**: Order from your favorite restaurants with a seamless experience.
- **Food Donation**: Contribute meals instead of just donating money.
- **Community Impact**: Help reduce hunger while enjoying your favorite dishes.
- **Sustainable Approach**: Reduce food waste by channeling excess food to those in need.

## The Mission 💖

Aaharexpress aims to make food a right, not a privilege. By allowing users to donate meals with every order, we are taking a step toward ending hunger and ensuring that no one goes to bed hungry.

## The Vision 🌱

- **Hunger-Free Communities**: Every meal ordered can contribute to solving hunger.
- **Minimizing Food Waste**: Redirecting excess food to those who need it most.
- **Inspiring Change**: Encouraging people to rethink food delivery as a means to help society.

## Get Involved 🤝

Want to be part of the change? Here's how you can help:

- **Use the App**: Order and donate meals through Aaharexpress.
- **Spread the Word**: Share our mission with friends and family.
- **Partner with Us**: Restaurants and organizations can collaborate to maximize impact.

## Tech Stack 🛠️

### Frontend
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 6.4.1
- **State Management**: Redux Toolkit 2.7.0
- **Routing**: React Router DOM 6.22.0
- **Styling**: Styled Components 6.1.17
- **Form Management**: Formik 2.4.5 with Yup 1.3.3 validation
- **HTTP Client**: Axios 1.12.2
- **Email Service**: EmailJS 4.4.1
- **Web Server**: Nginx (for production)

### Backend
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 21
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **ORM**: Spring Data JPA
- **Database**: MySQL 8.0.33 (Production), H2 (Testing)
- **Email**: Spring Boot Mail
- **Validation**: Spring Boot Validation
- **Build Tool**: Maven 3.9

### Infrastructure & DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions
- **Configuration Management**: Ansible
- **Container Registry**: Docker Hub

## CI/CD Pipeline Implementation 🔄

### GitHub Actions Workflow

The project uses GitHub Actions for automated CI/CD with the following pipeline:

#### Pipeline Stages:

1. **Trigger Events**:
   - Push to `main` or `master` branches
   - Manual workflow dispatch

2. **Build & Push Docker Images**:
   - **Frontend**: Builds React application using Vite and creates a multi-stage Docker image with Nginx
   - **Backend**: Builds Spring Boot application using Maven and creates a multi-stage Docker image with JRE
   - Both images are pushed to Docker Hub

3. **Deploy to Kubernetes**:
   - SSH into the deployment server
   - Clone/update the repository
   - Configure Kubernetes access
   - Ensure Kubernetes services are running
   - Apply Kubernetes manifests for:
     - Frontend deployment (2 replicas)
     - Backend deployment (2 replicas)
     - MySQL database
     - Ingress configuration
     - Services (ClusterIP for backend, LoadBalancer for frontend)

#### Kubernetes Architecture:

- **Frontend Deployment**:
  - 2 replicas for high availability
  - Nginx container serving static files
  - LoadBalancer service exposing port 80

- **Backend Deployment**:
  - 2 replicas for high availability
  - Spring Boot application on port 8080
  - ClusterIP service for internal communication
  - Environment variables for database connection

- **Database**:
  - MySQL service with persistent storage
  - Secrets management for credentials

- **Ingress**:
  - Routes traffic to frontend service
  - Configurable for custom domains

#### Ansible Automation:

- **Deployment Playbook**: Automates the deployment of Kubernetes manifests
- **Setup Playbook**: Configures Kubernetes cluster infrastructure
- Manifests are copied to `/opt/k8s` and applied using `kubectl`

#### Required Secrets:

The CI/CD pipeline requires the following GitHub Secrets:
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `SERVER_IP`: Deployment server IP address
- `SERVER_USER`: SSH username for deployment server
- `SERVER_SSH_KEY`: SSH private key for authentication

### Deployment Flow:

```
Code Push → GitHub Actions Trigger
    ↓
Build Frontend & Backend Docker Images
    ↓
Push Images to Docker Hub
    ↓
SSH to Deployment Server
    ↓
Update Repository & Configure Kubernetes
    ↓
Apply Kubernetes Manifests
    ↓
Deployment Complete ✅
```

## Project Structure 📁

```
AaharExpress/
├── AaharExpress_F/          # Frontend React Application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store and slices
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Frontend Docker image
│   └── nginx.conf           # Nginx configuration
├── AaharExpress_B/          # Backend Spring Boot Application
│   ├── src/
│   │   └── main/java/       # Java source code
│   └── DockerFile           # Backend Docker image
├── k8s/                     # Kubernetes manifests
│   ├── frontend-deploy.yaml
│   ├── backend-deploy.yaml
│   ├── mysql-deploy.yaml
│   └── ingress.yaml
├── ansible/                 # Ansible playbooks
│   ├── playbooks/
│   └── files/
└── .github/workflows/       # GitHub Actions workflows
    └── cicd.yml
```

## Getting Started 🚀

### Prerequisites

- Node.js 20+ and npm
- Java 21
- Maven 3.9+
- Docker
- Kubernetes cluster (for production deployment)
- MySQL 8.0+

### Local Development

#### Frontend Setup:
```bash
cd AaharExpress_F
npm install
npm run dev
```

#### Backend Setup:
```bash
cd AaharExpress_B
mvn clean install
mvn spring-boot:run
```

### Docker Deployment

#### Build Images:
```bash
# Frontend
docker build -t app-frontend:latest ./AaharExpress_F

# Backend
docker build -t app-backend:latest ./AaharExpress_B
```

#### Run with Docker Compose (if configured):
```bash
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get services
kubectl get pods
```

## Environment Variables

### Backend:
- `DB_URL`: MySQL database connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `FRONTEND_ORIGINS`: Allowed CORS origins

### Frontend:
- `BACKEND_URL`: Backend API endpoint URL

## Conclusion 🌍💙

Aaharexpress is not just about delivering food—it's about delivering hope. Together, we can create a world where no one goes hungry. Let's make a difference, one meal at a time. ❤️

## Contact Us 📩

For inquiries and partnerships, reach out to us at **aaharexpressindia@gmail.com**.

---

**Built with ❤️ for a hunger-free world**
