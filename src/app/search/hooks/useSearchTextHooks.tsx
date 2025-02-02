import { useCallback, useEffect, useState } from "react";
import { debounce } from "@/src/api/apis/debounce";
import { mainfetch } from "@/src/api/apis/mainFetch";
import useCertificates from "@/src/hooks/useCertificates";
import { SelectChangeEvent } from "@mui/material";
import handleBookmarkModule from "@/src/api/apis/handleBookmark";
const useSearchTextHooks = () => {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProblemType[]>([]);
  const [isLastResult, setIsLastResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { certificates } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateType>();
  useEffect(() => {
    if (certificates.length > 0) {
      setSelectedCertificate(certificates[0]);
    }
  }, [certificates]);

  const handleCertificateSelect = (event: SelectChangeEvent) => {
    setSelectedCertificate(certificates.find(cert => cert.name === event.target.value)!);
  };
  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const getMoreData = useCallback(() => {
    if (searchResults.length === 0 || isLastResult) return;
    getData(
      text,
      searchResults[searchResults.length - 1].score,
      searchResults[searchResults.length - 1].problemId
    );
  }, [searchResults, isLastResult]);
  const handleBookmark = useCallback(
    (problem: SearchProblemType) => {
      handleBookmarkModule<SearchProblemType>(
        problem,
        isProcessing,
        setIsProcessing,
        setSearchResults
      );
    },
    [isProcessing, setIsProcessing, setSearchResults]
  );
  const getData = useCallback(
    async (searchText: string, lastScore?: number, lastId?: number) => {
      if (isLoading || !selectedCertificate?.certificateId) return;
      setIsLoading(true);
      const isLogin = localStorage.getItem("accessToken") ? true : false;

      try {
        const response = await mainfetch(
          `/problems/search?query=${searchText}${lastScore ? `&last-score=${lastScore}` : ""}${
            lastId ? `&last-id=${lastId}` : ""
          }&certificate-id=${selectedCertificate?.certificateId}`,
          {
            method: "GET",
          },
          isLogin
        );
        if (!response.ok) {
          alert("검색 요청에 실패했습니다.");
          return;
        }
        const data = await response.json();
        if (data.length === 0) {
          setIsLastResult(true);
          return;
        }
        setIsLastResult(false);
        setSearchResults(prevResults => [...prevResults, ...data]);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, selectedCertificate]
  );
  const debouncedSearch = useCallback(
    debounce(async (searchText: string, lastScore?: number, lastId?: number) => {
      getData(searchText);
    }, 300),
    [selectedCertificate]
  );

  useEffect(() => {
    if (text) {
      debouncedSearch(text);
    }
  }, [text, debouncedSearch, selectedCertificate]);

  return {
    text,
    handleChangeText,
    searchResults,
    handleBookmark,
    getMoreData,
    handleCertificateSelect,
    selectedCertificate,
    certificates,
  };
};

export default useSearchTextHooks;
