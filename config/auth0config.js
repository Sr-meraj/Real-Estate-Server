import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
    audience: "http://localhost:8000",
    // audience: "https://srmeraj.us.auth0.com/api/v2/",
    issuerBaseURL: "srmeraj.us.auth0.com",
    tokenSigningAlg: "RS256"
})

export default jwtCheck;