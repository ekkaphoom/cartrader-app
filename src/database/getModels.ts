import React from "react";
import { openDB } from "../openDB";

export interface Model {
  model: string;
  count: number;
}
export async function getModels(make: string) {
  const db = await openDB();
  const models = await db.all<Make[]>(
    `
    SELECT model, count(*) as count
    FROM car
    where make=@make
    GROUP BY model
  `,
    { "@make": make }
  );
  return models;
}
