import "dotenv/config";
import app from "./app.js";

console.log('--- BACKEND DIAGNOSTICS ---');
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log('URL Prefix:', process.env.DATABASE_URL.substring(0, 20) + '...');
}
console.log('---------------------------');

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, () => {
  console.log(`Security Posture Tool backend running on http://localhost:${PORT}`);
});
