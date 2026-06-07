"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { theme } from "@/styles/theme";

const ACCESS_TOKEN_STORAGE_KEY = "masil.accessToken";
const USER_STORAGE_KEY = "masil.user";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=180&q=80",
];

const NEIGHBORHOODS = [
  "대전 유성구 덕명동",
  "대전 유성구 궁동",
  "대전 유성구 봉명동",
  "대전 유성구 어은동",
  "대전 서구 둔산동",
  "대전 서구 갈마동",
  "대전 중구 은행동",
  "대전 동구 가양동",
  "서랑동",
  "서천동",
  "화서동",
];

type StoredUser = {
  id?: string | number;
  email?: string;
  nickname?: string;
  neighborhood?: string;
  avatarUrl?: string;
  role?: string;
  [key: string]: unknown;
};

type ApiUser = {
  id?: number;
  username?: string;
  nickname?: string;
  display_name?: string;
  neighborhood?: string;
  avatar_url?: string | null;
  role?: string;
};

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
  grid-template-columns: 40px 1fr 56px;
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
  color: #222;
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

const HeaderTitle = styled.h1`
  justify-self: center;
  margin: 0;
  color: #1f1f1f;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0;
`;

const SaveButton = styled.button<{ $active?: boolean }>`
  justify-self: end;
  border: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? "#37c9a2" : "#cfcfcf")};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
`;

const Content = styled.form`
  padding: 28px 24px 36px;
`;

const AvatarSection = styled.section`
  display: grid;
  justify-items: center;
  gap: 14px;
  margin-bottom: 32px;
`;

const MainAvatar = styled.div`
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #f1f1f1;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const AvatarPhoto = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
`;

const UploadLabel = styled.label`
  position: absolute;
  right: -1px;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #37c9a2;
  color: #fff;
  cursor: pointer;

  svg {
    font-size: 17px;
  }
`;

const HiddenFile = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const AvatarStrip = styled.div`
  display: flex;
  gap: 10px;
`;

const AvatarOption = styled.button<{ $active?: boolean }>`
  width: 42px;
  height: 42px;
  padding: 0;
  border: ${({ $active }) => ($active ? "2px solid #37c9a2" : "1px solid #ededed")};
  border-radius: 50%;
  background: #f6f6f6;
  overflow: hidden;
  cursor: pointer;
`;

const Section = styled.section`
  display: grid;
  gap: 18px;
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
  grid-template-columns: 1fr;
  align-items: center;
  min-height: 48px;
  border-bottom: 1px solid ${({ $active }) => ($active ? "#37c9a2" : "#e9e9e9")};
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #222;
  font-size: 16px;
  font-weight: 600;

  &::placeholder {
    color: #cfcfcf;
    font-weight: 500;
  }
`;

const Helper = styled.p<{ $tone?: "ok" | "bad" }>`
  min-height: 18px;
  margin: -3px 0 0;
  color: ${({ $tone }) => ($tone === "ok" ? "#20a983" : $tone === "bad" ? "#ef5a5a" : "#aaa")};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
`;

const SearchBox = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  border-bottom: 1px solid #e9e9e9;
  color: #777;

  svg {
    font-size: 20px;
  }
`;

const NeighborhoodList = styled.div`
  display: grid;
  max-height: 232px;
  margin-top: -2px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NeighborhoodItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #f3f3f3;
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

const EmptyResult = styled.div`
  padding: 36px 0;
  color: #aaa;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

function normalizeError(detail: string | undefined) {
  if (!detail) return "프로필 저장 중 문제가 생겼습니다.";
  if (detail === "Nickname already exists") return "이미 사용 중인 이름입니다.";
  return detail;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [baseUser, setBaseUser] = useState<StoredUser>({});
  const [nickname, setNickname] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (!token) {
        router.replace("/login");
        return;
      }

      const storedUser = readStoredUser() ?? {};
      setBaseUser(storedUser);
      setNickname(storedUser.nickname || String(storedUser.id ?? "") || "마실유저");
      setNeighborhood(storedUser.neighborhood || "");
      setAvatarUrl(storedUser.avatarUrl || AVATAR_OPTIONS[0]);
      setLoaded(true);

      void fetch("/api/masil/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then((response) => {
          if (!response.ok) throw new Error("profile api unavailable");
          return response.json() as Promise<ApiUser>;
        })
        .then((user) => {
          const nextUser = {
            ...storedUser,
            id: user.id ?? storedUser.id,
            loginId: user.username ?? user.nickname ?? storedUser.loginId,
            nickname: user.display_name ?? user.nickname ?? storedUser.nickname,
            neighborhood: user.neighborhood ?? storedUser.neighborhood,
            avatarUrl: user.avatar_url || storedUser.avatarUrl || AVATAR_OPTIONS[0],
            role: user.role ?? storedUser.role,
          };
          setBaseUser(nextUser);
          setNickname(nextUser.nickname || "마실유저");
          setNeighborhood(nextUser.neighborhood || "");
          setAvatarUrl(nextUser.avatarUrl || AVATAR_OPTIONS[0]);
          window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        })
        .catch(() => undefined);
    });
  }, [router]);

  const filteredNeighborhoods = useMemo(() => {
    const query = neighborhoodQuery.trim();
    if (!query) return NEIGHBORHOODS;
    return NEIGHBORHOODS.filter((item) => item.includes(query));
  }, [neighborhoodQuery]);

  const changed =
    nickname.trim() !== (baseUser.nickname || String(baseUser.id ?? "") || "마실유저") ||
    neighborhood !== (baseUser.neighborhood || "") ||
    avatarUrl !== (baseUser.avatarUrl || AVATAR_OPTIONS[0]);
  const canSave = loaded && changed && nickname.trim().length >= 2 && Boolean(neighborhood) && !pending;

  const changeAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!token) {
      router.replace("/login");
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/masil/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
          neighborhood,
          avatarUrl,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as ApiUser & { detail?: string };

      if (!response.ok) {
        setError(normalizeError(data.detail));
        return;
      }

      const nextUser = {
        ...baseUser,
        id: data.id ?? baseUser.id,
        loginId: data.username ?? data.nickname ?? baseUser.loginId,
        nickname: data.display_name ?? nickname.trim(),
        neighborhood: data.neighborhood ?? neighborhood,
        avatarUrl: data.avatar_url || avatarUrl,
        role: data.role ?? baseUser.role,
      };
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      window.dispatchEvent(new Event("masil-profile-updated"));
      router.replace("/profile");
    } catch {
      setError("프로필 저장 중 문제가 생겼습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <IconButton type="button" aria-label="뒤로" onClick={() => router.back()}>
          <ArrowBackIosNewRoundedIcon aria-hidden />
        </IconButton>
        <HeaderTitle>프로필 편집</HeaderTitle>
        <SaveButton type="submit" form="profile-edit-form" $active={canSave} disabled={!canSave}>
          {pending ? "저장중" : "완료"}
        </SaveButton>
      </TopBar>
      <Content id="profile-edit-form" onSubmit={saveProfile}>
        <AvatarSection>
          <MainAvatar>
            <AvatarPhoto src={avatarUrl} alt="" />
            <UploadLabel aria-label="프로필 사진 올리기">
              <PhotoCameraRoundedIcon aria-hidden />
              <HiddenFile type="file" accept="image/*" onChange={changeAvatarFile} />
            </UploadLabel>
          </MainAvatar>
          <AvatarStrip>
            {AVATAR_OPTIONS.map((item) => (
              <AvatarOption
                key={item}
                type="button"
                $active={item === avatarUrl}
                aria-label="기본 프로필 사진 선택"
                onClick={() => setAvatarUrl(item)}
              >
                <AvatarPhoto src={item} alt="" />
              </AvatarOption>
            ))}
          </AvatarStrip>
        </AvatarSection>
        <Section>
          <Field>
            <FieldLabel>이름</FieldLabel>
            <FieldRow $active={focused === "nickname"}>
              <Input
                value={nickname}
                maxLength={20}
                placeholder="마실에서 사용할 이름"
                onChange={(event) => setNickname(event.target.value)}
                onFocus={() => setFocused("nickname")}
                onBlur={() => setFocused(null)}
              />
            </FieldRow>
            <Helper $tone={nickname.trim().length >= 2 ? "ok" : undefined}>
              2자 이상 입력해주세요.
            </Helper>
          </Field>
          <Field>
            <FieldLabel>동네</FieldLabel>
            <SearchBox>
              <SearchRoundedIcon aria-hidden />
              <Input
                value={neighborhoodQuery}
                placeholder={neighborhood || "내 동네 이름으로 검색"}
                onChange={(event) => setNeighborhoodQuery(event.target.value)}
              />
            </SearchBox>
            <NeighborhoodList>
              {filteredNeighborhoods.length > 0 ? (
                filteredNeighborhoods.map((item) => (
                  <NeighborhoodItem
                    key={item}
                    type="button"
                    $selected={item === neighborhood}
                    onClick={() => {
                      setNeighborhood(item);
                      setNeighborhoodQuery("");
                    }}
                  >
                    {item}
                    {item === neighborhood && <CheckRoundedIcon aria-hidden />}
                  </NeighborhoodItem>
                ))
              ) : (
                <EmptyResult>검색 결과가 없습니다.</EmptyResult>
              )}
            </NeighborhoodList>
          </Field>
          <Helper $tone={error ? "bad" : undefined}>{error}</Helper>
        </Section>
      </Content>
    </Page>
  );
}
