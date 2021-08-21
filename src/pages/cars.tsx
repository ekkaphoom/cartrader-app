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

import Pagination, {
  PaginationRenderItemParams,
} from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { getAsString } from "../getAsString";
import Search from ".";
import { CarModel } from "../../api/Car";
import getPaginatedCars from "../database/getPaginatedCars";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";

export interface CarsProps {
  makes: Make[];
  models: Model[];
  carModels: CarModel[];
  totalPage: number;
}

const cars = ({ makes, models, carModels, totalPage }: CarsProps) => {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn={true} makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={7} md={9} lg={10}>
        <pre>
          <Pagination
            page={parseInt(getAsString(query.page) || "1")}
            count={10}
            renderItem={(item) => (
              <PaginationItem
                component={MaterialUiLink}
                query={query}
                item={item}
                {...item}
              />
            )}
          />
          {JSON.stringify({ totalPage, carModels }, null, 4)}
        </pre>
      </Grid>
    </Grid>
  );
};

export interface MaterialUiLinkPros {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkPros) {
  return (
    <Link
      href={{
        pathname: "/cars",
        query: {
          ...query,
          page: item.page,
        },
      }}
    >
      <a {...props}></a>
    </Link>
  );
}

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
      totalPage: pageination.totalPages,
    },
  };
};

export default cars;
