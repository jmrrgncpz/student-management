export const server =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://lt-student-management-api.herokuapp.com";
