import { Database } from "./database.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  "https://hvvoapffcckkpnqdojwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm9hcGZmY2Nra3BucWRvandmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc2MzcsImV4cCI6MjA2MjI5MzYzN30.4qge7VgoIHI69930ObL5xDniodCGQXyhCFx_E_Wi7Jk",
);

export default supabase;
