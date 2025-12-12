import { TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

export const ProfileEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        type="text"
        placeholder="First name"
        {...register("First name", { required: true, maxLength: 80 })}
      />
      <input
        type="text"
        placeholder="Last name"
        {...register("Last name", { required: true, maxLength: 100 })}
      />
      <input
        type="text"
        placeholder="Email"
        {...register("Email", { required: true })}
      />
      <input
        type="text"
        placeholder="Display Name"
        {...register("Display Name", {
          required: true,
          max: 50,
          min: 3,
          maxLength: 50,
        })}
      />
      <input
        type="password"
        placeholder="Password"
        {...register("Password", {
          required: true,
          max: 28,
          min: 7,
          maxLength: 28,
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{12,64}$/i,
        })}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("Confirm Password", {
          max: 28,
          min: 8,
          maxLength: 28,
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{12,64}$/i,
        })}
      />

      <input type="submit" />
    </form>
  );
};
