import { Avatar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import NotiIcon from "@/public/icons/noti.svg";
import SearchIcon from "@/public/icons/search.svg";
import { useEffect, useState } from "react";
import { NoHoverButton } from "./elements/styledElements";
interface AppbarToolbarUIProps {
  isLogin: boolean;
  handleLogout: () => void;
  certificate: string;
  fontColor: string;
  focusTap: string;
  isScroll?: number;
}

const AppbarToolbarUI: React.FC<AppbarToolbarUIProps> = ({
  isLogin,
  certificate,
  fontColor,
  focusTap,
  isScroll,
}) => {
  const [scrollState, setScrollState] = useState<boolean>(true);

  useEffect(() => {
    if (isScroll === undefined) return;
    if (isScroll >= 40) {
      setScrollState(true);
    } else {
      setScrollState(false);
    }
  }, [isScroll]);
  return (
    <Toolbar
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        "&.MuiToolbar-root": {
          padding: 0,
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NoHoverButton
            href="/"
            onClick={() => {
              localStorage.setItem("focusTap", "");
            }}
          >
            <Image
              src="https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
              alt="Sitemark"
              width={20}
              height={20}
            />
            <Typography variant="h1" sx={{ color: fontColor, ml: 2 }} fontSize={"24px"}>
              자비서
            </Typography>
            {certificate !== "" && (
              <Typography
                variant="subtitle1"
                fontSize="16px"
                color={scrollState ? "var(--c-sub5)" : "white"}
                sx={{
                  mx: 2,
                  display: {
                    xs: "none",
                    md: "flex",
                  },
                }}
              >
                {certificate}
              </Typography>
            )}
          </NoHoverButton>
          <NoHoverButton
            sx={{ color: "black", display: { xs: "none", md: "flex" } }}
            href="/learning"
            onClick={() => {
              localStorage.setItem("focusTap", "문제풀이");
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color:
                  focusTap === "문제풀이" ? (scrollState ? "var(--c-main)" : "white") : fontColor,
                ml: 2,
                filter:
                  focusTap === "문제풀이"
                    ? scrollState
                      ? "none"
                      : "drop-shadow(0px 1px 12px #16396F80)"
                    : "none",
              }}
              fontSize={"16px"}
            >
              문제풀이
            </Typography>
          </NoHoverButton>
          <NoHoverButton
            sx={{ color: "black", display: { xs: "none", md: "flex" } }}
            href="/bookmark"
            onClick={() => {
              localStorage.setItem("focusTap", "북마크");
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color:
                  focusTap === "북마크" ? (scrollState ? "var(--c-main)" : "white") : fontColor,
                ml: 2,
                filter:
                  focusTap === "북마크"
                    ? scrollState
                      ? "none"
                      : "drop-shadow(0px 1px 12px #16396F80)"
                    : "none",
              }}
              fontSize={"16px"}
            >
              북마크
            </Typography>
          </NoHoverButton>
          <NoHoverButton
            sx={{ color: "black", display: { xs: "none", md: "flex" } }}
            href="/assistant"
            onClick={() => {
              localStorage.setItem("focusTap", "학습비서");
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color:
                  focusTap === "학습비서" ? (scrollState ? "var(--c-main)" : "white") : fontColor,
                ml: 2,
                filter:
                  focusTap === "학습비서"
                    ? scrollState
                      ? "none"
                      : "drop-shadow(0px 1px 12px #16396F80)"
                    : "none",
              }}
              fontSize={"16px"}
            >
              학습비서
            </Typography>
          </NoHoverButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {!isLogin ? (
          <>
            <NoHoverButton
              sx={{
                marginLeft: 2,
                backgroundColor: "white",
                display: { xs: "none", md: "flex" },
                borderRadius: "30px",
                border: "1px solid var(--c-main)",
                boxShadow: "none",
                "&:hover": {
                  backgroundcolor: "white",
                  boxShadow: "none",
                },
              }}
              href="/login"
            >
              <Typography variant="h4" fontSize={"16px"} color="var(--c-main)">
                로그인
              </Typography>
            </NoHoverButton>

            <NoHoverButton href="/search" sx={{ padding: 0, minHeight: 0, minWidth: 0, mx: 1 }}>
              <SearchIcon width={24} height={24} color={fontColor} />
            </NoHoverButton>
          </>
        ) : (
          <>
            <NoHoverButton href="/noti" sx={{ padding: 0, minHeight: 0, minWidth: 0, mx: 1 }}>
              <NotiIcon width={24} height={24} color={fontColor} />
            </NoHoverButton>
            <NoHoverButton href="/search" sx={{ padding: 0, minHeight: 0, minWidth: 0, mx: 1 }}>
              <SearchIcon width={24} height={24} color={fontColor} />
            </NoHoverButton>
            <IconButton href="/mypage" sx={{ display: { xs: "none", md: "flex" } }}>
              <Avatar alt="User" src="user-avatar.jpg" />
            </IconButton>
          </>
        )}
      </Box>
    </Toolbar>
  );
};

export default AppbarToolbarUI;
