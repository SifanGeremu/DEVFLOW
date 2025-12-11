import dotenv from 'dotenv';
dotenv.config();
import pool from './src/config/db.js';
import express from 'express';
const app = express ();
const PORT = process.env.PORT || 3000;

// middleware to parse json bodies 
app.use(express.json());

app.listen(PORT,()=>{
    console.log("LISTENING ON `${PORT}`");
}
)
// sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;
