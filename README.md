# Local Setup Instructions

Follow these steps to set up the project locally:

0. **Prerequisites**

Ensure you have the following installed on your machine:

- **Node.js v22.12.0**
- **npm v10.9.0**

This was developed on a `WSL2 Ubuntu 24.04.1 LTS` environment. The project was not tested on other operating systems.

1. **Install dependencies**

```sh
npm install
```

2. **Set up environment variables**  
Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

3. **Update environment variables**  
- Make a copy of the `.env.example` file and rename it to `.env.local` and update the values of the environment variables.

```
cp .env.example .env.local
```  
- Update the values of the environment variables in the `.env.local` file.

```
VITE_TXT_API_URL=http://localhost:8000
```

4. **Run the development server**

```sh
npm run dev
```

5. **Access the application**  
   Open your browser and navigate to `http://localhost:5173`.

