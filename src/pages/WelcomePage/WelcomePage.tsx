import React, {useState} from "react";

import {useNavigate} from "react-router-dom";

import {
  ButtonBase,
  Paper,
  Box,
  Typography,
} from "@mui/material";

import {EventEditorModal} from "../../modals/EventEditorModal";
import type {IEvent} from "../../api/IEvent";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [editorEventId, setEditorEventId] = useState<string | undefined>(undefined);

  const [randomMessage] = useState(() => getRandomMessage());

  const handleEditorClose = (updatedEvent?: IEvent) => {
    void updatedEvent;
    setEditorEventId(undefined);
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: 560,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: (t) =>
                t.palette.mode === "dark"
                  ? "radial-gradient(circle, rgba(25,118,210,0.18) 0%, rgba(25,118,210,0) 75%)"
                  : "radial-gradient(circle, rgba(25,118,210,0.10) 0%, rgba(25,118,210,0) 75%)",
              position: "absolute",
              transform: "scale(1.6)",
            }}
          />
          <CalendarMonthIcon
            sx={{
              fontSize: 120,
              color: "primary.main",
              filter: (t) =>
                t.palette.mode === "dark"
                  ? "drop-shadow(0 0 18px rgba(25,118,210,0.55))"
                  : "drop-shadow(0 4px 12px rgba(25,118,210,0.28))",
            }}
          />
        </Box>

        {/* Heading */}
        <Box sx={{textAlign: "center"}}>
          <Typography
            variant="h1"
            sx={{
              letterSpacing: "0.06em",
              fontWeight: "bold",
              color: "text.primary",
              mb: 1,
            }}
          >
            Welcome
          </Typography>
          <Box
            sx={{
              width: 48,
              height: 3,
              borderRadius: 2,
              backgroundColor: "primary.main",
              mx: "auto",
              opacity: 0.7,
            }}
          />
        </Box>

        {/* Rotating message */}
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontStyle: "italic",
            lineHeight: 1.75,
            maxWidth: 440,
            px: 1,
          }}
        >
          "{randomMessage}"
        </Typography>

        {/* Nav cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            width: "100%",
          }}
        >
          {NAV_CARDS.map((card) => (
            <ButtonBase
              key={card.label}
              onClick={card.label === "Add Event" ? () => setEditorEventId("") : () => navigate(card.to!)}
              sx={{
                borderRadius: 2,
                display: "block",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  transition: "border-color 0.18s, box-shadow 0.18s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (t) =>
                      t.palette.mode === "dark"
                        ? "0 0 0 1px rgba(25,118,210,0.5)"
                        : "0 0 0 1px rgba(25,118,210,0.25)",
                  },
                }}
              >
                <Box sx={{color: "primary.main", lineHeight: 0}}>
                  {card.icon}
                </Box>
                <Typography variant="body2" sx={{fontWeight: "bold", color: "text.primary"}}>
                  {card.label}
                </Typography>
                <Typography variant="body2" sx={{color: "text.secondary", textAlign: "center", fontSize: "0.75em"}}>
                  {card.subtitle}
                </Typography>
              </Paper>
            </ButtonBase>
          ))}
        </Box>
      </Box>

      <EventEditorModal
        editEventId={editorEventId}
        onClose={() => handleEditorClose()}
      />
    </Box>
  );
};

const MESSAGES = [
  "Every great journey begins with a well-planned calendar.",
  "Time is the most valuable currency — spend it wisely.",
  "A meeting well-scheduled is a goal half-achieved.",
  "Clarity in planning brings peace in execution.",
  "Your agenda shapes your destiny.",
  "Order is not a constraint — it is freedom.",
  "The calendar is the map of your ambitions.",
  "Plan thoughtfully. Act decisively. Reflect often.",
  "Great things rarely happen by accident — they are scheduled.",
  "Structure is the foundation on which creativity flourishes.",
  "Every event is a story waiting to be told.",
  "Precision in time is a form of respect — for yourself and others.",
  "A calendar without intention is just a list of days.",
  "The future belongs to those who prepare for it today.",
  "Small events, carefully curated, build a magnificent life.",
  "Time does not wait — but a good plan gives you a head start.",
  "To organise is to lead — even when you lead only yourself.",
  "An empty calendar is full of possibility.",
  "Moments matter. Capture them before they pass.",
  "The disciplined mind finds opportunity in every scheduled hour.",
];

const getRandomMessage = (): string => MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

interface INavCard {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  to?: string;
}

const NAV_CARDS: INavCard[] = [
  {
    label: "View Events",
    subtitle: "Browse and manage all scheduled events",
    icon: <FormatListBulletedIcon sx={{fontSize: 32}}/>,
    to: "/list",
  },
  {
    label: "Timeline",
    subtitle: "See events laid out across the calendar",
    icon: <TimelineIcon sx={{fontSize: 32}}/>,
    to: "/timeline",
  },
  {
    label: "Add Event",
    subtitle: "Create a new event in your schedule",
    icon: <AddCircleOutlineIcon sx={{fontSize: 32}}/>,
  },
];
