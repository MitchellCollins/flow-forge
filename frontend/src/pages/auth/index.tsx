import { useRouter } from "next/router";
import { useState } from "react";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AuthError } from "@/api/auth-api";
import { useAuth } from "@/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type AuthMethod = "signin" | "register";
type HiddenField = "password" | "confirmPassword";

export default function Auth() {
  const [method, setMethod] = useState<AuthMethod>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [hidden, setHidden] = useState<{ password: boolean; confirmPassword: boolean }>({
    password: true,
    confirmPassword: true,
  });

  const router = useRouter();

  const { signin, register } = useAuth();

  const handleError = (err: AuthError) => {
    setError((prevError) => ({ ...prevError, [err.field]: err.message }));
  };

  const handleSubmit = () => {
    setError({}); // Clear errors

    let isValid = true;
    if (email === "") {
      handleError({ field: "email", message: "Require Email" });
      isValid = false;
    }
    if (password === "") {
      handleError({ field: "password", message: "Require Password" });
      isValid = false;
    }

    // Signin
    if (method === "signin") {
      if (!isValid) return;
      signin(email, password).catch(handleError);
      return;
    }

    // Register
    if (confirmPassword === "" || confirmPassword !== password)
      return handleError({ field: "confirmPassword", message: "Must confirm password" });
    register(email, password).catch(handleError);
  };

  const handleChangeMethod = (newMethod: AuthMethod) => {
    setMethod(newMethod);
    setError({});
  };

  const handleChangeHidden = (field: HiddenField) => {
    setHidden((prevHidden) => {
      prevHidden[field] = !prevHidden[field];
      return { ...prevHidden };
    });
  };

  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={4} sx={{ flexDirection: "column" }}>
          {/* Heading */}
          <Grid>
            <Typography variant="h4">Welcome to FlowForge!</Typography>
          </Grid>

          <Divider />

          {/* Auth Method Toggle */}
          <Grid>
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={method}
              onChange={(e, newMethod) => handleChangeMethod(newMethod)}
            >
              <ToggleButton value="signin">Sign in</ToggleButton>
              <ToggleButton value="register">Register</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Form */}
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            {/* Email Input */}
            <Grid>
              <TextField
                type="email"
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText={error.email}
                error={!!error.email}
                required
                fullWidth
              />
            </Grid>

            {/* Password Input */}
            <Grid>
              <FormControl fullWidth>
                <InputLabel required>Password</InputLabel>
                <OutlinedInput
                  type={hidden.password ? "password" : "text"}
                  label="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        color={error.password ? "error" : "primary"}
                        onClick={() => handleChangeHidden("password")}
                      >
                        {hidden.password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText error>{error.password}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Confirm Password Input */}
            {method === "register" && (
              <Grid>
                <FormControl fullWidth>
                  <InputLabel required>Confirm Password</InputLabel>
                  <OutlinedInput
                    type={hidden.confirmPassword ? "password" : "text"}
                    label="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!error.confirmPassword}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          color={error.confirmPassword ? "error" : "primary"}
                          onClick={() => handleChangeHidden("confirmPassword")}
                        >
                          {hidden.confirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error>{error.confirmPassword}</FormHelperText>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Divider />

          {/* Submit & Cancel Buttons */}
          <Grid container spacing={2}>
            <Button variant="contained" onClick={handleSubmit}>
              {method === "register" ? "Register" : "Signin"}
            </Button>
            <Button variant="outlined" color="error" onClick={() => router.push("/")}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
