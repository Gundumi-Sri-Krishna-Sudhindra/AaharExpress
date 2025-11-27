# Aaharexpress: Revolutionizing Food Delivery with a Purpose 🍽️💡

## Introduction
Aaharexpress is more than just a food delivery platform—it’s a movement towards a world where no one goes hungry. While traditional food delivery services focus on convenience, Aaharexpress introduces a unique feature that allows users to donate meals directly to those in need. 

## Why Aaharexpress? 🌟
Food delivery apps like Zomato and Swiggy have made ordering food easier than ever, but they often overlook the pressing issue of hunger. Aaharexpress bridges this gap by integrating a donation system within its food delivery service. 

## How It Works 🧐
1. **Order Food** – Browse and order from a variety of restaurants, just like any other food delivery service.
2. **Donate a Meal** – When placing an order, you get the option to donate a portion of food to someone in need.
3. **Direct Impact** – Your food donation goes directly to people who need it, ensuring that hunger is tackled effectively.

## Key Features 🚀
- **Standard Food Delivery:** Order from your favorite restaurants with a seamless experience.
- **Food Donation:** Contribute meals instead of just donating money.
- **Community Impact:** Help reduce hunger while enjoying your favorite dishes.
- **Sustainable Approach:** Reduce food waste by channeling excess food to those in need.

## The Mission 💖
Aaharexpress aims to make food a right, not a privilege. By allowing users to donate meals with every order, we are taking a step toward ending hunger and ensuring that no one goes to bed hungry.

## The Vision 🌱
- **Hunger-Free Communities:** Every meal ordered can contribute to solving hunger.
- **Minimizing Food Waste:** Redirecting excess food to those who need it most.
- **Inspiring Change:** Encouraging people to rethink food delivery as a means to help society.

## Get Involved 🤝
Want to be part of the change? Here’s how you can help:
- **Use the App:** Order and donate meals through Aaharexpress.
- **Spread the Word:** Share our mission with friends and family.
- **Partner with Us:** Restaurants and organizations can collaborate to maximize impact.

## Conclusion 🌍💙
Aaharexpress is not just about delivering food—it’s about delivering hope. Together, we can create a world where no one goes hungry. Let’s make a difference, one meal at a time. ❤️

---

## Contact Us 📩
For inquiries and partnerships, reach out to us at **aaharexpressindia@gmail.com**.

## Local Development Setup 🛠️

1. **Database** – Start a MySQL instance locally and create the schema once:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS aahar_express CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```
2. **Backend API** – Run the Spring Boot service:
   ```bash
   ./mvnw spring-boot:run
   ```
   The app listens on `http://localhost:8080` and accepts CORS requests from `http://localhost:5173`, `5175`, and Netlify dev (`http://localhost:8888`).
3. **Serverless proxy (optional)** – If you need the Netlify functions locally (so your frontend can keep calling `/api/auth/...`), install Node dependencies once and run Netlify Dev:
   ```bash
   npm install
   SPRING_BOOT_BASE_URL=http://localhost:8080 npx netlify dev --functions netlify/functions --port 8888
   ```
   Restart the dev server whenever you change `.env` or the `SPRING_BOOT_BASE_URL` value so new variables take effect.
4. **Frontend** – Configure your frontend `.env` to point at either `http://localhost:8080` (direct Spring Boot) or `http://localhost:8888` (Netlify proxy). Watch the browser network tab and backend logs during login attempts to confirm requests are reaching the API and whether failures are due to CORS/network or authentication.
