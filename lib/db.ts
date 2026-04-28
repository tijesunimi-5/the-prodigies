import { neon } from "@neondatabase/serverless";

// This uses the DATABASE_URL from your .env file
export const sql = neon(process.env.DATABASE_URL!);
