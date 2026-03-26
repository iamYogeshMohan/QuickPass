# QuickPass

QuickPass is a secure visitor management system that allows residents/hosts to quickly generate digital visitor passes (QR codes) for seamless entry verification by security guards.

## Features
- **Role-based Dashboards:** Host (Resident), Security Guard, and System Admin.
- **Visitor Pass Generation:** Hosts can create a pass with a specified active timeframe.
- **QR Code Verification:** Automatically generates secure QR codes for visitors.
- **Digital Scanning:** Security guards can scan QR codes to instantly verify active visitor passes.
- **Status Badges:** Visual indication if a pass is ACTIVE, EXPIRED, or NOT YET VALID.

## Tech Stack
- Frontend: React (Vite), React Router, HTML5 QR Code
- Backend: Node.js, Express, MongoDB (Mongoose)

## How to Run Locally

### 1. Backend
Navigate to the `server` directory, configure your `.env` file, and start the local server:
```bash
cd server
npm install
npm run start # or node server.js
```

### 2. Frontend
Navigate to the `client` directory and start the Vite development server:
```bash
cd client
npm install
npm run dev
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
