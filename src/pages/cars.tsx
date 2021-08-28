import { Button, Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";

// import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import FormControl from "@material-ui/core/FormControl";
// import Select, { SelectProps } from "@material-ui/core/Select";
import { useRouter } from "next/dist/client/router";
import { getAsString } from "../getAsString";
import Search from ".";
import { CarModel } from "../../api/Car";
import getPaginatedCars from "../database/getPaginatedCars";

import useSWR from "swr";
import React, { useState } from "react";
import deepEqual from "fast-deep-equal";
import CarsPagination from "../components/CarsPagination";
import { stringify } from "querystring";
import CarCard from "../components/CarCard";
import Head from "next/head";

export interface CarsProps {
  makes: Make[];
  models: Model[];
  carModels: CarModel[];
  totalPages: number;
}

const cars = ({ makes, models, carModels, totalPages }: CarsProps) => {
  const { query } = useRouter();
  const [serverQuery] = useState(query);
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { totalPages, cars: carModels }
      : undefined,
  });
  return (
    <div>
      <Head>
        <title>{`Page ${getAsString(query.page) || "1"}`}</title>
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={3} lg={2}>
          <Search singleColumn={true} makes={makes} models={models} />
        </Grid>
        <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
          <Grid item xs={12}>
            <CarsPagination totalPages={data?.totalPages} />
          </Grid>
          {(data?.cars || []).map((car) => (
            <Grid key={car.id} item xs={12} sm={6}>
              <CarCard key={car.id} car={car} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <CarsPagination totalPages={data?.totalPages} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

// export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkPros) {
//   return (
//     <Link
//       href={{
//         pathname: "/cars",
//         query: {
//           ...query,
//           page: item.page,
//         },
//       }}
//       shallow={true}
//     >
//       <a {...props}></a>
//     </Link>
//   );
// }

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pageination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  console.log(
    `pageination.totalPages, ${JSON.stringify(pageination.totalPages)}`
  );
  return {
    props: {
      makes,
      models,
      carModels: pageination.cars,
      totalPages: pageination.totalPages,
    },
  };
};

export default cars;
