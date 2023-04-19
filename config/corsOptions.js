// Set up domains that can access backend
const whitelist = [
  "https://herbal-stoner-frontend.web.app/",
  "https://herbal-stoner-frontend.firebaseapp.com",
  "http:/localhost:3000",
];
// Cors Options
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS..."));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
