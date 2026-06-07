"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import { theme } from "@/styles/theme";
import {
  COMMUNITY_COMMENTS_STORAGE_KEY,
  COMMUNITY_LIKED_POSTS_STORAGE_KEY,
  COMMUNITY_POSTS_STORAGE_KEY,
  type ApiCommunityPost,
  type CommunityPost,
  getBoardLabel,
  formatPostTime,
  mapApiPost,
} from "./communityData";

const CAT_AVATAR_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=80";

type CommentItem = {
  id: number;
  board: string;
  author: string;
  body: string;
  time: string;
  likes: number;
  replies?: Array<CommentItem>;
};

type ApiComment = {
  id: number;
  post_id: number;
  parent_id?: number | null;
  board_label: string;
  author_name: string;
  body: string;
  likes: number;
  created_at: string;
  replies?: Array<ApiComment>;
};

const Page = styled.main`
  min-height: 100dvh;
  padding-bottom: calc(74px + env(safe-area-inset-bottom, 0px));
  background: ${theme.colors.white};
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 91px;
  padding: 32px 15px 0;
  background: ${theme.colors.white};
`;

const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const IconLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: ${theme.colors.black};

  svg {
    font-size: 21px;
  }
`;

const LogoMark = styled(Image)`
  width: 39px;
  height: 39px;
  object-fit: contain;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.black};
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

const ActiveActionButton = styled(ActionButton)<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? theme.colors.coral : theme.colors.black)};
`;

const Article = styled.article`
  padding: 17px 16px 24px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 22px;
  padding: 0 9px;
  border-radius: 6px;
  background: #fff;
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e8e8e8;

  svg {
    font-size: 13px;
  }
`;

const PostHead = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 9px;
  align-items: center;
`;

const Avatar = styled.div`
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
  margin-top: 1px;
  color: #6f6f6f;
  font-size: 11px;
`;

const PostTitle = styled.h1`
  margin: 29px 0 23px;
  color: ${theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: 0;
`;

const Body = styled.div`
  display: grid;
  gap: 16px;
`;

const PostText = styled.p`
  margin: 0;
  color: #303030;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.72;
  letter-spacing: 0;
`;

const MeetingBox = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 18px;
  padding: 14px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px solid #eeeeee;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
`;

const MeetingStatus = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;

const MeetingDetailGrid = styled.div`
  display: grid;
  gap: 6px;
`;

const MeetingDetailRow = styled.div`
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 8px;
`;

const MeetingDetailLabel = styled.span`
  color: ${theme.colors.textMuted};
`;

const MeetingDetailValue = styled.span`
  color: ${theme.colors.textPrimary};
`;

const MeetingActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 4px;
`;

const FilledButton = styled.button<{ $secondary?: boolean }>`
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: ${({ $secondary }) => ($secondary ? "#173f49" : theme.colors.coral)};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 700;
`;

const ReactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
`;

const Reaction = styled.span<{ $tone?: "like" | "comment" }>`
  display: inline-flex;
  align-items: center;
  height: 16px;
  gap: 3px;
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

const ReactionButton = styled.button<{ $tone?: "like"; $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 16px;
  gap: 3px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? theme.colors.coralDark : "#ff6060")};
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

const CommentSection = styled.section`
  background: #f7f8fa;
  border-top: 8px solid #f0f1f3;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 16px 11px;
`;

const CommentTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;

const CommentCount = styled.span`
  color: ${theme.colors.coral};
`;

const SortButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.textMuted};
  font-size: 11px;
  font-weight: 500;
`;

const CommentList = styled.div`
  display: grid;
  gap: 8px;
  padding: 0 12px 16px;
`;

const CommentCard = styled.article`
  padding: 14px 14px 13px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.035);
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentAuthorLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const MiniAvatar = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e9e9e9;
  background-image: url("${CAT_AVATAR_URL}");
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const CommentBoard = styled.span`
  color: #9a9a9a;
  font-size: 10px;
  font-weight: 500;

  &::after {
    content: "·";
    margin-left: 6px;
    color: #c8c8c8;
  }
`;

const CommentAuthor = styled.strong`
  color: #424242;
  font-size: 12px;
  font-weight: 600;
`;

const CommentText = styled.p`
  margin: 11px 0 12px;
  color: #333333;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b7b7b7;
  font-size: 11px;
`;

const CommentTime = styled.span`
  color: #b7b7b7;
  font-size: 11px;
`;

const TextButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: #b7b7b7;
  font-size: 11px;
`;

const ReplyItem = styled.article`
  margin-top: 10px;
  margin-left: 28px;
  padding: 11px 12px 10px;
  border-radius: 8px;
  background: #f8f9fa;
`;

const CommentInputBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  display: grid;
  grid-template-columns: 1fr 36px;
  gap: 8px;
  align-items: center;
  min-height: calc(62px + env(safe-area-inset-bottom, 0px));
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #ededed;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
`;

const CommentInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #eeeeee;
  border-radius: ${theme.radii.pill};
  outline: none;
  background: #f8f8f8;
  color: ${theme.colors.textPrimary};
  font-size: 13px;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: ${theme.colors.coral};
  color: ${theme.colors.white};

  svg {
    font-size: 19px;
  }
`;

const NotFound = styled.section`
  display: grid;
  gap: 10px;
  padding: 42px 24px;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  text-align: center;
`;

const BackToList = styled(Link)`
  justify-self: center;
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  background: #37c9a2;
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 700;
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

function writeStoredPosts(posts: Array<CommunityPost>) {
  window.localStorage.setItem(COMMUNITY_POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function findPost(postId: string) {
  const id = Number(postId);
  return readStoredPosts().find((post) => post.id === id) ?? null;
}

function readStoredComments(postId: string) {
  const stored = window.localStorage.getItem(COMMUNITY_COMMENTS_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as Record<string, Array<CommentItem>>;
    return parsed[postId] ?? [];
  } catch {
    return [];
  }
}

function writeStoredComments(postId: string, comments: Array<CommentItem>) {
  let parsed: Record<string, Array<CommentItem>> = {};

  try {
    const stored = window.localStorage.getItem(COMMUNITY_COMMENTS_STORAGE_KEY);
    parsed = stored ? (JSON.parse(stored) as Record<string, Array<CommentItem>>) : {};
  } catch {
    parsed = {};
  }

  parsed[postId] = comments;
  window.localStorage.setItem(COMMUNITY_COMMENTS_STORAGE_KEY, JSON.stringify(parsed));
}

function countComments(comments: Array<CommentItem>) {
  return comments.reduce((total, comment) => total + 1 + (comment.replies?.length ?? 0), 0);
}

function readStoredUserName() {
  try {
    const stored = window.localStorage.getItem("masil.user");
    if (!stored) return "주먹펴고일어서";
    const parsed = JSON.parse(stored) as { nickname?: string; id?: string };
    return parsed.nickname || parsed.id || "주먹펴고일어서";
  } catch {
    return "주먹펴고일어서";
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

function writeLikedPostId(postId: number, liked: boolean) {
  const ids = readLikedPostIds();
  const nextIds = liked
    ? Array.from(new Set([...ids, postId]))
    : ids.filter((id) => id !== postId);

  window.localStorage.setItem(COMMUNITY_LIKED_POSTS_STORAGE_KEY, JSON.stringify(nextIds));
}

function mapApiComment(comment: ApiComment): CommentItem {
  return {
    id: comment.id,
    board: comment.board_label,
    author: comment.author_name,
    body: comment.body,
    time: formatPostTime(comment.created_at),
    likes: comment.likes,
    replies: comment.replies?.map(mapApiComment) ?? [],
  };
}

export default function CommunityPostDetailPage({ postId }: { postId: string }) {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [notified, setNotified] = useState(false);
  const [reported, setReported] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<{ id: number; author: string } | null>(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const [comments, setComments] = useState<Array<CommentItem>>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const nextPost = findPost(postId);
      setPost(nextPost);
      setLiked(readLikedPostIds().includes(Number(postId)));
      setComments(readStoredComments(postId));
    });

    void fetch(`/api/masil/community/posts/${postId}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("post api unavailable");
        return response.json() as Promise<ApiCommunityPost>;
      })
      .then((apiPost) => {
        const nextPost = mapApiPost(apiPost);
        setPost(nextPost);
        writeStoredPosts([
          nextPost,
          ...readStoredPosts().filter((storedPost) => storedPost.id !== nextPost.id),
        ]);
      })
      .catch(() => undefined);

    void fetch(`/api/masil/community/posts/${postId}/comments`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("comment api unavailable");
        return response.json() as Promise<Array<ApiComment>>;
      })
      .then((apiComments) => {
        const nextComments = apiComments.map(mapApiComment);
        setComments(nextComments);
        writeStoredComments(postId, nextComments);
      })
      .catch(() => undefined);
  }, [postId]);

  const visibleComments = newestFirst ? comments : [...comments].reverse();
  const totalComments = countComments(comments);

  if (!post) {
    return (
      <Page>
        <TopBar>
          <LeftCluster>
            <IconLink href="/community" aria-label="뒤로가기">
              <ArrowBackIosNewRoundedIcon aria-hidden />
            </IconLink>
            <LogoMark src="/images/logo.png" alt="마실" width={39} height={39} />
          </LeftCluster>
        </TopBar>
        <NotFound>
          저장된 글을 찾을 수 없어요.
          <BackToList href="/community">목록으로 돌아가기</BackToList>
        </NotFound>
      </Page>
    );
  }

  const blinded = (post.reports ?? 0) >= 5 || post.blinded;
  const applicantCount = post.meetingApplicants ?? 0;
  const maxPeople = post.meetingMaxPeople ?? 0;
  const meetingFull = post.board === "meet" && applicantCount >= maxPeople;

  const authorName = post.board === "owner" || post.anonymous ? "익명" : post.name;

  const updatePost = (updater: (current: CommunityPost) => CommunityPost) => {
    const posts = readStoredPosts();
    const nextPosts = posts.map((item) => (item.id === post.id ? updater(item) : item));
    const nextPost = nextPosts.find((item) => item.id === post.id) ?? updater(post);
    writeStoredPosts(nextPosts);
    setPost(nextPost);
  };

  const persistComments = (nextComments: Array<CommentItem>) => {
    setComments(nextComments);
    writeStoredComments(postId, nextComments);
    updatePost((current) => ({
      ...current,
      comments: countComments(nextComments),
    }));
  };

  const submitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || blinded) return;

    const token = window.localStorage.getItem("masil.accessToken");
    if (token) {
      void fetch(`/api/masil/community/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: trimmed, parent_id: replyTarget?.id }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("comment api unavailable");
          return response.json() as Promise<ApiComment>;
        })
        .then((apiComment) => {
          const savedComment = mapApiComment(apiComment);
          const nextComments = replyTarget
            ? comments.map((comment) =>
                comment.id === replyTarget.id
                  ? { ...comment, replies: [...(comment.replies ?? []), savedComment] }
                  : comment,
              )
            : [savedComment, ...comments];

          persistComments(nextComments);
          setCommentText("");
          setReplyTarget(null);
        })
        .catch(() => undefined);
      return;
    }

    const newComment: CommentItem = {
      id: Date.now(),
      board:
        post.board === "owner"
          ? "소상공인"
          : post.board === "local"
            ? "동네"
            : post.board === "meet"
              ? "유저모임"
              : "음식점",
      author: post.board === "owner" ? `익명${comments.length + 1}` : readStoredUserName(),
      body: trimmed,
      time: "방금",
      likes: 0,
      replies: [],
    };

    if (replyTarget) {
      const nextComments = comments.map((comment) =>
          comment.id === replyTarget.id
            ? { ...comment, replies: [...(comment.replies ?? []), newComment] }
            : comment,
      );
      persistComments(nextComments);
    } else {
      persistComments([newComment, ...comments]);
    }

    setCommentText("");
    setReplyTarget(null);
  };

  const applyMeeting = () => {
    if (meetingFull) return;
    void fetch(`/api/masil/community/posts/${post.id}/meeting/apply`, {
      method: "POST",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("meeting api unavailable");
        return response.json() as Promise<ApiCommunityPost>;
      })
      .then((apiPost) => updatePost(() => mapApiPost(apiPost)))
      .catch(() => undefined);
    updatePost((current) => ({
      ...current,
      meetingApplicants: (current.meetingApplicants ?? 0) + 1,
      meetingStatus:
        (current.meetingApplicants ?? 0) + 1 >= (current.meetingMaxPeople ?? 0)
          ? "모집 마감"
          : "모집중",
    }));
  };

  const reportPost = () => {
    setReported(true);
    void fetch(`/api/masil/community/posts/${post.id}/report`, {
      method: "POST",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("report api unavailable");
        return response.json() as Promise<ApiCommunityPost>;
      })
      .then((apiPost) => updatePost(() => mapApiPost(apiPost)))
      .catch(() => undefined);
    updatePost((current) => ({
      ...current,
      reports: Math.min(5, (current.reports ?? 0) + 1),
    }));
  };

  const toggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    writeLikedPostId(post.id, nextLiked);
    void fetch(`/api/masil/community/posts/${post.id}/like`, {
      method: nextLiked ? "POST" : "DELETE",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("like api unavailable");
        return response.json() as Promise<ApiCommunityPost>;
      })
      .then((apiPost) => updatePost(() => mapApiPost(apiPost)))
      .catch(() => undefined);
    updatePost((current) => ({
      ...current,
      likes: Math.max(0, current.likes + (nextLiked ? 1 : -1)),
    }));
  };

  return (
    <Page>
      <TopBar>
        <LeftCluster>
          <IconLink href="/community" aria-label="뒤로가기">
            <ArrowBackIosNewRoundedIcon aria-hidden />
          </IconLink>
          <LogoMark src="/images/logo.png" alt="마실" width={39} height={39} />
        </LeftCluster>
        <TopActions>
          <ActionButton
            type="button"
            aria-label="공유"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
            }}
          >
            <IosShareRoundedIcon aria-hidden />
          </ActionButton>
          <ActiveActionButton
            type="button"
            aria-label="알림"
            $active={notified}
            onClick={() => setNotified((current) => !current)}
          >
            <NotificationsNoneRoundedIcon aria-hidden />
          </ActiveActionButton>
          <ActiveActionButton
            type="button"
            aria-label="북마크"
            $active={bookmarked}
            onClick={() => setBookmarked((current) => !current)}
          >
            <BookmarkBorderRoundedIcon aria-hidden />
          </ActiveActionButton>
          <ActiveActionButton
            type="button"
            aria-label="신고"
            $active={reported}
            onClick={reportPost}
          >
            <ReportRoundedIcon aria-hidden />
          </ActiveActionButton>
        </TopActions>
      </TopBar>
      <Article>
        <BadgeRow>
          <Pill>{getBoardLabel(post.board)}</Pill>
          {post.promoCategory && <Pill>{post.promoCategory}</Pill>}
          {post.giftCertificate && (
            <Pill>
              <LocalOfferRoundedIcon aria-hidden />
              지역사랑상품권 가맹점
            </Pill>
          )}
        </BadgeRow>
        <PostHead>
          <Avatar>
            <AvatarPhoto src={CAT_AVATAR_URL} alt="" loading="lazy" />
          </Avatar>
          <div>
            <AuthorLine>
              {authorName}
              <Time>{post.time}</Time>
            </AuthorLine>
            <MetaLine>{post.location}</MetaLine>
          </div>
        </PostHead>
        <PostTitle>{blinded ? "신고 누적으로 블라인드 처리된 글입니다" : post.title}</PostTitle>
        {!blinded && (
          <>
            <Body>
              <PostText>{post.body}</PostText>
              {post.ps && <PostText>{post.ps}</PostText>}
            </Body>
            {post.board === "meet" && (
              <MeetingBox>
                <MeetingStatus>{post.meetingStatus}</MeetingStatus>
                <MeetingDetailGrid>
                  <MeetingDetailRow>
                    <MeetingDetailLabel>일시</MeetingDetailLabel>
                    <MeetingDetailValue>{post.meetingAt}</MeetingDetailValue>
                  </MeetingDetailRow>
                  <MeetingDetailRow>
                    <MeetingDetailLabel>장소</MeetingDetailLabel>
                    <MeetingDetailValue>{post.meetingPlace}</MeetingDetailValue>
                  </MeetingDetailRow>
                  <MeetingDetailRow>
                    <MeetingDetailLabel>참여</MeetingDetailLabel>
                    <MeetingDetailValue>
                      {post.meetingApplicants}/{post.meetingMaxPeople}명
                    </MeetingDetailValue>
                  </MeetingDetailRow>
                </MeetingDetailGrid>
                <MeetingActions>
                  <FilledButton type="button" disabled={meetingFull} onClick={applyMeeting}>
                    {meetingFull ? "모집 마감" : "참여 신청"}
                  </FilledButton>
                  <FilledButton type="button" $secondary>
                    쪽지로 조율
                  </FilledButton>
                </MeetingActions>
              </MeetingBox>
            )}
          </>
        )}
        <ReactionRow>
          <ReactionButton
            type="button"
            $tone="like"
            $active={liked}
            onClick={toggleLike}
          >
            <Image src="/images/좋아요.svg" alt="" width={14} height={14} aria-hidden />
            {post.likes}
          </ReactionButton>
          <Reaction $tone="comment">
            <Image src="/images/댓글.svg" alt="" width={14} height={14} aria-hidden />
            {totalComments}
          </Reaction>
        </ReactionRow>
      </Article>
      <CommentSection>
        <CommentHeader>
          <CommentTitle>
            댓글 <CommentCount>{totalComments}</CommentCount>
          </CommentTitle>
          <SortButton type="button" onClick={() => setNewestFirst((current) => !current)}>
            {newestFirst ? "최신순" : "오래된순"}
          </SortButton>
        </CommentHeader>
        <CommentList>
          {visibleComments.map((comment) => (
            <CommentCard key={comment.id}>
              <CommentMeta>
                <MiniAvatar />
                <CommentAuthorLine>
                  <CommentBoard>{comment.board}</CommentBoard>
                  <CommentAuthor>
                    {post.board === "owner" && comment.id === 1 ? "익명(작성자)" : comment.author}
                  </CommentAuthor>
                </CommentAuthorLine>
              </CommentMeta>
              <CommentText>{comment.body}</CommentText>
              <CommentActions>
                <CommentTime>{comment.time}</CommentTime>
                <TextButton type="button">좋아요 {comment.likes || ""}</TextButton>
                <TextButton type="button" onClick={() => setReplyTarget(comment)}>
                  답글쓰기
                </TextButton>
              </CommentActions>
              {comment.replies?.map((reply) => (
                <ReplyItem key={reply.id}>
                  <CommentAuthor>{reply.author}</CommentAuthor>
                  <CommentText>{reply.body}</CommentText>
                </ReplyItem>
              ))}
            </CommentCard>
          ))}
        </CommentList>
      </CommentSection>
      <CommentInputBar>
        <CommentInput
          value={commentText}
          disabled={blinded}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder={
            blinded
              ? "블라인드 처리된 글에는 댓글을 작성할 수 없어요"
              : replyTarget
                ? `${replyTarget.author}님에게 답글쓰기`
                : "댓글을 입력해보세요"
          }
          aria-label="댓글 입력"
          onKeyDown={(event) => {
            if (event.key === "Enter") submitComment();
            if (event.key === "Escape") setReplyTarget(null);
          }}
        />
        <SendButton type="button" aria-label="댓글 등록" onClick={submitComment}>
          <SendRoundedIcon aria-hidden />
        </SendButton>
      </CommentInputBar>
    </Page>
  );
}
