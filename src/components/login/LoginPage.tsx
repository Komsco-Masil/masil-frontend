"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AppleIcon from "@mui/icons-material/Apple";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { theme } from "@/styles/theme";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: {
    id?: number | string;
    username?: string;
    nickname?: string;
    display_name?: string;
    neighborhood?: string;
    avatar_url?: string | null;
    provider?: string;
  };
};

type ErrorResponse = {
  detail?: string;
};

const Page = styled.main`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: ${theme.colors.textPrimary};
`;

const TopBar = styled.header`
  height: 58px;
  display: flex;
  align-items: center;
  padding: 14px 18px 0;
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-left: -7px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #555;
  cursor: pointer;

  svg {
    font-size: 27px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 57px 46px 28px;
`;

const Brand = styled.div`
  display: grid;
  justify-items: center;
  gap: 13px;
  margin-bottom: 56px;
`;

const LogoBox = styled.div`
  position: relative;
  width: 74px;
  height: 74px;
`;

const BrandCopy = styled.p`
  margin: 0;
  color: #222;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Field = styled.label`
  display: grid;
  gap: 0;
`;

const FieldRow = styled.div<{ $focused?: boolean }>`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 9px;
  min-height: 48px;
  border-bottom: 1px solid ${({ $focused }) => ($focused ? "#37c9a2" : "#e7e7e7")};
  color: ${({ $focused }) => ($focused ? "#37c9a2" : "#d1d1d1")};
  transition:
    border-color 0.16s ease,
    color 0.16s ease;

  svg {
    font-size: 20px;
  }
`;

const Input = styled.input`
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #202020;
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: #cfcfcf;
    font-weight: 500;
  }
`;

const FindLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 14px 0 29px;
  color: #a8a8a8;
  font-size: 13px;
  font-weight: 500;

  span + span::before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 11px;
    margin-right: 12px;
    background: #d7d7d7;
    vertical-align: -1px;
  }
`;

const PrimaryButton = styled.button`
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #37c9a2;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    background: #eeeeee;
    color: #b9b9b9;
    cursor: default;
  }
`;

const ErrorText = styled.p`
  min-height: 18px;
  margin: -2px 0 0;
  color: ${theme.colors.coralDark};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
`;

const SocialArea = styled.div`
  margin-top: auto;
  display: grid;
  justify-items: center;
  gap: 23px;
`;

const SocialTitle = styled.p`
  margin: 0;
  color: #9f9f9f;
  font-size: 13px;
  font-weight: 500;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 17px;
`;

const SocialButton = styled.button<{
  $tone: "kakao" | "naver" | "apple" | "google";
  $asset?: boolean;
}>`
  display: grid;
  place-items: center;
  width: 57px;
  height: 57px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ $tone }) => {
    if ($tone === "kakao" || $tone === "google") return "transparent";
    if ($tone === "naver") return "#22c55e";
    return "#000";
  }};
  color: ${({ $tone }) => ($tone === "kakao" ? "#111" : "#fff")};
  font-size: 25px;
  font-weight: 900;
  cursor: pointer;

  svg {
    font-size: 28px;
  }
`;

const SocialIcon = styled.img`
  width: 57px;
  height: 57px;
  display: block;
`;

const SignupButton = styled.button`
  margin-top: 34px;
  border: 0;
  border-bottom: 1px solid #bcbcbc;
  background: transparent;
  color: #8f8f8f;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const Legal = styled.p`
  margin: 25px 0 0;
  color: #a6a6a6;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.55;
  text-align: center;
`;

function normalizeError(detail: string | undefined) {
  if (!detail) return "요청 처리 중 문제가 생겼습니다.";
  if (detail === "Incorrect nickname or password") return "아이디 또는 비밀번호가 맞지 않습니다.";
  if (detail === "Nickname already exists") return "이미 사용 중인 아이디입니다.";
  if (detail === "Terms agreement is required") return "약관 동의가 필요합니다.";
  return detail;
}

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"userId" | "password" | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const canSubmit = userId.trim().length >= 2 && password.length >= 4;

  const saveSession = (
    tokens: TokenResponse,
    fallbackUser?: {
      id?: string;
      username?: string;
      nickname?: string;
      display_name?: string;
      neighborhood?: string;
      avatar_url?: string | null;
    },
  ) => {
    const user = tokens.user ?? fallbackUser;

    window.localStorage.setItem("masil.accessToken", tokens.access_token);
    window.localStorage.setItem("masil.refreshToken", tokens.refresh_token);
    window.localStorage.setItem(
      "masil.user",
      JSON.stringify({
        id: user?.id ?? userId.trim(),
        loginId: user?.username ?? user?.nickname ?? userId.trim(),
        nickname: user?.display_name ?? user?.nickname ?? userId.trim(),
        neighborhood: user?.neighborhood ?? "",
        avatarUrl: user?.avatar_url ?? undefined,
        provider: tokens.user?.provider ?? "LOCAL",
        loggedInAt: new Date().toISOString(),
      }),
    );
  };

  const requestLogin = async () => {
    const response = await fetch("/api/masil/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: userId.trim(), password }),
    });
    const data = (await response.json()) as TokenResponse & ErrorResponse;

    if (!response.ok) throw new Error(normalizeError(data.detail));
    saveSession(data);
  };

  const requestSocialLogin = async (
    provider: "KAKAO" | "NAVER" | "APPLE" | "GOOGLE",
  ) => {
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/masil/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          social_id: `${provider.toLowerCase()}-demo-user`,
          nickname: `${provider.toLowerCase()}_user`,
          neighborhood: "동네 미설정",
        }),
      });
      const data = (await response.json()) as TokenResponse & ErrorResponse;

      if (!response.ok) throw new Error(normalizeError(data.detail));
      saveSession(data, {
        id: `${provider.toLowerCase()}-demo-user`,
        nickname: `${provider.toLowerCase()}_user`,
        neighborhood: "동네 미설정",
      });
      router.replace("/profile");
    } catch (socialError) {
      setError(socialError instanceof Error ? socialError.message : "소셜 로그인에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || pending) return;

    setPending(true);
    setError("");

    try {
      await requestLogin();
      router.replace("/profile");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "로그인에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <CloseButton type="button" aria-label="닫기" onClick={() => router.back()}>
          <CloseRoundedIcon aria-hidden />
        </CloseButton>
      </TopBar>

      <Content>
        <Brand>
          <LogoBox>
            <Image src="/images/logo.png" alt="마실" fill sizes="74px" priority />
          </LogoBox>
          <BrandCopy>
            지역을 발견하고
            <br />
            단골과 연결되는 마실
          </BrandCopy>
        </Brand>

        <Form onSubmit={submit}>
          <Field>
            <FieldRow $focused={focused === "userId"}>
              <PersonOutlineRoundedIcon aria-hidden />
              <Input
                type="text"
                value={userId}
                placeholder="아이디"
                autoComplete="username"
                minLength={2}
                maxLength={50}
                onFocus={() => setFocused("userId")}
                onBlur={() => setFocused(null)}
                onChange={(event) => setUserId(event.target.value)}
              />
            </FieldRow>
          </Field>

          <Field>
            <FieldRow $focused={focused === "password"}>
              <LockOutlinedIcon aria-hidden />
              <Input
                type="password"
                value={password}
                placeholder="비밀번호 4자 이상"
                autoComplete="current-password"
                minLength={4}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FieldRow>
          </Field>

          <FindLinks>
            <span>아이디 찾기</span>
            <span>비밀번호 찾기</span>
          </FindLinks>

          <ErrorText aria-live="polite">{error}</ErrorText>

          <PrimaryButton type="submit" disabled={!canSubmit || pending}>
            {pending ? "확인 중" : "로그인"}
          </PrimaryButton>
        </Form>

        <SocialArea>
          <SocialTitle>SNS 계정으로 간편 가입하기</SocialTitle>
          <SocialButtons>
            <SocialButton type="button" $tone="kakao" $asset aria-label="카카오 로그인" onClick={() => requestSocialLogin("KAKAO")}>
              <SocialIcon src="/images/kakao-login.svg" alt="" aria-hidden />
            </SocialButton>
            <SocialButton type="button" $tone="naver" aria-label="네이버 로그인" onClick={() => requestSocialLogin("NAVER")}>
              N
            </SocialButton>
            <SocialButton type="button" $tone="apple" aria-label="애플 로그인" onClick={() => requestSocialLogin("APPLE")}>
              <AppleIcon aria-hidden />
            </SocialButton>
            <SocialButton type="button" $tone="google" $asset aria-label="구글 로그인" onClick={() => requestSocialLogin("GOOGLE")}>
              <SocialIcon src="/images/google-login.svg" alt="" aria-hidden />
            </SocialButton>
          </SocialButtons>

          <SignupButton type="button" onClick={() => router.push("/signup")}>
            아이디로 회원가입
          </SignupButton>
        </SocialArea>

        <Legal>
          최초 로그인 시 이용약관과 개인정보 취급방침,
          <br />
          위치기반서비스 이용약관에 동의한 것으로 간주합니다.
        </Legal>
      </Content>
    </Page>
  );
}
