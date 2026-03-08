const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las credenciales de Supabase en las variables de entorno.');
}


const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;