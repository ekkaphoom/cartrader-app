import { Button, Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";
import { useRouter } from "next/dist/client/router";

import { getAsString } from "../getAsString";
import useSWR from "swr";
import { isBuffer } from "util";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
  // formControl: {
  //   margin: theme.spacing(1),
  //   minWidth: 120,
  // },
  // selectEmpty: {
  //   marginTop: theme.spacing(2),
  // },
}));

export interface HomProps {
  makes: Make[];
  models: Model[];
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Home({ makes, models }: HomProps) {
  const router = useRouter();
  const classes = useStyles();
  const { query } = useRouter();
  console.log("query", query);
  const intialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };
  return (
    <Formik
      initialValues={intialValues}
      onSubmit={(values) => {
        console.log("submit", values);
        router.push(
          {
            pathname: "/",
            query: { page: 1, ...values },
          },
          undefined,
          {
            shallow: true,
          }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    as={Select}
                    name="make"
                    labelId="search-make"
                    id="search-make-select"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem key={make.make} value={make.make}>
                        {make.make}({make.count})
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ModelSelect name="model" models={models} make={values.make} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-minPrice">Min Price</InputLabel>
                  <Field
                    as={Select}
                    name="minPrice"
                    labelId="search-minPrice"
                    id="select-minPrice-select"
                    label="Min Price"
                  >
                    <MenuItem value="all">No Min</MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-maxPrice">Max Price</InputLabel>
                  <Field
                    as={Select}
                    name="maxPrice"
                    labelId="search-maxPrice"
                    id="select-maxPrice-select"
                    label="Max Price"
                  >
                    <MenuItem value="all">No Max</MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Search for Cars
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}
export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });
  console.log("field", field);

  const { data } = useSWR<Model[]>(`/api/models?make=${make}`, {
    onSuccess: (newValues) => {
      if (!newValues.map((v) => v.model).includes(field.value)) {
        // select all
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;
  console.log(data);
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>
      <Select
        name="model"
        labelId="search-model"
        id="search-model-select"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => (
          <MenuItem key={model.model} value={model.model}>
            {model.model}({model.count})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  return { props: { makes, models } };
};
