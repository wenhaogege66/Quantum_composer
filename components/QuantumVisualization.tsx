import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Divider,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QuantumCircuitOutputBar from "./QuantumCircuitOutputBar";
import QuantumSphereVisualization from "./QuantumSphereVisualization";

interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

interface Props {
  qubits: number;
  gates: GateInfo[];
}

const QuantumVisualization: React.FC<Props> = ({ qubits, gates }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [currentView, setCurrentView] = useState<string>("combined");
  const [expanded, setExpanded] = useState<boolean>(false);

  const barParentDivRef = useRef<HTMLDivElement>(null);
  const [barParentDivWidth, setBarParentDivWidth] = useState(800);
  const [barParentDivHeight, setBarParentDivHeight] = useState(300);

  const sphereParentDivRef = useRef<HTMLDivElement>(null);
  const [sphereParentDivWidth, setSphereParentDivWidth] = useState(500);
  const [sphereParentDivHeight, setSphereParentDivHeight] = useState(300);

  const handleViewChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentView(newValue);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setTimeout(updateParentDivWidth, 50);
  };

  const updateParentDivWidth = () => {
    if (barParentDivRef.current) {
      setBarParentDivWidth(barParentDivRef.current.offsetWidth);
      setBarParentDivHeight(barParentDivRef.current.offsetHeight);
    }
    if (sphereParentDivRef.current) {
      setSphereParentDivWidth(sphereParentDivRef.current.offsetWidth);
      setSphereParentDivHeight(sphereParentDivRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateParentDivWidth();

    window.addEventListener("resize", updateParentDivWidth);

    const timeoutId = setTimeout(updateParentDivWidth, 100);

    return () => {
      window.removeEventListener("resize", updateParentDivWidth);
      clearTimeout(timeoutId);
    };
  }, [currentView, expanded]);

  // 渲染量子态概率分布
  const renderProbabilityDistribution = () => (
    <Paper
      elevation={0}
      ref={barParentDivRef}
      id="barDiv"
      sx={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          m: 0,
          px: 1.5,
          py: 1,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        量子态概率分布
      </Typography>
      <Box
        sx={{
          flex: 1,
          position: "relative",
          p: 1,
          minHeight: 0,
        }}
      >
        <QuantumCircuitOutputBar
          qubits={qubits}
          gates={gates}
          parentWidth={barParentDivWidth - 16}
          parentHeight={
            expanded
              ? 300
              : currentView === "combined"
              ? isTablet
                ? 150
                : 180
              : barParentDivHeight - 56
          }
        />
      </Box>
    </Paper>
  );

  // 渲染布洛赫球表示
  const renderBlochSphere = () => (
    <Paper
      elevation={0}
      ref={sphereParentDivRef}
      id="sphereDiv"
      className="quantum-visualization-container"
      sx={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          m: 0,
          px: 1.5,
          py: 1,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        布洛赫球表示
      </Typography>
      <Box
        className="quantum-visualization-container"
        sx={{
          flex: 1,
          position: "relative",
          p: 1,
          minHeight: currentView === "combined" ? "250px" : "350px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          aspectRatio: "1/1", // 确保盒子是正方形
        }}
      >
        <QuantumSphereVisualization
          qubits={qubits}
          gates={gates}
          parentWidth={sphereParentDivWidth - 16}
          parentHeight={
            expanded
              ? 300
              : currentView === "combined"
              ? isTablet
                ? 250
                : 280
              : sphereParentDivHeight - 56
          }
        />
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: currentView === "combined" ? "row" : "column",
          },
          gap: 2,
          height: expanded ? "auto" : "100%",
          maxHeight: expanded ? "none" : "100%",
          transition: "height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {(currentView === "combined" || currentView === "probability") &&
            renderProbabilityDistribution()}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {(currentView === "combined" || currentView === "bloch") &&
            renderBlochSphere()}
        </Box>
      </Box>
    </Box>
  );
};

export default QuantumVisualization;
