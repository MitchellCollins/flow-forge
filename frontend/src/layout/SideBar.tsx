import { User } from "@/api/auth-api";
import { Organisation, organisationApi } from "@/api/organisation-api";
import { Project, projectApi } from "@/api/project-api";
import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";
import { getInitials } from "@/utils/get-initials";
import {
  Clear,
  DarkMode,
  LightMode,
  Logout,
  Person,
  Search,
  Settings,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";

export function SideBar({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(false);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settingOpen, setSettingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const router = useRouter();

  const { user, signout, onAuth, onUnauth } = useAuth();
  const { mode, changeMode } = useThemeMode();

  const applyQuery = () => {
    if (query.length > 0) setFilter(true);
  };

  const clearQuery = () => {
    setFilter(false);
    setQuery("");
  };

  const openSettings = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setSettingOpen(true);
    setAnchorEl(e.currentTarget);
  };

  const closeSettings = () => {
    setSettingOpen(false);
    setAnchorEl(null);
  };

  /* eslint react-hooks/exhaustive-deps: off */
  useEffect(() => {
    const fetchData = async (id: number) => {
      const [orgs, projs] = await Promise.all([
        organisationApi.getByMember(id),
        projectApi.getByMember(id),
      ]);

      setOrganisations(orgs);
      setProjects(projs);
    };

    const authUnsubscribe = onAuth((newUser: User) => fetchData(newUser.id));
    const unauthUnsubscribe = onUnauth(() => {
      setOrganisations([]);
      setProjects([]);
    });

    return () => {
      authUnsubscribe();
      unauthUnsubscribe();
    };
  }, []);

  const filterOrganisations = filter
    ? organisations.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    : organisations;

  const filterProjects = filter
    ? projects.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()))
    : projects;

  return (
    <Grid container sx={{ flexWrap: "nowrap" }}>
      {/* Side bar */}
      <Grid
        container
        size={3}
        sx={{ height: "100vh", flexDirection: "column", borderRight: "1px solid" }}
      >
        <Stack
          spacing={2}
          sx={{
            flexGrow: 1,
            bgcolor: "Background.paper",
            flexWrap: "nowrap",
            p: 2,
          }}
        >
          {/* Heading */}
          <Typography variant="h4">Flow Forge</Typography>

          {/* Query */}
          <Grid>
            <OutlinedInput
              type="text"
              size="small"
              placeholder="Search"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
              endAdornment={
                <InputAdornment position="end">
                  {filter ? (
                    <Tooltip
                      placement="top"
                      title="Clear Search"
                      enterDelay={500}
                      leaveDelay={250}
                      arrow
                    >
                      <IconButton color="error" onClick={clearQuery}>
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      placement="top"
                      title="Search For Organisation/Project"
                      enterDelay={500}
                      leaveDelay={250}
                      arrow
                    >
                      <IconButton onClick={applyQuery}>
                        <Search />
                      </IconButton>
                    </Tooltip>
                  )}
                </InputAdornment>
              }
            />
          </Grid>

          <Divider />

          {/* Organisations */}
          <Stack spacing={1}>
            <Typography variant="h6">Organisations:</Typography>
            {filterOrganisations.length <= 0 ? (
              <Grid
                container
                component={Paper}
                spacing={1}
                sx={{ p: 1, alignItems: "center", justifyContent: "center" }}
              >
                <Warning color="warning" />
                <Typography variant="h6">No Organisations Found!</Typography>
              </Grid>
            ) : (
              filterOrganisations.map(({ id, name }) => (
                // TODO: Implement Badge for unseen changes
                <Button
                  key={`organisation-${id}`}
                  variant="text"
                  color="inherit"
                  sx={{ justifyContent: "flex-start" }}
                  onClick={() => router.push(`/organisation/${id}`)}
                >
                  {name}
                </Button>
              ))
            )}
          </Stack>

          <Divider />

          {/* Projects */}
          <Stack spacing={1}>
            <Typography variant="h6">Projects:</Typography>

            {filterProjects.length <= 0 ? (
              <Grid
                container
                component={Paper}
                spacing={1}
                sx={{ p: 1, alignItems: "center", justifyContent: "center" }}
              >
                <Warning color="warning" />
                <Typography variant="h6">No Projects Found!</Typography>
              </Grid>
            ) : (
              filterProjects.map(({ id, title }) => (
                // TODO: Implement Badge for unseen changes
                <Button
                  key={`project-${id}`}
                  variant="text"
                  color="inherit"
                  sx={{ justifyContent: "flex-start" }}
                  onClick={() => router.push(`/project/${id}`)}
                >
                  {title}
                </Button>
              ))
            )}
          </Stack>
        </Stack>

        {/* User Profile */}
        <Grid container component={Paper} spacing={1} sx={{ p: 1, alignItems: "center" }}>
          <Avatar>{user ? getInitials(user.email) : <Person />}</Avatar>

          <Typography variant="h6">{user?.email ?? ""}</Typography>

          <Grid sx={{ ml: "auto" }}>
            <IconButton onClick={openSettings}>
              <Settings />
            </IconButton>
            <Menu open={settingOpen} anchorEl={anchorEl} onClose={closeSettings}>
              <Tooltip
                placement="top"
                title="Switch Theme Modes"
                enterDelay={500}
                leaveDelay={250}
                arrow
              >
                <MenuItem>
                  <Grid container sx={{ alignItems: "center" }}>
                    <LightMode />

                    <Switch
                      checked={mode === "dark"}
                      onChange={() => changeMode(mode === "light" ? "dark" : "light")}
                    />

                    <DarkMode />
                  </Grid>
                </MenuItem>
              </Tooltip>
              {/* TODO: Create Sign out functionality */}
              <MenuItem sx={{ color: "error.main", justifyContent: "center" }} onClick={signout}>
                <Grid container spacing={1}>
                  <Typography>Sign Out</Typography>
                  <Logout />
                </Grid>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>

      {/* Other Content */}
      <Grid size="grow" sx={{ m: 2 }}>
        {children}
      </Grid>
    </Grid>
  );
}
