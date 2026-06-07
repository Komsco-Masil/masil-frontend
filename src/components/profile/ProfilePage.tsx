"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { theme } from "@/styles/theme";
import {
  COMMUNITY_LIKED_POSTS_STORAGE_KEY,
  USER_ROLE_STORAGE_KEY,
  type ApiCommunityPost,
  type UserRole,
  getBoardLabel,
  mapApiPost,
  readUserRole,
} from "@/components/community/communityData";

const CAT_AVATAR_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=180&q=80";
const ACCESS_TOKEN_STORAGE_KEY = "masil.accessToken";
const USER_STORAGE_KEY = "masil.user";
const VERIFIED_STORE_STORAGE_KEY = "masil.verifiedStore";

const MENUS = [
  { label: "내가 쓴 글", caption: "커뮤니티 활동 모아보기", icon: EditNoteRoundedIcon },
  { label: "내 댓글", caption: "내가 남긴 답글과 댓글", icon: FavoriteRoundedIcon },
  { label: "관심 가게", caption: "저장한 동네 가게", icon: BookmarkRoundedIcon },
  { label: "좋아요한 글", caption: "다시 보고 싶은 글", icon: FavoriteRoundedIcon },
  { label: "알림 설정", caption: "댓글, 쪽지, 홍보 알림", icon: NotificationsRoundedIcon },
  { label: "고객센터", caption: "문의와 앱 이용 안내", icon: HelpRoundedIcon },
] as const;

type SheetKind =
  | (typeof MENUS)[number]["label"]
  | "차단 관리"
  | "신고 내역"
  | "약관 및 개인정보";

type SheetEntry = {
  title: string;
  body: string;
  href?: string;
};

type SheetContent = {
  title: string;
  items: Array<SheetEntry>;
};

const STATIC_SHEET_CONTENT: Record<
  Exclude<SheetKind, "내가 쓴 글" | "내 댓글" | "좋아요한 글">,
  SheetContent
> = {
  "관심 가게": {
    title: "관심 가게",
    items: [
      { title: "아빠손칼국수", body: "대전 유성구 덕명동 · 평점 4.5" },
      { title: "고양이카페 DAZE", body: "쿠폰 문의가 많은 가게" },
    ],
  },
  "알림 설정": {
    title: "알림 설정",
    items: [
      { title: "댓글/쪽지/모임 알림", body: "설정 모달에서 세부 알림을 켜고 끌 수 있어요." },
      { title: "야간 방해금지", body: "밤 11시부터 오전 8시까지 푸시를 묶어둡니다." },
    ],
  },
  고객센터: {
    title: "고객센터",
    items: [
      { title: "운영 문의", body: "평일 10:00-18:00 순차 답변" },
      { title: "가맹점 인증 도움말", body: "사업자번호 또는 가게명+주소로 인증할 수 있어요." },
    ],
  },
  "차단 관리": {
    title: "차단 관리",
    items: [
      { title: "차단한 유저 없음", body: "불편한 쪽지를 받은 경우 쪽지 상세에서 차단할 수 있어요." },
    ],
  },
  "신고 내역": {
    title: "신고 내역",
    items: [
      { title: "처리 중인 신고 없음", body: "신고한 글과 쪽지는 운영자 검토 후 이곳에 상태가 표시됩니다." },
    ],
  },
  "약관 및 개인정보": {
    title: "약관 및 개인정보",
    items: [
      { title: "서비스 이용약관", body: "동네 커뮤니티 운영 정책과 게시글 관리 기준을 확인합니다." },
      { title: "개인정보 처리방침", body: "로그인, 동네, 프로필 정보의 이용 범위를 관리합니다." },
      { title: "위치기반서비스 약관", body: "동네 기반 추천과 가게 검색에 필요한 정책입니다." },
    ],
  },
};

type ProfileStats = {
  posts: number;
  comments: number;
  receivedLikes: number;
};

type ActivityResponse = {
  stats: {
    posts: number;
    comments: number;
    received_likes: number;
  };
  posts: Array<{ id: number; title: string; body: string; meta: string; post_id?: number }>;
  comments: Array<{ id: number; title: string; body: string; meta: string; post_id?: number }>;
};

const Page = styled.main`
  min-height: 100dvh;
  padding-bottom: ${theme.layout.bottomNavHeight}px;
  background: #f7f8fa;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 56px 22px 16px;
  background: ${theme.colors.white};
`;

const Title = styled.h1`
  margin: 0;
  color: #17313a;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f5f5f5;
  color: ${theme.colors.textPrimary};

  svg {
    font-size: 20px;
  }
`;

const ProfileCard = styled.section`
  margin: 0 15px;
  padding: 17px 16px 15px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.035);
`;

const UserRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
`;

const Avatar = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eeeeee;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const UserInfo = styled.div`
  min-width: 0;
`;

const Nickname = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

const UserMeta = styled.p`
  margin: 4px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.4;
`;

const EditButton = styled.button`
  height: 30px;
  padding: 0 11px;
  border: 1px solid #eeeeee;
  border-radius: 7px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 18px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const StatItem = styled.div`
  text-align: center;

  & + & {
    border-left: 1px solid #f1f1f1;
  }
`;

const StatValue = styled.strong`
  display: block;
  color: ${theme.colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
`;

const StatLabel = styled.span`
  display: block;
  margin-top: 2px;
  color: ${theme.colors.textMuted};
  font-size: 10px;
`;

const StoreCard = styled.section`
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 11px;
  align-items: center;
  margin: 12px 15px 0;
  padding: 14px;
  border-radius: 8px;
  background: #173f49;
  color: ${theme.colors.white};
`;

const StoreIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);

  svg {
    font-size: 23px;
  }
`;

const StoreTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;

const StoreMeta = styled.p`
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 10px;
`;

const StoreStatus = styled.span`
  align-self: start;
  padding: 5px 8px;
  border-radius: 6px;
  background: ${theme.colors.white};
  color: #173f49;
  font-size: 10px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-top: 18px;
`;

const SectionTitle = styled.h2`
  margin: 0 22px 10px;
  color: ${theme.colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;

const MenuList = styled.div`
  margin: 0 15px;
  border-radius: 8px;
  overflow: hidden;
  background: ${theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.035);
`;

const MenuItem = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 36px 1fr 18px;
  gap: 10px;
  align-items: center;
  min-height: 62px;
  padding: 0 14px;
  border: 0;
  background: ${theme.colors.white};
  text-align: left;

  & + & {
    border-top: 1px solid #f3f3f3;
  }
`;

const MenuIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f7f8fa;
  color: ${theme.colors.textSecondary};

  svg {
    font-size: 20px;
  }
`;

const MenuText = styled.div`
  min-width: 0;
`;

const MenuLabel = styled.strong`
  display: block;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
`;

const MenuCaption = styled.span`
  display: block;
  margin-top: 3px;
  color: ${theme.colors.textMuted};
  font-size: 10px;
`;

const Chevron = styled(ChevronRightRoundedIcon)`
  color: #c9c9c9;
  font-size: 18px;
`;

const Notice = styled.div`
  margin: 12px 15px 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 12px;
  line-height: 1.45;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.28);
`;

const SettingsPanel = styled.section`
  width: 100%;
  max-height: min(82dvh, 680px);
  padding: 9px 14px calc(18px + env(safe-area-inset-bottom, 0px));
  border-radius: 10px 10px 0 0;
  background: #f6f7f8;
  overflow-y: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHandle = styled.span`
  display: block;
  width: 38px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 4px;
  background: #dddddd;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const SettingsTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
`;

const ModalCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: #f6f6f6;
  color: ${theme.colors.textPrimary};

  svg {
    font-size: 20px;
  }
`;

const SettingSection = styled.div`
  display: grid;
  gap: 2px;
  margin-top: 10px;
  padding: 13px 14px;
  border: 1px solid #ececec;
  border-radius: 10px;
  background: ${theme.colors.white};
`;

const SettingSectionTitle = styled.h3`
  margin: 0 0 7px;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;

const SettingRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 7px 0;

  & + & {
    border-top: 1px solid #f3f3f3;
  }
`;

const SettingActionRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  min-height: 52px;
  padding: 7px 0;

  & + & {
    border-top: 1px solid #f3f3f3;
  }
`;

const SettingText = styled.span`
  display: grid;
  gap: 3px;
`;

const SettingLabel = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
`;

const SettingCaption = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.35;
`;

const Toggle = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

const SwitchTrack = styled.span<{ $checked?: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 28px;
  border: 1px solid ${({ $checked }) => ($checked ? "#173f49" : "#d5d5d5")};
  border-radius: 14px;
  background: ${({ $checked }) => ($checked ? "#173f49" : "#eeeeee")};
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => ($checked ? "22px" : "2px")};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${theme.colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.18s ease;
  }
`;

const RowChevron = styled(ChevronRightRoundedIcon)`
  flex-shrink: 0;
  color: #c9c9c9;
  font-size: 20px;
`;

const SheetList = styled.div`
  display: grid;
  gap: 8px;
`;

const SheetItem = styled.button<{ $clickable?: boolean }>`
  width: 100%;
  padding: 13px 14px;
  text-align: left;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.045);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const SheetItemTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;

const SheetItemBody = styled.p`
  margin: 5px 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  line-height: 1.45;
`;

const VerifyCard = styled.section`
  display: grid;
  gap: 12px;
`;

const VerifyTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 700;
`;

const VerifyDesc = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
  line-height: 1.5;
`;

const PublicDataChecks = styled.div`
  display: grid;
  gap: 6px;
  padding: 10px 11px;
  border-radius: 8px;
  border: 1px solid #e4f2ed;
  background: #f8fcfb;
`;

const PublicDataCheck = styled.div<{ $done?: boolean; $pending?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: ${({ $done, $pending }) => ($done ? "#267761" : $pending ? "#9a7b35" : theme.colors.textSecondary)};
  font-size: 11px;
  font-weight: 600;

  span {
    flex-shrink: 0;
    color: ${({ $done, $pending }) => ($done ? "#37c9a2" : $pending ? "#d29a24" : "#aaa")};
    font-size: 10px;
    font-weight: 800;
  }
`;

const VerifyGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const VerifyInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  outline: none;
  color: ${theme.colors.textPrimary};
  font-size: 13px;

  &::placeholder {
    color: #c8c8c8;
  }
`;

const PrimaryButton = styled.button`
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: ${theme.colors.coral};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 700;
`;

const SecondaryButton = styled.button`
  height: 36px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;

const DangerButton = styled.button`
  height: 42px;
  border: 0;
  border-radius: 8px;
  background: #fff4f4;
  color: ${theme.colors.coralDark};
  font-size: 13px;
  font-weight: 700;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 22px;
  padding: 0 9px;
  border-radius: 6px;
  background: #f6f6f6;
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e8e8e8;
`;

const LoadingPage = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding-bottom: ${theme.layout.bottomNavHeight}px;
  background: #f7f8fa;
  color: ${theme.colors.textMuted};
  font-size: 13px;
  font-weight: 700;
`;

type StoredUser = {
  id?: string;
  email?: string;
  nickname?: string;
  neighborhood?: string;
  avatarUrl?: string;
};

type VerifiedStore = {
  id?: number;
  business_number?: string;
  name?: string;
  address?: string;
  is_manual_review?: boolean;
  nts_verified?: boolean;
  gift_card_verified?: boolean;
  public_data_source?: string | null;
  verified_at?: string | null;
  message?: string | null;
};

function readStoredUser() {
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function readVerifiedStore() {
  const raw = window.localStorage.getItem(VERIFIED_STORE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as VerifiedStore;
  } catch {
    return null;
  }
}

function readLikedPostIds() {
  try {
    const stored = window.localStorage.getItem(COMMUNITY_LIKED_POSTS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Array<number>) : [];
  } catch {
    return [];
  }
}

function emptyEntry(body: string): SheetEntry {
  return {
    title: "아직 기록이 없어요",
    body,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [nickname, setNickname] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(CAT_AVATAR_URL);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheet, setSheet] = useState<SheetKind | null>(null);
  const [notice, setNotice] = useState("프로필에서 자주 쓰는 기능을 바로 관리할 수 있어요.");
  const [commentAlert, setCommentAlert] = useState(true);
  const [messageAlert, setMessageAlert] = useState(true);
  const [promoAlert, setPromoAlert] = useState(false);
  const [meetingAlert, setMeetingAlert] = useState(true);
  const [quietMode, setQuietMode] = useState(false);
  const [dmAllowed, setDmAllowed] = useState(true);
  const [profilePublic, setProfilePublic] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const [businessNumber, setBusinessNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [verifiedStore, setVerifiedStore] = useState<VerifiedStore | null>(null);
  const [verifyingStore, setVerifyingStore] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [staffInviteCode, setStaffInviteCode] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [stats, setStats] = useState<ProfileStats>({ posts: 0, comments: 0, receivedLikes: 0 });
  const [myPosts, setMyPosts] = useState<Array<SheetEntry>>([]);
  const [myComments, setMyComments] = useState<Array<SheetEntry>>([]);
  const [likedPosts, setLikedPosts] = useState<Array<SheetEntry>>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (!token) {
        router.replace("/login");
        return;
      }

      const storedUser = readStoredUser();
      const nextNickname = storedUser?.nickname || storedUser?.id || "마실유저";

      setNickname(nextNickname);
      setNeighborhood(storedUser?.neighborhood ?? "");
      setAvatarUrl(storedUser?.avatarUrl ?? CAT_AVATAR_URL);
      setRole(readUserRole());
      setVerifiedStore(readVerifiedStore());
      setAuthChecked(true);

      void fetch("/api/masil/community/me/activity", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then((response) => {
          if (!response.ok) throw new Error("activity api unavailable");
          return response.json() as Promise<ActivityResponse>;
        })
        .then((activity) => {
          setStats({
            posts: activity.stats.posts,
            comments: activity.stats.comments,
            receivedLikes: activity.stats.received_likes,
          });
          setMyPosts(
            activity.posts.map((post) => ({
              title: post.title,
              body: post.meta,
              href: `/community/posts/${post.post_id ?? post.id}`,
            })),
          );
          setMyComments(
            activity.comments.map((comment) => ({
              title: comment.title,
              body: `${comment.body} · ${comment.meta}`,
              href: `/community/posts/${comment.post_id}`,
            })),
          );
        })
        .catch(() => undefined);

      void fetch("/api/masil/community/posts", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("community api unavailable");
          return response.json() as Promise<Array<ApiCommunityPost>>;
        })
        .then((posts) => {
          const likedIds = new Set(readLikedPostIds());
          const nextLikedPosts = posts
            .map(mapApiPost)
            .filter((post) => likedIds.has(post.id))
            .map((post) => ({
              title: post.title,
              body: `${getBoardLabel(post.board)} · 좋아요 ${post.likes}`,
              href: `/community/posts/${post.id}`,
            }));
          setLikedPosts(nextLikedPosts);
        })
        .catch(() => undefined);
    });
  }, [router]);

  const statItems = [
    { label: "작성글", value: String(stats.posts) },
    { label: "댓글", value: String(stats.comments) },
    { label: "받은 좋아요", value: String(stats.receivedLikes) },
  ];

  const getSheetContent = (kind: SheetKind): SheetContent => {
    if (kind === "내가 쓴 글") {
      return {
        title: "내가 쓴 글",
        items: myPosts.length > 0 ? myPosts : [emptyEntry("작성한 커뮤니티 글이 여기에 표시돼요.")],
      };
    }
    if (kind === "내 댓글") {
      return {
        title: "내 댓글",
        items:
          myComments.length > 0
            ? myComments
            : [emptyEntry("댓글이나 대댓글을 남기면 이곳에서 다시 볼 수 있어요.")],
      };
    }
    if (kind === "좋아요한 글") {
      return {
        title: "좋아요한 글",
        items:
          likedPosts.length > 0
            ? likedPosts
            : [emptyEntry("글 상세에서 좋아요를 누른 글이 이곳에 모여요.")],
      };
    }

    return STATIC_SHEET_CONTENT[kind];
  };

  const openActivity = (label: (typeof MENUS)[number]["label"]) => {
    if (label === "알림 설정") {
      setSettingsOpen(true);
      setNotice("설정에서 알림과 가맹점 인증을 관리할 수 있어요.");
      return;
    }

    setSheet(label);
  };

  const openSheet = (kind: SheetKind) => {
    setSheet(kind);
  };

  const logout = async () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) {
      await fetch("/api/masil/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }

    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem("masil.refreshToken");
    window.localStorage.removeItem(USER_STORAGE_KEY);
    window.localStorage.setItem(USER_ROLE_STORAGE_KEY, "guest");
    router.replace("/login");
  };

  const verifyStore = async () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const payload = {
      business_number: businessNumber.replaceAll("-", "").trim(),
      name: storeName.trim(),
      address: storeAddress.trim(),
      start_date: businessStartDate.replaceAll(".", "").replaceAll("-", "").trim(),
      representative_name: representativeName.trim(),
    };

    if (!token) {
      router.replace("/login");
      return;
    }
    if (!payload.business_number || !payload.name || !payload.address) {
      setNotice("사업자번호, 가게명, 주소는 꼭 입력해주세요.");
      return;
    }

    setVerifyingStore(true);

    try {
      const response = await fetch("/api/masil/stores/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as VerifiedStore & { detail?: string };

      if (!response.ok) {
        setNotice(data.detail ?? "가맹점 인증에 실패했어요. 입력값을 다시 확인해주세요.");
        return;
      }

      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, "owner");
      window.localStorage.setItem(VERIFIED_STORE_STORAGE_KEY, JSON.stringify(data));
      const storedUser = readStoredUser() ?? {};
      window.localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          ...storedUser,
          role: "OWNER",
          storeId: data.id,
          storeName: data.name,
          storeAddress: data.address,
        }),
      );

      setRole("owner");
      setVerifiedStore(data);
      setNotice(
        data.message ??
          (data.is_manual_review
            ? "인증 서버 지연으로 수동 검토 접수됐어요. 검토 중에도 사장 권한을 사용할 수 있어요."
            : "가맹점 인증이 완료됐어요. 소상공인 익명 게시판 권한이 열렸습니다."),
      );
      setSettingsOpen(false);
    } finally {
      setVerifyingStore(false);
    }
  };

  const becomeGuest = () => {
    window.localStorage.setItem(USER_ROLE_STORAGE_KEY, "guest");
    window.localStorage.removeItem(VERIFIED_STORE_STORAGE_KEY);
    setRole("guest");
    setVerifiedStore(null);
    setInviteCode("");
    setNotice("일반 손님 권한으로 전환됐어요.");
  };

  const issueInviteCode = async () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const storeId = verifiedStore?.id;

    if (!token || !storeId) {
      setNotice("가맹점 인증 후 직원 초대 코드를 발급할 수 있어요.");
      return;
    }

    setInviteBusy(true);

    try {
      const response = await fetch("/api/masil/stores/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ store_id: storeId }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        invite_code?: string;
        detail?: string;
      };

      if (!response.ok || !data.invite_code) {
        setNotice(data.detail ?? "직원 초대 코드 발급에 실패했어요.");
        return;
      }

      setInviteCode(data.invite_code);
      setNotice("직원 초대 코드가 발급됐어요. 24시간 동안 사용할 수 있어요.");
    } finally {
      setInviteBusy(false);
    }
  };

  const useStaffInviteCode = async () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const invite = staffInviteCode.trim();

    if (!token) {
      router.replace("/login");
      return;
    }
    if (!invite) {
      setNotice("사장님에게 받은 초대 코드를 입력해주세요.");
      return;
    }

    setInviteBusy(true);

    try {
      const response = await fetch("/api/masil/stores/invites/use", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invite_code: invite }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        role?: string;
        store_id?: number;
        detail?: string;
      };

      if (!response.ok) {
        setNotice(data.detail ?? "초대 코드 등록에 실패했어요.");
        return;
      }

      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, "staff");
      setRole("staff");
      setStaffInviteCode("");
      setNotice("직원 권한이 연결됐어요. 소상공인 게시판을 이용할 수 있어요.");
    } finally {
      setInviteBusy(false);
    }
  };

  if (!authChecked) {
    return <LoadingPage>프로필을 확인하는 중입니다.</LoadingPage>;
  }

  return (
    <Page>
      <Header>
        <Title>프로필</Title>
        <IconButton
          type="button"
          aria-label="설정"
          aria-pressed={settingsOpen}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <SettingsRoundedIcon aria-hidden />
        </IconButton>
      </Header>
      <Notice role="status">{notice}</Notice>
      {settingsOpen && (
        <ModalBackdrop role="presentation" onClick={() => setSettingsOpen(false)}>
          <SettingsPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHandle aria-hidden />
            <ModalHeader>
              <SettingsTitle id="profile-settings-title">설정</SettingsTitle>
              <ModalCloseButton type="button" aria-label="닫기" onClick={() => setSettingsOpen(false)}>
                <CloseRoundedIcon aria-hidden />
              </ModalCloseButton>
            </ModalHeader>
            <SettingSection>
              <SettingSectionTitle>알림</SettingSectionTitle>
              <SettingRow>
                <SettingText>
                  <SettingLabel>댓글 알림</SettingLabel>
                  <SettingCaption>내 글과 답글에 새 댓글이 달리면 알려줘요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={commentAlert}
                  onChange={(event) => setCommentAlert(event.target.checked)}
                />
                <SwitchTrack $checked={commentAlert} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>쪽지 알림</SettingLabel>
                  <SettingCaption>1:1 쪽지와 모임 조율 메시지를 받아요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={messageAlert}
                  onChange={(event) => setMessageAlert(event.target.checked)}
                />
                <SwitchTrack $checked={messageAlert} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>홍보 반응 알림</SettingLabel>
                  <SettingCaption>내 홍보글 조회, 좋아요, 문의 변화를 알려줘요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={promoAlert}
                  onChange={(event) => setPromoAlert(event.target.checked)}
                />
                <SwitchTrack $checked={promoAlert} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>모임 알림</SettingLabel>
                  <SettingCaption>참여 신청, 승인, 모집 마감 상태를 받아요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={meetingAlert}
                  onChange={(event) => setMeetingAlert(event.target.checked)}
                />
                <SwitchTrack $checked={meetingAlert} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>야간 방해금지</SettingLabel>
                  <SettingCaption>밤 11시부터 오전 8시까지 푸시를 묶어둬요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={quietMode}
                  onChange={(event) => setQuietMode(event.target.checked)}
                />
                <SwitchTrack $checked={quietMode} aria-hidden />
              </SettingRow>
            </SettingSection>
            <SettingSection>
              <SettingSectionTitle>계정 공개 범위</SettingSectionTitle>
              <SettingRow>
                <SettingText>
                  <SettingLabel>쪽지 수신 허용</SettingLabel>
                  <SettingCaption>모임 참여자와 가게 문의자가 쪽지를 보낼 수 있어요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={dmAllowed}
                  onChange={(event) => setDmAllowed(event.target.checked)}
                />
                <SwitchTrack $checked={dmAllowed} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>프로필 공개</SettingLabel>
                  <SettingCaption>작성글에서 내 활동 요약을 다른 유저에게 보여줘요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(event) => setProfilePublic(event.target.checked)}
                />
                <SwitchTrack $checked={profilePublic} aria-hidden />
              </SettingRow>
              <SettingRow>
                <SettingText>
                  <SettingLabel>혜택/정책 소식 수신</SettingLabel>
                  <SettingCaption>상품권 정책, 지원금, 이벤트 안내를 받아요.</SettingCaption>
                </SettingText>
                <Toggle
                  type="checkbox"
                  checked={marketingAgree}
                  onChange={(event) => setMarketingAgree(event.target.checked)}
                />
                <SwitchTrack $checked={marketingAgree} aria-hidden />
              </SettingRow>
            </SettingSection>
            <SettingSection>
              <SettingSectionTitle>가맹점 권한</SettingSectionTitle>
              <VerifyCard>
                <VerifyTitle>가맹점 인증</VerifyTitle>
                <RoleBadge>
                  {role === "guest" ? "일반 손님" : role === "staff" ? "직원 권한 연결" : "가맹점 인증 완료"}
                </RoleBadge>
                <VerifyDesc>
                  국세청 사업자등록정보와 한국조폐공사 지역사랑상품권 가맹점 데이터를 함께
                  대조합니다. 두 데이터가 맞으면 가게 홍보와 소상공인 익명 게시판 권한이 열립니다.
                </VerifyDesc>
                <PublicDataChecks>
                  <PublicDataCheck $done={verifiedStore?.nts_verified} $pending={verifiedStore?.is_manual_review}>
                    국세청 사업자등록정보 진위확인
                    <span>
                      {verifiedStore?.nts_verified
                        ? "완료"
                        : verifiedStore?.is_manual_review
                          ? "검토중"
                          : "대기"}
                    </span>
                  </PublicDataCheck>
                  <PublicDataCheck
                    $done={verifiedStore?.gift_card_verified}
                    $pending={verifiedStore?.is_manual_review}
                  >
                    한국조폐공사 지역사랑상품권 가맹점 대조
                    <span>
                      {verifiedStore?.gift_card_verified
                        ? "완료"
                        : verifiedStore?.is_manual_review
                          ? "검토중"
                          : "대기"}
                    </span>
                  </PublicDataCheck>
                </PublicDataChecks>
                {role === "guest" ? (
                  <VerifyGrid>
                    <VerifyInput
                      value={businessNumber}
                      onChange={(event) => setBusinessNumber(event.target.value)}
                      placeholder="사업자등록번호 예: 1234567890"
                      aria-label="사업자등록번호"
                    />
                    <VerifyInput
                      value={storeName}
                      onChange={(event) => setStoreName(event.target.value)}
                      placeholder="가게명"
                      aria-label="가게명"
                    />
                    <VerifyInput
                      value={storeAddress}
                      onChange={(event) => setStoreAddress(event.target.value)}
                      placeholder="사업장 주소"
                      aria-label="사업장 주소"
                    />
                    <VerifyInput
                      value={businessStartDate}
                      onChange={(event) => setBusinessStartDate(event.target.value)}
                      placeholder="개업일자 예: 20240101"
                      inputMode="numeric"
                      aria-label="개업일자"
                    />
                    <VerifyInput
                      value={representativeName}
                      onChange={(event) => setRepresentativeName(event.target.value)}
                      placeholder="대표자명"
                      aria-label="대표자명"
                    />
                    <PrimaryButton type="button" onClick={verifyStore} disabled={verifyingStore}>
                      {verifyingStore ? "확인 중" : "가맹점 인증하기"}
                    </PrimaryButton>
                    <VerifyDesc>직원이라면 사장님에게 받은 초대 코드를 등록할 수 있어요.</VerifyDesc>
                    <VerifyInput
                      value={staffInviteCode}
                      onChange={(event) => setStaffInviteCode(event.target.value)}
                      placeholder="직원 초대 코드"
                      aria-label="직원 초대 코드"
                    />
                    <SecondaryButton type="button" onClick={useStaffInviteCode} disabled={inviteBusy}>
                      {inviteBusy ? "등록 중" : "직원 코드 등록"}
                    </SecondaryButton>
                  </VerifyGrid>
                ) : (
                  <VerifyGrid>
                    <VerifyDesc>
                      {verifiedStore?.name ?? "인증된 가게"} · {verifiedStore?.address ?? "주소 확인됨"}
                    </VerifyDesc>
                    <VerifyDesc>
                      {verifiedStore?.public_data_source ??
                        "국세청 사업자등록정보 + 한국조폐공사 지역사랑상품권 가맹점 기본정보"}
                    </VerifyDesc>
                    {role === "owner" && (
                      <SecondaryButton type="button" onClick={issueInviteCode} disabled={inviteBusy}>
                        {inviteBusy ? "발급 중" : "직원 초대 코드 발급"}
                      </SecondaryButton>
                    )}
                    {inviteCode && <VerifyDesc>초대 코드 {inviteCode}</VerifyDesc>}
                    <SecondaryButton type="button" onClick={becomeGuest}>
                      일반 손님으로 전환
                    </SecondaryButton>
                  </VerifyGrid>
                )}
              </VerifyCard>
            </SettingSection>
            <SettingSection>
              <SettingSectionTitle>관리</SettingSectionTitle>
              <SettingActionRow type="button" onClick={() => openSheet("차단 관리")}>
                <SettingText>
                  <SettingLabel>차단 관리</SettingLabel>
                  <SettingCaption>쪽지 차단한 유저를 확인하고 해제해요.</SettingCaption>
                </SettingText>
                <RowChevron aria-hidden />
              </SettingActionRow>
              <SettingActionRow type="button" onClick={() => openSheet("신고 내역")}>
                <SettingText>
                  <SettingLabel>신고 내역</SettingLabel>
                  <SettingCaption>게시글과 쪽지 신고 처리 상태를 확인해요.</SettingCaption>
                </SettingText>
                <RowChevron aria-hidden />
              </SettingActionRow>
              <SettingActionRow type="button" onClick={() => openSheet("약관 및 개인정보")}>
                <SettingText>
                  <SettingLabel>약관 및 개인정보</SettingLabel>
                  <SettingCaption>서비스 이용 약관과 개인정보 설정을 관리해요.</SettingCaption>
                </SettingText>
                <RowChevron aria-hidden />
              </SettingActionRow>
              <SettingActionRow type="button" onClick={logout}>
                <SettingText>
                  <SettingLabel>로그아웃</SettingLabel>
                  <SettingCaption>현재 계정 세션을 종료하고 로그인 화면으로 이동해요.</SettingCaption>
                </SettingText>
                <LogoutRoundedIcon aria-hidden />
              </SettingActionRow>
            </SettingSection>
          </SettingsPanel>
        </ModalBackdrop>
      )}
      <ProfileCard>
        <UserRow>
          <Avatar>
            <AvatarPhoto src={avatarUrl} alt="" loading="lazy" />
          </Avatar>
          <UserInfo>
            <Nickname>{nickname}</Nickname>
            <UserMeta>
              {neighborhood || "동네 미설정"} · {role === "guest" ? "일반 손님" : "서래갈매기 사장님"}
            </UserMeta>
          </UserInfo>
          <EditButton type="button" onClick={() => router.push("/profile/edit")}>
            수정
          </EditButton>
        </UserRow>
        <StatGrid>
          {statItems.map((stat) => (
            <StatItem key={stat.label}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatGrid>
      </ProfileCard>
      {role !== "guest" && (
        <StoreCard>
          <StoreIcon>
            <StorefrontRoundedIcon aria-hidden />
          </StoreIcon>
          <div>
            <StoreTitle>{verifiedStore?.name ?? "인증된 가맹점"}</StoreTitle>
            <StoreMeta>
              {verifiedStore?.is_manual_review
                ? "공공데이터 수동 검토 접수"
                : verifiedStore?.gift_card_verified
                  ? "지역사랑상품권 가맹점"
                  : "국세청 사업자 인증 완료"} ·{" "}
              {verifiedStore?.address ?? "소상공인 게시판 이용 가능"}
            </StoreMeta>
          </div>
          <StoreStatus>{verifiedStore?.is_manual_review ? "검토중" : "관리중"}</StoreStatus>
        </StoreCard>
      )}
      {sheet && (
        <ModalBackdrop role="presentation" onClick={() => setSheet(null)}>
          <SettingsPanel
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-detail-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHandle aria-hidden />
            <ModalHeader>
              <SettingsTitle id="profile-detail-sheet-title">{getSheetContent(sheet).title}</SettingsTitle>
              <ModalCloseButton type="button" aria-label="닫기" onClick={() => setSheet(null)}>
                <CloseRoundedIcon aria-hidden />
              </ModalCloseButton>
            </ModalHeader>
            <SheetList>
              {getSheetContent(sheet).items.map((item) => (
                <SheetItem
                  key={`${item.title}-${item.body}`}
                  type="button"
                  $clickable={Boolean(item.href)}
                  onClick={() => {
                    if (!item.href) return;
                    setSheet(null);
                    router.push(item.href);
                  }}
                >
                  <SheetItemTitle>{item.title}</SheetItemTitle>
                  <SheetItemBody>{item.body}</SheetItemBody>
                </SheetItem>
              ))}
            </SheetList>
            {sheet === "차단 관리" && (
              <DangerButton type="button" onClick={() => setNotice("차단 목록이 최신 상태입니다.")}>
                차단 목록 새로고침
              </DangerButton>
            )}
          </SettingsPanel>
        </ModalBackdrop>
      )}
      <Section>
        <SectionTitle>내 활동</SectionTitle>
        <MenuList>
          {MENUS.map(({ label, caption, icon: Icon }) => (
            <MenuItem key={label} type="button" onClick={() => openActivity(label)}>
              <MenuIcon>
                <Icon aria-hidden />
              </MenuIcon>
              <MenuText>
                <MenuLabel>{label}</MenuLabel>
                <MenuCaption>{caption}</MenuCaption>
              </MenuText>
              <Chevron aria-hidden />
            </MenuItem>
          ))}
        </MenuList>
      </Section>
    </Page>
  );
}
