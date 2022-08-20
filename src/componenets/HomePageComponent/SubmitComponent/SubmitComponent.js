import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import moment from "moment";

import { useHttpClient } from "../../hooks/useHttpClient";
function SubmitComponent(props) {
  const [qr_str, setqr_str] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const submit_form2 = async (fields) => {
    function reverseString(str) {
      return str
        .split("")
        .sort(() => 1)
        .join("");
    }

    console.log(fields);

    let plate_no = fields.plate_no.split(" ").join("");
    let plate_str = fields.plate_str.split(" ").join("");
    let plate_str2 = reverseString(plate_str);

    try {
      const responseData = await sendRequest(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/v1/cars/getcar/${plate_no}/${encodeURI(plate_str2)}`
      );

      console.log("responseData ", responseData);
      props.setPostedCar(responseData);
      let qr_str = responseData.data[0].qr_str;
      setqr_str(qr_str);
    } catch (err) {
      console.log(err);
    }
  };

  const submit_form = async (fields) => {
    console.log({
      new_maintainance_date: moment(Date.now()).format("DD/MM/YYYY"),
    });
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/cars/${props.PostedCar.data[0]._id}`,
        "PUT",
        JSON.stringify({
          new_maintainance_date: moment(Date.now()).format("MM/DD/YYYY"),
          maintainer_note: fields.maintainer_note,
          maintenance_period: fields.maintenance_period,
        }),
        { "Content-Type": "application/json" }
      );
      console.log("responseData ", responseData);
      props.setUpdatedCar(true);
    } catch (err) {
      console.log({ err });
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          maintainer_note: "",
          maintenance_period: 10,
        }}
        // validationSchema={Yup.object().shape({
        //     firstName: Yup.string().required('First Name is required'),
        //     lastName: Yup.string().required('Last Name is required'),
        //     email: Yup.string().email('Email is invalid') .required('Email is required'),

        // })}
        onSubmit={(fields) => {
          // alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))

          submit_form(fields);
        }}
        render={({ errors, status, touched }) => (
          <Form>
            <div md="12">
              <label className="form_text form_label">Maintainer Note</label>
            </div>
            <div md="12" className="mb-3">
              <Field
                name={`maintainer_note`}
                className="form-control in_field"
                as="textarea"
              ></Field>
              {/* <ErrorMessage name='birth_date' component={TextError} /> */}
            </div>

            <label className="form_text form_label">
              Maintenance Period (in days)
            </label>
            <Field
              style={{
                width: "100%",
              }}
              name={`maintenance_period`}
              className="form-control in_field"
              type={"number"}
              min="10"
            ></Field>
            {/* <ErrorMessage name='birth_date' component={TextError} /> */}
            <div>
              <Button
                style={{
                  height: "130px",
                  width: "100%",
                  fontSize: "35px",
                  marginTop: "20px",
                }}
                color="primary"
                type="submit"
              >
                update maintainance date
              </Button>
            </div>

            <div>{error}</div>
          </Form>
        )}
      />
    </div>
  );
}

export default SubmitComponent;
