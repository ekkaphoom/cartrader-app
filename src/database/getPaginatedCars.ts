import React from "react";
import PropTypes from "prop-types";
import { ParsedUrlQuery } from "querystring";
import { openDB } from "../openDB";
import { CarModel } from "../../api/Car";
import { getAsString } from "../getAsString";

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make=make)
    AND (@model is NULL OR @model=model )
    AND (@minPrice is NULL or @minPrice<=price)
    AND (@maxPrice is NULL or @maxPrice>=price)
`;
export default async function getPaginatedCars(query: ParsedUrlQuery) {
  const db = await openDB();
  const page = getValueNumber(query.page) || 1;
  const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
  const offset = (page - 1) * rowsPerPage;

  const dbParams = {
    "@make": getValueStr(query.make),
    "@model": getValueStr(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
  };

  console.log("dbParams", dbParams);

  const carsPromise = db.all<CarModel[]>(
    `
    SELECT *
    ${mainQuery}
    LIMIT @rowsPerPage OFFSET @offset
  `,
    {
      ...dbParams,
      "@rowsPerPage": rowsPerPage,
      "@offset": offset,
    }
  );

  const totalRowsPromise = db.get<{ count: number }>(
    `
    SELECT count(*) as count
    ${mainQuery}
  `,
    dbParams
  );

  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);
  console.log(
    `cars ${JSON.stringify(cars)}, totalRows ${JSON.stringify(totalRows)}`
  );
  return { totalPages: Math.ceil(totalRows.count / rowsPerPage), cars };
}

function getValueNumber(value: string | string[]) {
  const str = getValueStr(value);
  const number = parseInt(str);
  return isNaN(number) ? null : number;
}

function getValueStr(value: string | string[]) {
  const str = getAsString(value);
  return !str || str.toLowerCase() === "all" ? null : str;
}
