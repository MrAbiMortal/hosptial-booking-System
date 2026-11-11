# Paramananda Clinic

MEAN stack appointment pre-booking for Paramananda Clinic (பரமானந்தா கிளினிக்). The backend and Angular application live directly in the root `backend` and `frontend` directories.

## Requirements

- Node.js 20.19+ and npm
- MongoDB Community Server running locally, or a MongoDB connection string

## Start the backend (PowerShell 5.1)

From the repository root, run each command on its own line:

```powershell
Set-Location .\backend
npm install
Copy-Item .env.example .env
notepad .env
```

Set `PORT=3000` and `MONGO_URI=mongodb://127.0.0.1:27017/paramananda_clinic` in `.env`, save it, then run:

```powershell
npm run seed
npm start
```

The API listens at `http://localhost:3000`. To use a non-local MongoDB instance, replace `MONGO_URI` with its connection string. Update the sample doctor's contact and registration details in `seed.js` before using this outside development.

## Start the existing Angular app

Open a second PowerShell window at the repository root:

```powershell
Set-Location .\frontend
npm install
npm start
```

Open `http://localhost:4200`. The app routes `/` to `/prebook` and also provides `/doctor-register`.

## Create a fresh Angular app and copy in the source

From the repository root, create a standalone Angular application, then copy this project's complete `src` tree over the generated one:

```powershell
npx -p @angular/cli@latest ng new frontend-setup --standalone --routing --style=css --ssr=false
Copy-Item -Path .\frontend\src\* -Destination .\frontend-setup\src -Recurse -Force
Set-Location .\frontend-setup
npm install zone.js
npm start
```

The source includes `main.ts`, `app.config.ts` with `provideZoneChangeDetection`, routes, and separate `.ts`, `.html`, and `.css` files for each component. `api.service.ts` targets `http://localhost:3000/api`.

## API

- `POST /api/doctors` register a doctor
- `GET /api/doctors` list doctors
- `GET /api/doctors/:id` get a doctor
- `GET /api/doctors/:id/slots?date=YYYY-MM-DD` get generated slots with availability
- `POST /api/appointments` book an available slot
- `GET /api/appointments?phone=&date=&doctor=` search appointments
- `PATCH /api/appointments/:id/cancel` cancel a booking

Booked slots are protected by a partial unique MongoDB index, so concurrent bookings cannot claim the same doctor/date/time.
Booking IDs are clinic-wide numbers from 1 to 10,000 and restart each day at midnight Asia/Kolkata time.
