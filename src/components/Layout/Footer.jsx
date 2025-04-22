/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Stack,
  Button,
  TextField,
  IconButton,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  GitHub,
  Twitter,
  LinkedIn,
  Send,
  KeyboardArrowUp,
  MailOutline,
  Article,
  Public,
  Phone,
} from "@mui/icons-material";
import Logo from "../UI/Logo";
import { Tooltip } from "@mui/material";

const FooterLink = ({ to, children, external = false, delay = 0 }) => {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
      >
        <Link
          component={external ? "a" : RouterLink}
          to={external ? undefined : to}
          href={external ? to : undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          color="inherit"
          underline="none"
          sx={{
            display: "inline-block",
            py: 0.5,
            color: "text.secondary",
            transition: "all 0.2s ease",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "0%",
              height: 2,
              bottom: 0,
              left: 0,
              backgroundColor: theme.palette.primary.main,
              transition: "width 0.3s ease",
              opacity: 0.7,
              borderRadius: 2,
            },
            "&:hover": {
              color: "primary.main",
              "&::after": {
                width: "100%",
              },
            },
          }}
        >
          {children}
        </Link>
      </motion.div>
    </Box>
  );
};

const FooterSection = ({ title, children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: delay * 0.2 }}
      >
        <Typography
          variant="subtitle1"
          color="text.primary"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        {children}
      </motion.div>
    </Box>
  );
};

const SocialButton = ({ icon, label, href, delay = 0 }) => {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Tooltip title={label}>
          <IconButton
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      </motion.div>
    </Box>
  );
};

const WaveDivider = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 40,
        width: "100%",
        overflow: "hidden",
        position: "absolute",
        top: -40,
        left: 0,
      }}
    >
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          transform: "rotate(180deg)",
        }}
      >
        <path
          d="M0 50L60 58.3C120 66.7 240 83.3 360 87.5C480 91.7 600 83.3 720 70.8C840 58.3 960 41.7 1080 35.8C1200 30 1320 34.3 1380 36.5L1440 38.7V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
          fill={theme.palette.background.paper}
        />
      </svg>
    </Box>
  );
};

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        mt: "auto",
        pt: 10,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <WaveDivider />

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Logo size={isMobile ? "medium" : "large"} />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, maxWidth: 300 }}
                  >
                    MinuteMe helps you capture and organize meeting minutes with
                    AI-powered transcription. Save time and never miss important
                    details again.
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                    <SocialButton
                      icon={<GitHub />}
                      label="GitHub"
                      href="https://github.com"
                      delay={1}
                    />
                    <SocialButton
                      icon={<Twitter />}
                      label="Twitter"
                      href="https://twitter.com"
                      delay={2}
                    />
                    <SocialButton
                      icon={<LinkedIn />}
                      label="LinkedIn"
                      href="https://linkedin.com"
                      delay={3}
                    />
                  </Stack>
                </motion.div>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <FooterSection title="Product" delay={1}>
                  <Stack spacing={1.5}>
                    <FooterLink to="/" delay={1}>
                      Home
                    </FooterLink>
                    <FooterLink to="/features" delay={2}>
                      Features
                    </FooterLink>
                    <FooterLink to="/pricing" delay={3}>
                      Pricing
                    </FooterLink>
                    <FooterLink to="/faq" delay={4}>
                      FAQ
                    </FooterLink>
                  </Stack>
                </FooterSection>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <FooterSection title="Company" delay={2}>
                  <Stack spacing={1.5}>
                    <FooterLink to="/about" delay={1}>
                      About Us
                    </FooterLink>
                    <FooterLink to="/careers" delay={2}>
                      Careers
                    </FooterLink>
                    <FooterLink to="/blog" delay={3}>
                      Blog
                    </FooterLink>
                    <FooterLink to="/contact" delay={4}>
                      Contact
                    </FooterLink>
                  </Stack>
                </FooterSection>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <FooterSection title="Legal" delay={3}>
                  <Stack spacing={1.5}>
                    <FooterLink to="/privacy" delay={1}>
                      Privacy Policy
                    </FooterLink>
                    <FooterLink to="/terms" delay={2}>
                      Terms of Service
                    </FooterLink>
                    <FooterLink to="/cookies" delay={3}>
                      Cookie Policy
                    </FooterLink>
                    <FooterLink to="/compliance" delay={4}>
                      Compliance
                    </FooterLink>
                  </Stack>
                </FooterSection>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <FooterSection title="Stay Updated" delay={4}>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    "Subscription feature will be implemented in a future update"
                  );
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Your email"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.5
                      ),
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        type="submit"
                        edge="end"
                        size="small"
                        color="primary"
                      >
                        <Send fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />

                <Typography variant="caption" color="text.secondary">
                  Subscribe to our newsletter for updates, tips and special
                  offers.
                </Typography>
              </Box>
            </FooterSection>
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MailOutline
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2">
                      <strong>Email:</strong> info@minuteme.com
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Phone sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body2">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Article
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2">
                      <strong>Support:</strong> help@minuteme.com
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Public sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body2">
                      <strong>Location:</strong> San Francisco, CA
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            pb: 4,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} MinuteMe. All rights reserved.
          </Typography>

          <Box sx={{ mt: { xs: 2, md: 0 } }}>
            <Button
              size="small"
              onClick={scrollToTop}
              endIcon={<KeyboardArrowUp />}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Back to top
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
