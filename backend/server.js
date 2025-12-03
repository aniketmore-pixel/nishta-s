require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,      // e.g., https://xyzcompany.supabase.co
  process.env.SUPABASE_ANON_KEY   // Found in Supabase → Project → Settings → API
);

// Make supabase client accessible in routes via app.locals
app.locals.supabase = supabase;

// Example route using Supabase JS client
app.get("/api/test", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("your_table") // replace with your table name
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth routes (adjust to use supabase instead of raw pg)
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
