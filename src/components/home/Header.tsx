"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from "@/styles/theme";

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  height: ${theme.layout.headerHeight}px;
  padding: 10px 15px 12px;
  background: ${theme.colors.white};
  box-shadow: ${theme.shadows.header};
`;

const LogoLink = styled.a`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 44px;
  height: 36px;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const SearchForm = styled.form`
  flex: 1;
  min-width: 0;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 38px;
  padding: 0 13px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.white};

  svg {
    flex-shrink: 0;
    font-size: 19px;
    color: ${theme.colors.textSoft};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};

  &::placeholder {
    color: ${theme.colors.textSoft};
  }
`;

const LoginButton = styled.button`
  flex-shrink: 0;
  width: 63px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: #37c9a2;
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2fb991;
  }
`;

const ProfileButton = styled.button`
  position: relative;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 50%;
  background: #f2f3f3;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0 0 2px ${theme.colors.white};
`;

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const ProfileInitial = styled.span`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: #173f49;
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 800;
`;

type StoredUser = {
  id?: string;
  nickname?: string;
  avatarUrl?: string;
};

const ACCESS_TOKEN_STORAGE_KEY = "masil.accessToken";
const USER_STORAGE_KEY = "masil.user";
const FALLBACK_AVATAR_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=180&q=80";

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredUser) : null;
  } catch {
    return null;
  }
}

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncProfile = () => {
      const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      setProfile(token ? readStoredUser() ?? {} : null);
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("focus", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("focus", syncProfile);
    };
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const keyword = query.trim();

    if (!keyword) return;

    window.localStorage.setItem("masil.lastSearch", keyword);
    document.getElementById("stores")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <HeaderRoot>
      <LogoLink href="/" aria-label="마실 홈">
        <Image
          src="/images/logo.png"
          alt="마실"
          width={40}
          height={40}
          priority
        />
      </LogoLink>
      <SearchForm onSubmit={submitSearch}>
        <SearchWrap>
          <SearchIcon aria-hidden />
          <SearchInput
            type="search"
            placeholder="오늘은 무엇을 검색해볼까요?"
            aria-label="검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SearchWrap>
      </SearchForm>
      {profile ? (
        <ProfileButton
          type="button"
          aria-label="프로필"
          onClick={() => router.push("/profile")}
        >
          {profile.avatarUrl ? (
            <ProfilePhoto src={profile.avatarUrl} alt="" loading="lazy" />
          ) : profile.nickname || profile.id ? (
            <ProfileInitial aria-hidden>
              {(profile.nickname || profile.id || "M").slice(0, 1).toUpperCase()}
            </ProfileInitial>
          ) : (
            <ProfilePhoto src={FALLBACK_AVATAR_URL} alt="" loading="lazy" />
          )}
        </ProfileButton>
      ) : (
        <LoginButton type="button" onClick={() => router.push("/login")}>
          로그인
        </LoginButton>
      )}
    </HeaderRoot>
  );
}
