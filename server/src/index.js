
import express from 'express';
import cors from 'cors';
import supabase from './supabaseClient.js'; // ✅ works now

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Correct API
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("MIS Backend API Running ✅");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

