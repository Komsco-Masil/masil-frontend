"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { theme } from "@/styles/theme";

type IdStatus = "idle" | "checking" | "available" | "taken" | "error";
type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};
type ErrorResponse = {
  detail?: string;
};

const NEIGHBORHOODS = [
  "가산동",
  "가정동",
  "갈산동",
  "고기동",
  "고등동",
  "고색동",
  "고천동",
  "곡선동",
  "관양동",
  "권선동",
  "금곡동",
  "대전 유성구 덕명동",
  "대전 유성구 궁동",
  "대전 서구 둔산동",
  "서랑동",
  "서천동",
  "화서동",
];

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=160&q=80",
];

const Page = styled.main`
  min-height: 100dvh;
  background: #fff;
  color: ${theme.colors.textPrimary};
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 5;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  height: 58px;
  padding: 12px 14px 0;
  background: #fff;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #555;
  cursor: pointer;

  svg {
    font-size: 23px;
  }
`;

const StepText = styled.span`
  justify-self: center;
  color: #aaa;
  font-size: 12px;
  font-weight: 700;
`;

const Content = styled.div`
  padding: 28px 28px 34px;
`;

const BrandLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
`;

const LogoBox = styled.div`
  position: relative;
  width: 34px;
  height: 34px;
`;

const BrandName = styled.strong`
  color: #ff6f00;
  font-size: 14px;
  font-weight: 900;
`;

const Title = styled.h1`
  margin: 0;
  color: #202020;
  font-size: 25px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: 0;
`;

const Description = styled.p`
  margin: 10px 0 27px;
  color: #8d8d8d;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.span`
  color: #555;
  font-size: 12px;
  font-weight: 800;
`;

const FieldRow = styled.div<{ $active?: boolean }>`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 9px;
  min-height: 50px;
  border-bottom: 1px solid ${({ $active }) => ($active ? "#37c9a2" : "#e8e8e8")};
  color: ${({ $active }) => ($active ? "#37c9a2" : "#d1d1d1")};

  svg {
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #202020;
  font-size: 16px;
  font-weight: 600;

  &::placeholder {
    color: #cfcfcf;
    font-weight: 500;
  }
`;

const Helper = styled.p<{ $tone?: "ok" | "bad" }>`
  min-height: 18px;
  margin: -2px 0 0;
  color: ${({ $tone }) => ($tone === "ok" ? "#20a983" : $tone === "bad" ? "#ef5a5a" : "#aaa")};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
`;

const SearchPanel = styled.section`
  display: grid;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 7px;
  height: 42px;
  border-bottom: 1px solid #e8e8e8;
  color: #777;

  svg {
    font-size: 20px;
  }
`;

const OrangeButton = styled.button`
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: #ff7f27;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const ResultTitle = styled.p`
  margin: 2px 0 0;
  color: #aaa;
  font-size: 12px;
  font-weight: 600;
`;

const NeighborhoodList = styled.div`
  display: grid;
`;

const NeighborhoodItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #f2f2f2;
  background: transparent;
  color: ${({ $selected }) => ($selected ? "#20a983" : "#333")};
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 800 : 500)};
  text-align: left;
  cursor: pointer;

  svg {
    color: #37c9a2;
    font-size: 18px;
  }
`;

const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 74px 0 30px;
  color: #333;
  font-size: 13px;
  font-weight: 700;
  text-align: center;

  svg {
    width: 56px;
    height: 56px;
    padding: 12px;
    border-radius: 18px;
    background: #36dd8d;
    color: #fff;
  }

  span {
    color: #ff7f27;
  }
`;

const AvatarGrid = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 3px;
`;

const AvatarButton = styled.button<{ $active?: boolean }>`
  position: relative;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 2px solid ${({ $active }) => ($active ? "#37c9a2" : "transparent")};
  border-radius: 50%;
  background: #f4f4f4;
  overflow: hidden;
  cursor: pointer;
`;

const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const UploadButton = styled.label`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px dashed #d7d7d7;
  color: #aaa;
  cursor: pointer;

  svg {
    font-size: 23px;
  }
`;

const HiddenFile = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const Summary = styled.div`
  display: grid;
  gap: 9px;
  padding: 14px;
  border-radius: 12px;
  background: #fafafa;
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  color: #999;
  font-size: 12px;
  font-weight: 700;

  strong {
    color: #252525;
    font-weight: 800;
    text-align: right;
  }
`;

const CompleteBox = styled.section`
  display: grid;
  justify-items: center;
  gap: 16px;
  padding-top: 44px;
  text-align: center;
`;

const CompleteIcon = styled.div`
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 24px;
  background: #effff9;
  color: #37c9a2;

  svg {
    font-size: 42px;
  }
`;

const Actions = styled.div`
  display: grid;
  gap: 9px;
  margin-top: 18px;
`;

const PrimaryButton = styled.button`
  height: 50px;
  border: 0;
  border-radius: 10px;
  background: #37c9a2;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    background: #efefef;
    color: #b8b8b8;
    cursor: default;
  }
`;

const GhostButton = styled.button`
  height: 42px;
  border: 0;
  background: transparent;
  color: #999;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

function normalizeError(detail: string | undefined) {
  if (!detail) return "요청 처리 중 문제가 생겼습니다.";
  if (detail === "Nickname already exists") return "이미 사용 중인 아이디입니다.";
  if (detail === "Terms agreement is required") return "약관 동의가 필요합니다.";
  return detail;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
  const [focused, setFocused] = useState<string | null>(null);
  const [idStatus, setIdStatus] = useState<IdStatus>("idle");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const filteredNeighborhoods = useMemo(() => {
    const query = neighborhoodQuery.trim();
    if (!query) return NEIGHBORHOODS;
    return NEIGHBORHOODS.filter((item) => item.includes(query));
  }, [neighborhoodQuery]);

  useEffect(() => {
    const id = userId.trim();
    if (id.length < 2) return;

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/masil/auth/check-id?id=${encodeURIComponent(id)}`);
        const data = (await response.json()) as { available?: boolean };
        if (response.status === 503) {
          setIdStatus("error");
          return;
        }
        setIdStatus(response.ok && data.available ? "available" : "taken");
      } catch {
        setIdStatus("error");
      }
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [userId]);

  const changeUserId = (nextId: string) => {
    setUserId(nextId);
    setIdStatus(nextId.trim().length < 2 ? "idle" : "checking");
  };

  const title =
    step === 1
      ? "사용할 아이디를\n입력해주세요"
      : step === 2
        ? "이메일을\n입력해주세요"
        : step === 3
          ? "비밀번호를\n설정해주세요"
          : step === 4
            ? "활동할 동네를\n확인해주세요"
            : step === 5
              ? "마실에서 보일\n프로필을 골라주세요"
              : "가입이\n완료됐어요";

  const description =
    step === 1
      ? "입력하면 자동으로 중복 여부를 확인합니다."
      : step === 2
        ? "계정 안내를 받을 이메일 주소를 적어주세요."
        : step === 3
          ? "영문, 숫자를 섞어 4자 이상 입력해주세요."
          : step === 4
            ? "검색하거나 전체 동네 목록에서 선택할 수 있어요."
            : step === 5
              ? "닉네임과 프로필 사진은 나중에 마이페이지에서 바꿀 수 있어요."
              : "이제 마실에서 동네 소식과 가게 이야기를 볼 수 있어요.";

  const idHelper =
    idStatus === "checking"
      ? "아이디 확인 중입니다."
      : idStatus === "available"
        ? "사용 가능한 아이디입니다."
        : idStatus === "taken"
          ? "이미 사용 중인 아이디입니다."
          : idStatus === "error"
            ? "서버 확인은 가입 완료 때 다시 진행합니다."
            : "아이디는 2자 이상 입력해주세요.";

  const canContinue =
    step === 1
      ? userId.trim().length >= 2 && (idStatus === "available" || idStatus === "error")
      : step === 2
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        : step === 3
          ? password.length >= 4 && password === passwordConfirm
          : step === 4
            ? Boolean(neighborhood)
            : step === 5
              ? nickname.trim().length >= 2
              : true;

  const saveSession = (tokens: TokenResponse) => {
    window.localStorage.setItem("masil.accessToken", tokens.access_token);
    window.localStorage.setItem("masil.refreshToken", tokens.refresh_token);
    window.localStorage.setItem(
      "masil.user",
      JSON.stringify({
        id: userId.trim(),
        email: email.trim(),
        nickname: nickname.trim(),
        neighborhood,
        avatarUrl,
        loggedInAt: new Date().toISOString(),
      }),
    );
  };

  const loginAfterSignup = async () => {
    const response = await fetch("/api/masil/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: userId.trim(), password }),
    });
    const data = (await response.json()) as TokenResponse & ErrorResponse;
    if (!response.ok) throw new Error(normalizeError(data.detail));
    saveSession(data);
  };

  const completeSignup = async () => {
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/masil/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: userId.trim(),
          neighborhood,
          password,
          is_terms_agreed: true,
        }),
      });
      const data = (await response.json()) as ErrorResponse;
      if (!response.ok) throw new Error(normalizeError(data.detail));

      await loginAfterSignup();
      setStep(6);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "가입에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canContinue || pending) return;
    if (step < 5) {
      setStep((current) => current + 1);
      setError("");
      return;
    }
    void completeSignup();
  };

  const goBack = () => {
    setError("");
    if (step > 1 && step < 6) {
      setStep((current) => current - 1);
      return;
    }
    router.back();
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Page>
      <TopBar>
        <IconButton type="button" aria-label="뒤로가기" onClick={goBack}>
          <ArrowBackIosNewRoundedIcon aria-hidden />
        </IconButton>
        <StepText>{step < 6 ? `${step}/5` : "완료"}</StepText>
        <IconButton type="button" aria-label="닫기" onClick={() => router.push("/login")}>
          <CloseRoundedIcon aria-hidden />
        </IconButton>
      </TopBar>

      <Content>
        <BrandLine>
          <LogoBox>
            <Image src="/images/logo.png" alt="마실" fill sizes="34px" priority />
          </LogoBox>
          <BrandName>마실 회원가입</BrandName>
        </BrandLine>

        <Title>{title}</Title>
        <Description>{description}</Description>

        {step === 6 ? (
          <CompleteBox>
            <CompleteIcon>
              <CheckRoundedIcon aria-hidden />
            </CompleteIcon>
            <Summary>
              <SummaryLine>
                아이디
                <strong>{userId}</strong>
              </SummaryLine>
              <SummaryLine>
                닉네임
                <strong>{nickname}</strong>
              </SummaryLine>
              <SummaryLine>
                동네
                <strong>{neighborhood}</strong>
              </SummaryLine>
            </Summary>
            <Actions>
              <PrimaryButton type="button" onClick={() => router.replace("/profile")}>
                마이페이지로 가기
              </PrimaryButton>
            </Actions>
          </CompleteBox>
        ) : (
          <Form onSubmit={submit}>
            {step === 1 && (
              <Field>
                <FieldLabel>아이디</FieldLabel>
                <FieldRow $active={focused === "id"}>
                  <PersonOutlineRoundedIcon aria-hidden />
                  <Input
                    value={userId}
                    placeholder="아이디"
                    autoComplete="username"
                    onFocus={() => setFocused("id")}
                    onBlur={() => setFocused(null)}
                    onChange={(event) => changeUserId(event.target.value)}
                  />
                </FieldRow>
                <Helper $tone={idStatus === "available" ? "ok" : idStatus === "taken" || idStatus === "error" ? "bad" : undefined}>
                  {idHelper}
                </Helper>
              </Field>
            )}

            {step === 2 && (
              <Field>
                <FieldLabel>이메일</FieldLabel>
                <FieldRow $active={focused === "email"}>
                  <MailOutlineRoundedIcon aria-hidden />
                  <Input
                    type="email"
                    value={email}
                    placeholder="email@masil.kr"
                    autoComplete="email"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </FieldRow>
              </Field>
            )}

            {step === 3 && (
              <>
                <Field>
                  <FieldLabel>비밀번호</FieldLabel>
                  <FieldRow $active={focused === "password"}>
                    <LockOutlinedIcon aria-hidden />
                    <Input
                      type="password"
                      value={password}
                      placeholder="영문, 숫자 포함 4자 이상"
                      autoComplete="new-password"
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </FieldRow>
                </Field>
                <Field>
                  <FieldLabel>비밀번호 확인</FieldLabel>
                  <FieldRow $active={focused === "passwordConfirm"}>
                    <LockOutlinedIcon aria-hidden />
                    <Input
                      type="password"
                      value={passwordConfirm}
                      placeholder="한 번 더 입력"
                      autoComplete="new-password"
                      onFocus={() => setFocused("passwordConfirm")}
                      onBlur={() => setFocused(null)}
                      onChange={(event) => setPasswordConfirm(event.target.value)}
                    />
                  </FieldRow>
                  <Helper $tone={passwordConfirm && password !== passwordConfirm ? "bad" : undefined}>
                    {passwordConfirm && password !== passwordConfirm ? "비밀번호가 서로 다릅니다." : " "}
                  </Helper>
                </Field>
              </>
            )}

            {step === 4 && (
              <SearchPanel>
                <SearchBox>
                  <SearchRoundedIcon aria-hidden />
                  <Input
                    value={neighborhoodQuery}
                    placeholder="내 동네 이름으로 검색"
                    onChange={(event) => setNeighborhoodQuery(event.target.value)}
                  />
                </SearchBox>
                <OrangeButton type="button" onClick={() => setNeighborhoodQuery("")}>
                  전체 동네 목록 조회
                </OrangeButton>
                <ResultTitle>
                  {neighborhoodQuery ? `'${neighborhoodQuery}' 검색결과` : "전체 동네"}
                </ResultTitle>
                {filteredNeighborhoods.length > 0 ? (
                  <NeighborhoodList>
                    {filteredNeighborhoods.map((item) => (
                      <NeighborhoodItem
                        key={item}
                        type="button"
                        $selected={item === neighborhood}
                        onClick={() => setNeighborhood(item)}
                      >
                        {item}
                        {item === neighborhood && <CheckRoundedIcon aria-hidden />}
                      </NeighborhoodItem>
                    ))}
                  </NeighborhoodList>
                ) : (
                  <EmptyState>
                    <StorefrontRoundedIcon aria-hidden />
                    <div>
                      검색 결과가 없습니다
                      <br />
                      <span>동네 이름 다시 검색하기</span>
                    </div>
                  </EmptyState>
                )}
              </SearchPanel>
            )}

            {step === 5 && (
              <>
                <Field>
                  <FieldLabel>닉네임</FieldLabel>
                  <FieldRow $active={focused === "nickname"}>
                    <PersonOutlineRoundedIcon aria-hidden />
                    <Input
                      value={nickname}
                      placeholder="커뮤니티에서 보일 이름"
                      onFocus={() => setFocused("nickname")}
                      onBlur={() => setFocused(null)}
                      onChange={(event) => setNickname(event.target.value)}
                    />
                  </FieldRow>
                </Field>
                <Field>
                  <FieldLabel>프로필 사진</FieldLabel>
                  <AvatarGrid>
                    {AVATAR_OPTIONS.map((item) => (
                      <AvatarButton
                        key={item}
                        type="button"
                        $active={item === avatarUrl}
                        onClick={() => setAvatarUrl(item)}
                      >
                        <AvatarPhoto src={item} alt="" loading="lazy" />
                      </AvatarButton>
                    ))}
                    <UploadButton>
                      <PhotoCameraRoundedIcon aria-hidden />
                      <HiddenFile type="file" accept="image/*" onChange={selectFile} />
                    </UploadButton>
                  </AvatarGrid>
                </Field>
              </>
            )}

            <Helper $tone={error ? "bad" : undefined}>{error}</Helper>
            <Actions>
              <PrimaryButton type="submit" disabled={!canContinue || pending}>
                {pending ? "가입 중" : step === 5 ? "가입 완료" : "다음"}
              </PrimaryButton>
              <GhostButton type="button" onClick={() => router.push("/login")}>
                이미 계정이 있어요
              </GhostButton>
            </Actions>
          </Form>
        )}
      </Content>
    </Page>
  );
}
