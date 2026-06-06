"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import { theme } from "@/styles/theme";
import {
  BOARDS,
  COMMUNITY_POSTS_STORAGE_KEY,
  type BoardValue,
  type ApiCommunityPost,
  type CommunityPost,
  type UserRole,
  canAccessBoard,
  getBoardLabel,
  getHotScore,
  isRecentSevenDays,
  mapApiPost,
  readUserRole,
} from "./communityData";

const CAT_AVATAR_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=80";

const Page = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.white};
`;

const Header = styled.header`
  padding: 56px 23px 18px;
`;

const Title = styled.h1`
  margin: 0;
  color: #17313a;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0;
`;

const FilterScroller = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 100vw;
  padding: 5px 14px 19px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-padding-inline: 14px;
  overscroll-behavior-x: contain;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active?: boolean; $hot?: boolean; $sort?: boolean }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: ${({ $sort }) => ($sort ? "84px" : "72px")};
  height: 36px;
  padding: 0 17px;
  border: 1px solid
    ${({ $active, $hot }) =>
      $active ? ($hot ? "#ff5a5f" : "#173f49") : "rgba(0, 0, 0, 0.04)"};
  border-radius: 8px;
  background: ${({ $active, $hot }) =>
    $active ? ($hot ? "#ff5a5f" : "#173f49") : theme.colors.white};
  color: ${({ $active, $hot }) =>
    $active ? theme.colors.white : $hot ? "#ff5a5f" : "#a5a5a5"};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  white-space: nowrap;

  svg {
    font-size: 14px;
  }
`;

const PermissionNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: -8px 16px 12px;
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid #f0dada;
  background: #fffafa;
  color: ${theme.colors.coralDark};
  font-size: 12px;
  font-weight: 600;

  svg {
    flex-shrink: 0;
    font-size: 16px;
  }
`;

const Feed = styled.div`
  display: grid;
`;

const Post = styled(Link)<{ $blinded?: boolean }>`
  display: block;
  padding: 24px 22px 18px;
  border-top: 1px solid #f1f1f1;
  background: ${({ $blinded }) => ($blinded ? "#fafafa" : theme.colors.white)};
`;

const BoardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
`;

const BoardLabel = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e8e8e8;
`;

const GiftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #fff;
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e8e8e8;

  svg {
    font-size: 12px;
  }
`;

const PostHead = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 9px;
  align-items: center;
`;

const Avatar = styled.div<{ $variant: CommunityPost["avatar"] }>`
  position: relative;
  width: 42px;
  height: 42px;
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

const AuthorLine = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 700;
`;

const Time = styled.span`
  color: #bcbcbc;
  font-weight: 400;
`;

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 1px;
  color: #6f6f6f;
  font-size: 10px;
`;

const AuthorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 14px;
  padding: 0 5px;
  border-radius: 3px;
  background: #f4f4f4;
  color: ${theme.colors.textSecondary};
  font-size: 8px;
  font-weight: 600;
  border: 1px solid #e6e6e6;
`;

const PostTitle = styled.h2`
  margin: 21px 0 14px;
  color: ${theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: 0;
`;

const PostText = styled.p`
  margin: 0;
  color: #333333;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.62;
  letter-spacing: 0;

  & + & {
    margin-top: 14px;
  }
`;

const MeetingInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 13px;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
`;

const MeetingChip = styled.span<{ $status?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid ${({ $status }) => ($status ? "#d8e5df" : "#e8e8e8")};
  border-radius: 6px;
  background: ${({ $status }) => ($status ? "#f6faf8" : theme.colors.white)};
  color: ${({ $status }) => ($status ? "#35604f" : theme.colors.textSecondary)};
  font-size: 11px;
  font-weight: ${({ $status }) => ($status ? 600 : 500)};
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
`;

const Reactions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const Reaction = styled.span<{ $tone?: "like" | "comment" }>`
  display: inline-flex;
  align-items: center;
  height: 16px;
  gap: 2px;
  color: ${({ $tone }) => ($tone === "like" ? "#ff6060" : "#2f9ab7")};
  font-size: 11px;
  line-height: 1;

  img {
    display: block;
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    object-fit: contain;
    vertical-align: middle;
  }
`;

const Views = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #8d8d8d;
  font-size: 10px;

  svg {
    font-size: 15px;
  }
`;

const EmptyState = styled.div`
  padding: 54px 22px;
  color: ${theme.colors.textMuted};
  font-size: 13px;
  text-align: center;
`;

const FloatingButton = styled(Link)`
  position: fixed;
  right: 20px;
  bottom: calc(${theme.layout.bottomNavHeight}px + 34px);
  z-index: 90;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #37c9a2;
  color: ${theme.colors.white};
  box-shadow: 0 4px 10px rgba(55, 201, 162, 0.22);
  cursor: pointer;

  svg {
    font-size: 28px;
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

export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState<BoardValue>("hot");
  const [latestFirst, setLatestFirst] = useState(true);
  const [storedPosts, setStoredPosts] = useState<Array<CommunityPost>>([]);
  const [role, setRole] = useState<UserRole>("guest");
  const [permissionNotice, setPermissionNotice] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setRole(readUserRole());
      setStoredPosts(readStoredPosts());
    });

    void fetch("/api/masil/community/posts", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("community api unavailable");
        return response.json() as Promise<Array<ApiCommunityPost>>;
      })
      .then((posts) => {
        setStoredPosts(posts.map(mapApiPost));
      })
      .catch(() => undefined);
  }, []);

  const posts = useMemo(() => {
    const savedPosts = storedPosts.map((post) => ({
      ...post,
      board: post.board ?? ("local" as const),
    }));

    const accessiblePosts = savedPosts.filter((post) => canAccessBoard(post.board, role));
    const filtered =
      activeBoard === "hot"
        ? accessiblePosts
            .filter((post) => isRecentSevenDays(post) && !post.blinded)
            .sort((a, b) => getHotScore(b) - getHotScore(a))
        : accessiblePosts.filter((post) => post.board === activeBoard);

    if (activeBoard === "hot") return filtered;
    return latestFirst ? filtered : [...filtered].reverse();
  }, [activeBoard, latestFirst, role, storedPosts]);

  const selectBoard = (board: (typeof BOARDS)[number]) => {
    if (!canAccessBoard(board.value, role)) {
      setPermissionNotice("권한이 없습니다. 가맹점 인증 후 이용할 수 있어요.");
      return;
    }

    setPermissionNotice("");
    setActiveBoard(board.value);
  };

  return (
    <Page>
      <Header>
        <Title>커뮤니티</Title>
      </Header>
      <FilterScroller aria-label="게시판 필터">
        <FilterButton type="button" $sort onClick={() => setLatestFirst((current) => !current)}>
          {latestFirst ? "최신순" : "오래된순"}
          <KeyboardArrowDownRoundedIcon aria-hidden />
        </FilterButton>
        {BOARDS.map((board) => (
          <FilterButton
            key={board.value}
            type="button"
            $active={activeBoard === board.value}
            $hot={board.value === "hot"}
            aria-pressed={activeBoard === board.value}
            onClick={() => selectBoard(board)}
          >
            {!canAccessBoard(board.value, role) && <LockRoundedIcon aria-hidden />}
            {board.label}
          </FilterButton>
        ))}
      </FilterScroller>
      {permissionNotice && (
        <PermissionNotice role="alert">
          <LockRoundedIcon aria-hidden />
          {permissionNotice}
        </PermissionNotice>
      )}
      <Feed>
        {posts.map((post) => {
          const blinded = (post.reports ?? 0) >= 5 || post.blinded;

          return (
            <Post key={post.id} href={`/community/posts/${post.id}`} $blinded={blinded}>
              <BoardRow>
                <BoardLabel>{getBoardLabel(post.board)}</BoardLabel>
                {post.promoCategory && <BoardLabel>{post.promoCategory}</BoardLabel>}
                {post.giftCertificate && (
                  <GiftBadge>
                    <LocalOfferRoundedIcon aria-hidden />
                    상품권 결제 가능
                  </GiftBadge>
                )}
              </BoardRow>
              <PostHead>
                <Avatar $variant={post.avatar}>
                  <AvatarPhoto src={CAT_AVATAR_URL} alt="" loading="lazy" />
                </Avatar>
                <div>
                  <AuthorLine>
                    {post.board === "owner" || post.anonymous ? "익명" : post.name}
                    <Time>{post.time}</Time>
                  </AuthorLine>
                  <MetaLine>
                    {post.location}
                    {post.badge && <AuthorBadge>{post.badge}</AuthorBadge>}
                  </MetaLine>
                </div>
              </PostHead>
              <PostTitle>{blinded ? "신고 누적으로 블라인드 처리된 글입니다" : post.title}</PostTitle>
              {!blinded && (
                <>
                  <PostText>{post.body}</PostText>
                  {post.ps && <PostText>{post.ps}</PostText>}
                  {post.board === "meet" && (
                    <MeetingInfo>
                      <MeetingChip>{post.meetingAt}</MeetingChip>
                      <MeetingChip>{post.meetingPlace}</MeetingChip>
                      <MeetingChip $status>
                        {post.meetingApplicants ?? 0}/{post.meetingMaxPeople ?? 0}명 ·{" "}
                        {post.meetingStatus}
                      </MeetingChip>
                    </MeetingInfo>
                  )}
                </>
              )}
              <PostActions>
                <Reactions>
                  <Reaction $tone="like">
                    <Image src="/images/좋아요.svg" alt="" width={14} height={14} aria-hidden />
                    {post.likes}
                  </Reaction>
                  <Reaction $tone="comment">
                    <Image src="/images/댓글.svg" alt="" width={14} height={14} aria-hidden />
                    {post.comments}
                  </Reaction>
                </Reactions>
                <Views>
                  <VisibilityRoundedIcon aria-hidden />
                  {post.views}
                </Views>
              </PostActions>
            </Post>
          );
        })}
        {posts.length === 0 && (
          <EmptyState>
            {activeBoard === "hot" ? "아직 핫게에 올라온 글이 없어요." : "아직 올라온 글이 없어요."}
          </EmptyState>
        )}
      </Feed>
      <FloatingButton href="/community/write" aria-label="글쓰기">
        <CreateRoundedIcon aria-hidden />
      </FloatingButton>
    </Page>
  );
}
