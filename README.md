# Beauty Salon

## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Quick Start

1. **Clone and Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ..
   npm install
   ```

2. **Database Setup**:
   - Create a PostgreSQL database
   - Copy the environment template:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update `backend/.env` with your database credentials

3. **Run Database Migrations**:
   ```bash
   psql -U your_username -d your_database_name -f backend/db_migration_complete.sql
   ```

4. **Start the Application**:
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev
   
   # Terminal 2 - Start frontend
   cd ..
   npm run dev
   ```

5. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Detailed Setup

#### Database Configuration

1. **Create PostgreSQL Database**:
   ```sql
   CREATE DATABASE beauty_salon;
   ```

2. **Environment Variables**:
   Create `backend/.env` file with the following variables:
   ```
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/beauty_salon
   DB_USER=your_username
   DB_HOST=localhost
   DB_NAME=beauty_salon
   DB_PASS=your_password
   DB_PORT=5432

   # Server Configuration
   PORT=5000
   CORS_ORIGIN=http://localhost:5173

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your_very_strong_jwt_secret_here
   ```

3. **Run Migrations**:
   ```bash
   psql -U your_username -d beauty_salon -f backend/db_migration_complete.sql
   ```

#### Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:5000

#### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

### Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `salons` - Salon information
- `services` - Services offered by salons
- `reviews` - Customer reviews and ratings
- `portfolios` - Salon portfolio images
- `faqs` - Frequently asked questions
- And more...

### API Endpoints

- Authentication: `/api/auth/*`
- Salon Management: `/api/salons/*`
- Reviews: `/api/salons/:salonId/reviews`
- Admin: `/api/admin/*`

### Development Notes

- The backend uses Express.js with PostgreSQL
- Frontend uses React with Vite
- Database migrations are consolidated in `backend/db_migration_complete.sql`
- Environment configuration is managed through `.env` files

### Troubleshooting

1. **Database Connection Issues**:
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env`
   - Check if the database exists

2. **Port Conflicts**:
   - Backend default port: 5000
   - Frontend default port: 5173

3. **CORS Issues**:
   - Ensure CORS_ORIGIN in `.env` matches your frontend URL
