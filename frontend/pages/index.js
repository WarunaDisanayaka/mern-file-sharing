"use client";
import Head from "next/head";

import { useEffect, useState } from "react";
import { BASE_URL, endpoints } from "../helpers/constants/endpoints";
import axios from "axios";
import Button from "@mui/material/Button";
import { Share as ShareIcon } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import PublishIcon from "@mui/icons-material/Publish";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loading from "../components/loading/Loading";
import { Box } from "@mui/material";

import { min } from "moment";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleEnablePassword = (e) => {
    setEnablePassword(e.target.checked);
  };

  const handleCreateShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map selected user IDs to their corresponding emails
      const accessibleUsersEmails = users
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.email);

      const data = {
        name,
        password,
        accessibleUsers: accessibleUsersEmails, // Pass the emails here
      };

      const response = await axios.post(
        `${BASE_URL + endpoints.CREATE_SHARE}`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        router.replace(`/share/create/${response.data.data.shareId}`);
      }
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/all-users`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle checkbox toggle
  const handleSelectUser = (userId) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Unselect if already selected
          : [...prevSelected, userId] // Select if not already selected
    );
  };

  return (
    <>
      <div>
        <Head>
          <title>File Home</title>
        </Head>

        <main
          style={{
            padding: "0.5rem 5rem",
            minHeight: "500px",
            marginBottom: "1rem",
          }}
        >
          <form
            style={{
              maxWidth: "600px",
              minHeight: "250px",
              margin: "1rem auto",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
            }}
            method="post"
            onSubmit={handleCreateShare}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack
                direction="column"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <ShareIcon sx={{ fontSize: "2rem" }} />
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                  }}
                >
                  Share your files
                </Typography>
              </Stack>
              <FormControl sx={{ width: "300px", mb: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-share-name">
                  Share Name
                </InputLabel>
                <OutlinedInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="outlined-adornment-share-name"
                  type="text"
                  label="Share Name"
                  required
                />
              </FormControl>
              <FormControl sx={{ width: "300px", mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleEnablePassword}
                      checked={enablePassword}
                    />
                  }
                  label="Enable password"
                />
              </FormControl>
              {enablePassword && (
                <FormControl sx={{ width: "300px", mb: 2 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              )}
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: "300px",
                  margin: "0rem auto",
                  "@media (max-width: 425px)": {
                    width: "200px",
                  },
                }}
              >
                <Button
                  type="submit"
                  sx={{
                    width: "100%",
                  }}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<PublishIcon />}
                >
                  {loading ? <Loading /> : "Create Share"}
                </Button>
              </Stack>
              <div>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  Select Users
                </Typography>
                <Box>
                  {users.map((user) => (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      key={user._id}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                          />
                        }
                        label={
                          <>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {user.fullName || user.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                          </>
                        }
                      />
                    </Stack>
                  ))}
                </Box>
              </div>
            </div>
          </form>
        </main>

        <style jsx global>{`
        html,
        body {
          padding: 0 
          margin: 0 
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif 
        }
        * {
          box-sizing: border-box 
        }

        @media screen and (max-width: 600px) {
          main {
            padding: 0.5rem 2rem!important;
          }
        }

        @media screen and (max-width: 425px) {
          main {
            padding: 0.5rem 1rem!important;
          }
        }
      `}</style>
      </div>
    </>
  );
}
