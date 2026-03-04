# Clinique Cardio - Frontend Setup

## Project Structure

```
frontEnd/
├── src/
│   ├── lib/
│   │   └── axios.ts          # Axios configuration for backend API
│   ├── pages/
│   │   ├── Landing.tsx       # Landing page with login button
│   │   ├── Login.tsx         # Login page with role-based routing
│   │   ├── AdminDashboard.tsx    # Admin dashboard
│   │   ├── DoctorDashboard.tsx   # Doctor dashboard
│   │   └── ClientDashboard.tsx   # Patient/Client dashboard
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind CSS imports
├── .env                      # Environment variables
└── package.json              # Dependencies
```

## Features

### 1. Landing Page (`/`)
- Beautiful gradient background with animations
- Logo and title
- "Se Connecter" button that navigates to login

### 2. Login Page (`/login`)
- Email and password inputs
- Show/hide password toggle
- Loading states
- Error handling
- Role-based redirects:
  - **Admin** → `/admin/dashboard`
  - **Doctor** → `/doctor/dashboard`
  - **Patient/Client** → `/client/dashboard`

### 3. Admin Dashboard (`/admin/dashboard`)
- Header with user info and logout button
- Stats cards: Total Patients, Doctors, Appointments, Today's Appointments
- Welcome message
- Protected route (only accessible to admins)

### 4. Doctor Dashboard (`/doctor/dashboard`)
- Header with doctor name and specialty
- Quick stats: Today's appointments, patients, consultations
- Professional information display
- Logout button

### 5. Client Dashboard (`/client/dashboard`)
- Patient information display
- Quick action cards
- Appointments and consultations stats
- Profile information

## How to Run

### Prerequisites
- Node.js installed
- Backend Laravel server running on `http://127.0.0.1:8000`

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## Backend Integration

The frontend is configured to connect to the Laravel backend at `http://127.0.0.1:8000`.

### API Endpoints Used:
- `GET /sanctum/csrf-cookie` - Get CSRF token
- `POST /api/login` - Login with email and password
- `POST /api/logout` - Logout
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)

### Authentication Flow:
1. User visits landing page
2. Clicks "Se Connecter" → redirected to `/login`
3. Enters credentials (email and password)
4. Frontend gets CSRF cookie from backend
5. Sends login request with credentials (`mot_de_passe` field)
6. Backend returns user data with `type` field
7. Frontend stores user data in localStorage
8. Redirects based on user type:
   - `type: 'admin'` or `role: 'admin'` → Admin Dashboard
   - `type: 'doctor'` → Doctor Dashboard
   - `type: 'patient'` or `type: 'client'` → Client Dashboard

## Test Users

Use the test users from the backend:

### Admin
```
Email: admin@clinique.com
Password: admin123456
```

### Doctor
```
Email: doctor@clinique.com
Password: password
```

### Patient
```
Email: patient@clinique.com
Password: password
```

## Technologies Used

- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **React Router DOM 7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling
- **Laravel Sanctum** - Authentication (session-based)

## Environment Variables

Create a `.env` file in the root:
```env
VITE_API_URL=http://127.0.0.1:8000
```

## Development Notes

- All pages use TypeScript for type safety
- Axios is configured with CSRF token interceptor
- Sessions are stored in cookies (handled by Laravel Sanctum)
- User data is stored in localStorage for quick access
- Protected routes check user type and redirect if unauthorized
- Responsive design with Tailwind CSS
- Modern UI with gradients, shadows, and animations

## Troubleshooting

### CORS Errors
Make sure your Laravel backend has CORS configured for `http://localhost:5173` in `config/cors.php`.

### CSRF Token Mismatch
- Ensure Laravel backend is running
- Check that Sanctum stateful domains include `localhost:5173` in `config/sanctum.php`
- Clear browser cookies and try again

### Redirect Issues
- Check that user data in localStorage has correct `type` or `role` field
- Verify backend returns proper user type in login response
