"use client";
import useCertificateInfo from "@/src/hooks/useCertificateInfo";
import {
  Box,
  Button,
  Collapse,
  Pagination,
  SelectChangeEvent,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BookMarkModal from "./bookmarkModal";
import ExamChoice from "./examChoice";
import BookmarkProblemList from "./problemList";
import SubjectChoice from "./subjectChoice";
import BookMarkSlider from "./bookMarkSlider";
import { globalTheme } from "@/src/components/globalStyle";
import { NoHoverButton } from "@/src/components/elements/styledElements";
import useBookmarks from "@/src/hooks/useBookmarks";
import { mainfetch } from "@/src/api/apis/mainFetch";
const MobileBookMarkMain = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const handleSliderOpen = () => {
    setIsSliderOpen(prev => !prev);
  };
  const [isModalOpen, setisModalOpen] = useState(false);
  const { certificateInfo, loading, error } = useCertificateInfo();
  const [selectedExam, setSelectedExam] = useState<string>("전체 회차");
  const [problems, setProblems] = useState<BookMarkProblem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number>(0);
  const [selectedSubjectsId, setSelectedSubjectsId] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { bookmarkedProblems, totalPage } = useBookmarks({
    selectedExamId,
    selectedSubjectsId,
    page,
  });
  const handleModalOpen = () => {
    setisModalOpen(prev => !prev);
  };

  const gotoStudyMode = () => {
    // 공부 모드로 이동하는 함수
  };
  const gotoExamMode = () => {
    // 시험 모드로 이동하는 함수
  };

  useEffect(() => {
    setProblems(bookmarkedProblems);
  }, [bookmarkedProblems]);
  const selectProblem = (problemId: number) => {
    if (selectedProblems.includes(problemId)) {
      setSelectedProblems(selectedProblems.filter(id => id !== problemId));
    } else {
      setSelectedProblems([...selectedProblems, problemId]);
    }
  };

  const handleBookmark = async (problemId: number) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const targetProblem = problems.find(problem => problem.problemId === problemId);
      if (!targetProblem) throw new Error("Problem not found");
      const method = targetProblem.isBookmark ? "DELETE" : "POST";
      const endpoint = "/bookmarks";

      await mainfetch(
        endpoint,
        {
          method,
          body: {
            problemId,
          },
        },
        true
      );

      const handledProblems = problems.map(problem =>
        problem.problemId === problemId ? { ...problem, isBookmark: !problem.isBookmark } : problem
      );

      setProblems(handledProblems);
    } catch (error) {
    } finally {
      setIsProcessing(false); // 처리 완료
    }
  };

  const selectAllProblems = () => {
    const allProblems = problems.map(problem => problem.problemId);
    setSelectedProblems(allProblems);
  };

  const deselectAllProblems = () => {
    setSelectedProblems([]);
  };

  const handleExamChoice = (event: SelectChangeEvent) => {
    setSelectedExam(event.target.value as string);
    const examId = certificateInfo!.exams.find(
      exam => exam.description === event.target.value
    )!.examId;
    setSelectedExamId(examId);
  };

  useEffect(() => {
    if (certificateInfo === undefined) return;
    const subjects = certificateInfo.subjects;
    setSelectedSubjects(subjects);
    setSelectedExam(certificateInfo.exams[0].description);
    setSelectedSubjectsId(subjects.map(subject => subject.subjectId));
  }, [certificateInfo]);

  const handleSubjectChoice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const getNewSelectedSubjects = () => {
      const isSelected = selectedSubjects.some(subject => subject.name === value);

      // 만약 isSelected가 true이면 해당 항목을 제거한 배열을 반환
      if (isSelected) {
        return selectedSubjects.filter(subject => subject.name !== value);
      } else {
        // isSelected가 false이면 해당 항목을 추가한 배열을 반환
        const selectedSubject = certificateInfo?.subjects.find(subject => subject.name === value);
        if (selectedSubject) {
          return [...selectedSubjects, selectedSubject];
        } else {
          // 만약 해당하는 subject.name을 찾지 못했을 경우 기존 배열을 반환
          return selectedSubjects;
        }
      }
    };
    const newSelectedSubjects = getNewSelectedSubjects();
    setSelectedSubjects(newSelectedSubjects);
    // const newSelectedSubjectsId = [];
    setSelectedSubjectsId(newSelectedSubjects.map(subject => subject.subjectId));
  };
  const handleChangePage = (page: number) => {
    setPage(page);
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "130px",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ mt: 12 }} height="100%" width="90%">
          <Typography variant="h1" gutterBottom fontSize="18px" align="center" mb="21px">
            북마크
          </Typography>
          <BookMarkSlider
            handleSliderOpen={handleSliderOpen}
            selectedSubjects={selectedSubjects}
            selectedExam={selectedExam}
          />
          <Collapse in={isSliderOpen}>
            <SubjectChoice
              subjects={certificateInfo!.subjects}
              handleSubjectChoice={handleSubjectChoice}
              selectedSubjects={selectedSubjects}
            />
            <ExamChoice
              exams={certificateInfo!.exams}
              handleExamChoice={handleExamChoice}
              selectedExam={selectedExam!}
            />
          </Collapse>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <NoHoverButton
                  onClick={selectAllProblems}
                  sx={{
                    mr: 1,
                    borderRadius: "40px",
                    padding: "4px 12px",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontSize={{
                      xs: "12px",
                      sm: "16px",
                    }}
                    color="var(--c-gray5)"
                  >
                    전체 선택
                  </Typography>
                </NoHoverButton>
                <NoHoverButton
                  onClick={deselectAllProblems}
                  sx={{
                    borderRadius: "40px",
                    padding: "4px 12px",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontSize={{
                      xs: "12px",
                      sm: "16px",
                    }}
                    color="var(--c-gray3)"
                  >
                    전체 해제
                  </Typography>
                </NoHoverButton>
              </Box>
              <Button
                onClick={handleModalOpen}
                sx={{
                  border: "1.5px solid var(--c-main)",
                  borderRadius: "40px",
                  padding: "4px 12px",
                  backgroundColor: "var(--c-main)",
                  "&:hover": {
                    backgroundColor: "var(--c-main)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontSize={{
                    xs: "12px",
                    sm: "16px",
                  }}
                  color="white"
                >
                  문제풀기
                </Typography>
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography fontSize="18px" variant="subtitle1">
                총&nbsp;
              </Typography>
              <Typography fontSize="18px" variant="subtitle1" color="var(--c-main)">
                {problems.length}
              </Typography>
              <Typography fontSize="18px" variant="subtitle1">
                개의 북마크
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography fontSize="18px" variant="subtitle1" color="var(--c-main)">
                {selectedProblems.length}
              </Typography>
              <Typography fontSize="18px" variant="subtitle1">
                개 선택
              </Typography>
            </Box>
          </Box>
          <BookmarkProblemList
            totalPage={totalPage}
            handleChangePage={handleChangePage}
            problems={problems}
            selectedProblems={selectedProblems}
            selectProblem={selectProblem}
            handleBookmark={handleBookmark}
          />
        </Box>

        <BookMarkModal
          isModalOpen={isModalOpen}
          handleModal={handleModalOpen}
          gotoStudyMode={gotoStudyMode}
          gotoExamMode={gotoExamMode}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MobileBookMarkMain;
