// tokenBlacklist.js
const tokenBlacklist = new Set();

function add(token) {
  tokenBlacklist.add(token);
}

function has(token) {
  return tokenBlacklist.has(token);
}

module.exports = { add, has };
