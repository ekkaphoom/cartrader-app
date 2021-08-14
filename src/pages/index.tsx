import { Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/dist/client/router";

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
  // models: Model[];
}

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Home({ makes }: HomProps) {
  const classes = useStyles();
  const handleChange = () => {};
  const { query } = useRouter();
  console.log("query", query);
  const intialValues = {
    make: query.make || "all",
    model: query.model || "all",
    minPrice: query.minPrice || "all",
    maxPrice: query.maxPrice || "all",
  };
  return (
    <Formik initialValues={intialValues} onSubmit={() => {}}>
      {(values) => (
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
                    onChange={handleChange}
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-model">Model</InputLabel>
                  <Field
                    as={Select}
                    name="model"
                    labelId="search-model"
                    id="select-model-select"
                    label="Model"
                  >
                    <MenuItem value="all"></MenuItem>
                    {/* {models} */}
                  </Field>
                </FormControl>
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
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const makes = await getMakes();
  return { props: { makes } };
};
