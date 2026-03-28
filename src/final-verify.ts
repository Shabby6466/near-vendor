import { DataSource } from "typeorm";
import { AIService } from "./modules/ai/ai.service";
import * as dotenv from "dotenv";
dotenv.config();

async function verify() {
  const aiService = new AIService();
  await aiService.onModuleInit();
  const vector = await aiService.generateEmbedding("apple notebook computer");
  
  const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: ["src/models/entities/*.entity{.ts,.js}"],
  });

  await AppDataSource.initialize();
  
  const results = await AppDataSource.query(`
    SELECT name, 1 - (embedding <=> $1::vector) as similarity
    FROM items
    ORDER BY similarity DESC
    LIMIT 5
  `, [`[${vector.join(",")}]`]);

  console.log("Verification for 'work':", results);

  await AppDataSource.destroy();
}

verify().catch(console.error);
