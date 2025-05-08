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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
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
          height: expanded
            ? "300px"
            : currentView === "combined"
            ? isTablet
              ? "150px"
              : "180px"
            : "calc(100% - 40px)",
          minHeight: expanded ? "300px" : "150px",
        }}
      >
        <QuantumCircuitOutputBar
          qubits={qubits}
          gates={gates}
          parentWidth={barParentDivWidth - 16} // 减去padding
          parentHeight={
            expanded
              ? 300
              : currentView === "combined"
              ? isTablet
                ? 150
                : 180
              : barParentDivHeight - 56
          } // 减去标题和padding高度
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
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
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
        sx={{
          flex: 1,
          position: "relative",
          p: 1,
          height: expanded
            ? "300px"
            : currentView === "combined"
            ? isTablet
              ? "150px"
              : "180px"
            : "calc(100% - 40px)",
          minHeight: expanded ? "300px" : "150px",
        }}
      >
        <QuantumSphereVisualization
          qubits={qubits}
          gates={gates}
          parentWidth={sphereParentDivWidth - 16} // 减去padding
          parentHeight={
            expanded
              ? 300
              : currentView === "combined"
              ? isTablet
                ? 150
                : 180
              : sphereParentDivHeight - 56
          } // 减去标题和padding高度
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
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          mb: 1,
        }}
      >
        <Tabs
          value={currentView}
          onChange={handleViewChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: "36px",
            "& .MuiTab-root": {
              minHeight: "36px",
              fontSize: "0.8rem",
              textTransform: "none",
              fontWeight: 500,
            },
            flexGrow: 1,
          }}
        >
          <Tab value="combined" label="组合视图" />
          <Tab value="probability" label="概率分布" />
          <Tab value="bloch" label="布洛赫球" />
        </Tabs>
        <IconButton size="small" onClick={toggleExpand} sx={{ mr: 1 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: currentView === "combined" ? "row" : "column",
          },
          overflow: expanded ? "auto" : "hidden",
          gap: 2,
          height: expanded ? "auto" : "100%",
          maxHeight: expanded ? "none" : "100%",
          transition: "height 0.3s ease",
        }}
      >
        {(currentView === "combined" || currentView === "probability") &&
          renderProbabilityDistribution()}
        {(currentView === "combined" || currentView === "bloch") &&
          renderBlochSphere()}
      </Box>
    </Box>
  );
};

export default QuantumVisualization;
