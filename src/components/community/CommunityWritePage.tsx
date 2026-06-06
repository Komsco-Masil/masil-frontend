"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { theme } from "@/styles/theme";
import {
  COMMUNITY_POSTS_STORAGE_KEY,
  PROMO_CATEGORIES,
  type BoardValue,
  type ApiCommunityPost,
  type CommunityPost,
  type PromoCategory,
  type UserRole,
  canAccessBoard,
  mapApiPost,
  readUserRole,
} from "./communityData";

const WRITE_BOARDS: Array<{
  label: string;
  value: Exclude<BoardValue, "hot">;
}> = [
  { label: "동네", value: "local" },
  { label: "가게 홍보", value: "promo" },
  { label: "소상공인 익명", value: "owner" },
  { label: "유저모임", value: "meet" },
];

const MERCHANTS = ["서래갈매기 한밭대점", "고양이카페 DAZE", "아빠손칼국수"] as const;
const VERIFIED_STORE_STORAGE_KEY = "masil.verifiedStore";

const Page = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${theme.colors.white};
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 96px;
  padding: 31px 22px 0;
`;

const CloseLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 36px;
  height: 36px;
  color: ${theme.colors.black};

  svg {
    font-size: 25px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.black};
  font-size: 18px;
  font-weight: 900;
  text-align: center;
  letter-spacing: 0;
`;

const DoneButton = styled.button<{ $active?: boolean }>`
  justify-self: end;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? theme.colors.coral : "#d8d8d8")};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 800 : 400)};
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BoardTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 22px 14px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BoardButton = styled.button<{ $active?: boolean }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 31px;
  padding: 0 13px;
  border: 1px solid ${({ $active }) => ($active ? "#173f49" : "rgba(0, 0, 0, 0.05)")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#173f49" : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.textSecondary)};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};

  svg {
    font-size: 13px;
  }
`;

const FormBlock = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px 22px 0;
`;

const SegmentRow = styled.div`
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SegmentButton = styled.button<{ $active?: boolean }>`
  flex: 0 0 auto;
  height: 30px;
  padding: 0 11px;
  border: 1px solid ${({ $active }) => ($active ? "rgba(23, 63, 73, 0.18)" : "#eeeeee")};
  border-radius: 7px;
  background: ${({ $active }) => ($active ? "#eef6f7" : theme.colors.white)};
  color: ${({ $active }) => ($active ? "#173f49" : theme.colors.textMuted)};
  font-size: 11px;
  font-weight: 600;
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const TextField = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  outline: none;
  color: ${theme.colors.textPrimary};
  font-size: 13px;

  &::placeholder {
    color: #c9c9c9;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  height: 60px;
  padding: 0 22px 13px;
  border: 0;
  border-bottom: 1px solid #f0f0f0;
  outline: none;
  color: ${theme.colors.textPrimary};
  font-size: 17px;
  font-weight: 800;

  &::placeholder {
    color: #d7d7d7;
  }
`;

const BodyInput = styled.textarea`
  flex: 1;
  width: 100%;
  min-height: 320px;
  padding: 27px 22px;
  border: 0;
  outline: none;
  resize: none;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;

  &::placeholder {
    color: #cfcfcf;
    font-weight: 400;
  }
`;

const Helper = styled.p<{ $danger?: boolean }>`
  margin: 0;
  color: ${({ $danger }) => ($danger ? theme.colors.coralDark : theme.colors.textMuted)};
  font-size: 11px;
  line-height: 1.45;
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: calc(52px + env(safe-area-inset-bottom, 0px));
  padding: 0 28px env(safe-area-inset-bottom, 0px);
  border-top: 1px solid #eeeeee;
  background: ${theme.colors.white};
`;

const CameraButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #bdbdbd;
  font-size: 11px;
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

const OptionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const OptionLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #b9b9b9;
  font-size: 11px;
  font-weight: 600;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  background: ${theme.colors.white};

  &:checked {
    border-color: #173f49;
    background: #173f49;
  }
`;

function readStoredPosts() {
  const stored = window.localStorage.getItem(COMMUNITY_POSTS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Array<CommunityPost>;
  } catch {
    return [];
  }
}

function readStoredUser() {
  const fallback = {
    nickname: "주먹펴고일어서",
    neighborhood: "대전 · 덕명동",
  };

  try {
    const stored = window.localStorage.getItem("masil.user");
    if (!stored) return fallback;
    const parsed = JSON.parse(stored) as Partial<typeof fallback> & { id?: string };

    return {
      nickname: parsed.nickname || parsed.id || fallback.nickname,
      neighborhood: parsed.neighborhood || fallback.neighborhood,
    };
  } catch {
    return fallback;
  }
}

function readVerifiedStore() {
  try {
    const stored = window.localStorage.getItem(VERIFIED_STORE_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as { id?: number; name?: string; address?: string };
  } catch {
    return null;
  }
}

export default function CommunityWritePage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("guest");
  const [board, setBoard] = useState<Exclude<BoardValue, "hot">>("promo");
  const [promoCategory, setPromoCategory] = useState<PromoCategory>("이벤트");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [question, setQuestion] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [meetingAt, setMeetingAt] = useState("");
  const [meetingPlace, setMeetingPlace] = useState<string>(MERCHANTS[0]);
  const [meetingMaxPeople, setMeetingMaxPeople] = useState("4");
  const canUseBoard = canAccessBoard(board, role);
  const titleValid = title.trim().length > 0 && title.length <= 30;
  const bodyValid = body.trim().length > 0 && body.length <= 1000;
  const meetingValid = board !== "meet" || (meetingAt.trim() && meetingPlace.trim());
  const canSubmit = canUseBoard && titleValid && bodyValid && Boolean(meetingValid);
  const helperText = useMemo(() => {
    if (!canUseBoard) return "가맹점 인증된 사장/직원만 작성할 수 있어요.";
    if (!titleValid) return "제목은 필수이며 30자 이내로 작성해주세요.";
    if (!bodyValid) return "본문은 필수이며 1000자 이내로 작성해주세요.";
    if (!meetingValid) return "모임 일시와 장소를 입력해주세요.";
    return "이미지는 최대 5장까지 첨부할 수 있어요.";
  }, [bodyValid, canUseBoard, meetingValid, titleValid]);

  useEffect(() => {
    queueMicrotask(() => setRole(readUserRole()));
  }, []);

  const chooseBoard = (nextBoard: Exclude<BoardValue, "hot">) => {
    setBoard(nextBoard);
    if (nextBoard === "owner") {
      setAnonymous(true);
    }
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const maxPeople = Math.max(2, Number.parseInt(meetingMaxPeople, 10) || 2);
    const user = readStoredUser();
    const verifiedStore = readVerifiedStore();
    const displayName =
      board === "owner" ? "익명 사장님" : anonymous ? "익명" : user.nickname;
    const location =
      board === "meet"
        ? "대전 · 유저모임"
        : board === "owner"
          ? "대전 · 소상공인 익명"
          : board === "promo"
            ? verifiedStore?.address || "대전 · 서래갈매기"
            : user.neighborhood;

    const newPost: CommunityPost = {
      id: Date.now(),
      avatar: board === "promo" ? "blue" : board === "owner" ? "line" : "mono",
      board,
      name: displayName,
      anonymous: board === "owner" || anonymous,
      time: "방금",
      createdAt: new Date().toISOString(),
      location,
      badge: board === "promo" ? "상품권 가능" : board === "meet" ? "모집중" : undefined,
      title: title.trim(),
      body: body.trim(),
      ps:
        photoCount > 0
          ? `사진 ${photoCount}장이 첨부되었습니다.`
          : question
            ? "질문으로 등록된 글입니다."
            : "",
      likes: 0,
      comments: 0,
      views: 0,
      promoCategory: board === "promo" ? promoCategory : undefined,
      giftCertificate: board === "promo" || board === "meet",
      meetingAt: board === "meet" ? meetingAt.trim() : undefined,
      meetingPlace: board === "meet" ? meetingPlace.trim() : undefined,
      meetingMaxPeople: board === "meet" ? maxPeople : undefined,
      meetingApplicants: board === "meet" ? 1 : undefined,
      meetingStatus: board === "meet" ? "모집중" : undefined,
      reports: 0,
    };

    const token = window.localStorage.getItem("masil.accessToken");
    if (token) {
      const response = await fetch("/api/masil/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board: newPost.board,
          title: newPost.title,
          body: newPost.body,
          ps: newPost.ps,
          anonymous: newPost.anonymous,
          location: newPost.location,
          badge: newPost.badge,
          avatar: newPost.avatar,
          promo_category: newPost.promoCategory,
          gift_certificate: newPost.giftCertificate,
          meeting_at: newPost.meetingAt,
          meeting_place: newPost.meetingPlace,
          meeting_max_people: newPost.meetingMaxPeople,
          meeting_applicants: newPost.meetingApplicants,
          meeting_status: newPost.meetingStatus,
        }),
      }).catch(() => null);

      if (response?.ok) {
        const savedPost = mapApiPost((await response.json()) as ApiCommunityPost);
        if (board === "promo" && verifiedStore?.id) {
          await fetch("/api/masil/promotions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              store_id: verifiedStore.id,
              title: newPost.title,
              content: [newPost.body, newPost.ps].filter(Boolean).join("\n\n"),
            }),
          }).catch(() => undefined);
        }
        window.localStorage.setItem(
          COMMUNITY_POSTS_STORAGE_KEY,
          JSON.stringify([savedPost, ...readStoredPosts().filter((post) => post.id !== savedPost.id)]),
        );
        router.push("/community");
        return;
      }
    }

    window.localStorage.setItem(
      COMMUNITY_POSTS_STORAGE_KEY,
      JSON.stringify([newPost, ...readStoredPosts()]),
    );
    router.push("/community");
  };

  return (
    <Page>
      <Header>
        <CloseLink href="/community" aria-label="닫기">
          <CloseRoundedIcon aria-hidden />
        </CloseLink>
        <Title>글 쓰기</Title>
        <DoneButton
          type="submit"
          form="community-write-form"
          $active={canSubmit}
          disabled={!canSubmit}
        >
          완료
        </DoneButton>
      </Header>
      <Form id="community-write-form" onSubmit={submitPost}>
        <BoardTabs aria-label="게시판 선택">
          {WRITE_BOARDS.map((item) => (
            <BoardButton
              key={item.value}
              type="button"
              $active={board === item.value}
              aria-pressed={board === item.value}
              onClick={() => chooseBoard(item.value)}
            >
              {!canAccessBoard(item.value, role) && <LockRoundedIcon aria-hidden />}
              {item.label}
            </BoardButton>
          ))}
        </BoardTabs>
        <FormBlock>
          {board === "promo" && (
            <SegmentRow aria-label="홍보 카테고리">
              {PROMO_CATEGORIES.map((category) => (
                <SegmentButton
                  key={category}
                  type="button"
                  $active={promoCategory === category}
                  onClick={() => setPromoCategory(category)}
                >
                  {category}
                </SegmentButton>
              ))}
            </SegmentRow>
          )}
          {board === "meet" && (
            <FieldGrid>
              <TextField
                value={meetingAt}
                onChange={(event) => setMeetingAt(event.target.value)}
                placeholder="모임 일시 예: 오늘 오후 7:30"
                aria-label="모임 일시"
              />
              <TextField
                value={meetingPlace}
                onChange={(event) => setMeetingPlace(event.target.value)}
                placeholder="가맹점 DB 내 장소"
                aria-label="모임 장소"
              />
              <TextField
                value={meetingMaxPeople}
                onChange={(event) => setMeetingMaxPeople(event.target.value)}
                inputMode="numeric"
                placeholder="최대 인원"
                aria-label="최대 인원"
              />
            </FieldGrid>
          )}
          <Helper $danger={!canSubmit}>{helperText}</Helper>
        </FormBlock>
        <TitleInput
          value={title}
          maxLength={30}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="제목을 입력해주세요"
          aria-label="제목"
        />
        <BodyInput
          value={body}
          maxLength={1000}
          onChange={(event) => setBody(event.target.value)}
          placeholder="전할 말을 적어보세요"
          aria-label="본문"
        />
        <BottomBar>
          <CameraButton
            type="button"
            aria-label="사진 추가"
            aria-pressed={photoCount > 0}
            onClick={() => setPhotoCount((current) => Math.min(5, current + 1))}
          >
            <PhotoCameraRoundedIcon aria-hidden />
            {photoCount}/5
          </CameraButton>
          <OptionGroup>
            <OptionLabel>
              <Checkbox
                type="checkbox"
                checked={anonymous}
                disabled={board === "owner"}
                onChange={(event) => setAnonymous(event.target.checked)}
              />
              익명
            </OptionLabel>
            <OptionLabel>
              <Checkbox
                type="checkbox"
                checked={question}
                onChange={(event) => setQuestion(event.target.checked)}
              />
              질문
            </OptionLabel>
          </OptionGroup>
        </BottomBar>
      </Form>
    </Page>
  );
}
