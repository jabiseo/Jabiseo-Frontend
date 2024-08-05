"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import ProblemItem from "./problemItem";
import ResultInfoUI from "./resultInfoUI";

const ProblemList = ({ problems }: { problems: ProblemViewType[] }) => {
  const solvedProblem = `${
    problems.filter(problem => problem.chooseNumber === problem.answerNumber).length
  } / ${problems.filter(problem => problem.chooseNumber !== 0).length}`;
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <ResultInfoUI solvedProblem={solvedProblem} isSm={isSm} />
      <Box
        sx={{
          maxWidth: "1165px",
          width: "100%",
          paddingX: "25px",
          boxSizing: "border-box",
          marginBottom: "110px",
        }}
      >
        {problems.map((problem, index) => (
          <ProblemItem props={problem} isSm={isSm} key={problem.problemId} />
        ))}
      </Box>
    </>
  );
};

export default ProblemList;
