import { NextApiRequest, NextApiResponse } from "next";
import getPaginatedCars from "../../database/getPaginatedCars";
import { getAsString } from "../../getAsString";

export default async function Cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPaginatedCars(req.query);
  res.json(cars);
}
