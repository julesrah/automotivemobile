// const expressjwt = require('express-jwt');
const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  
  return jwt({
    secret,
    algorithms: ["HS256"],
    // isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/api\/v1\/tools(.*)/, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/ , methods: ['GET', "POST", "PUT", "DELETE",'OPTIONS'] },
      { url: /\/api\/v1\/brands(.*)/ , methods: ['GET', "POST", "PUT", "DELETE", 'OPTIONS'] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/borrows(.*)/ , methods: ['GET','POST','PUT','OPTIONS'] },
      `${api}/users`,
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (payload.role !== "admin") {
    // If the user does not have the "admin" role, revoke access
    done(null, true);
  } else {
    // If the user has the "admin" role, grant access
    done();
  }
}


module.exports = authJwt;
