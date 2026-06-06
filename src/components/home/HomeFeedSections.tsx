"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { theme } from "@/styles/theme";

const POPULAR_POSTS = [
  {
    board: "사장님톡",
    title: "점심 피크 끝나고도 배달 계속 잡히나요?",
    meta: "댓글 18 · 12분 전",
    hot: true,
  },
  {
    board: "알바고민",
    title: "주말 마감 알바 시급 어느 정도가 적당할까요",
    meta: "댓글 9 · 28분 전",
    hot: false,
  },
  {
    board: "동네장사",
    title: "비 오는 날 매장 앞 입간판 효과 있나요?",
    meta: "댓글 23 · 44분 전",
    hot: true,
  },
] as const;

const COMMUNITY_TOPICS = [
  {
    category: "익명",
    title: "오늘 유성구 유동인구 확 줄지 않았나요",
    body: "덕명동 쪽은 점심 손님이 평소보다 조용하네요.",
    comments: 14,
    views: 286,
  },
  {
    category: "장사팁",
    title: "쿠폰은 첫 방문보다 재방문에 걸어야 체감돼요",
    body: "이번 달 실험해보니 2회차 쿠폰 반응이 더 좋았습니다.",
    comments: 31,
    views: 512,
  },
] as const;

const Section = styled.section`
  padding: 0 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0;

  span {
    color: ${theme.colors.coral};
  }
`;

const MoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0;
  color: ${theme.colors.textMuted};
  font-size: 11px;
  cursor: pointer;

  svg {
    font-size: 16px;
  }
`;

const FeedSection = styled(Section)`
  margin-top: 22px;
`;

const PopularList = styled.div`
  display: grid;
  gap: 8px;
`;

const PopularItem = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 8px;
  background: #fff;
`;

const PostBoard = styled.span<{ $ownerTalk?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: ${({ $ownerTalk }) => ($ownerTalk ? theme.colors.coralDark : theme.colors.textSecondary)};
  font-size: 10px;
  font-weight: 700;

  svg {
    color: ${({ $ownerTalk }) => ($ownerTalk ? theme.colors.coral : theme.colors.textMuted)};
    font-size: 13px;
  }
`;

const PostTitle = styled.h3`
  margin: 3px 0 4px;
  color: ${theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 850;
  line-height: 1.35;
`;

const PostMeta = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 9px;
`;

const HotBadge = styled.span`
  align-self: start;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 7px;
  border-radius: 6px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 9px;
  font-weight: 700;
  border: 1px solid #e8e8e8;

  svg {
    font-size: 12px;
    color: ${theme.colors.textMuted};
  }
`;

const TopicGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const TopicCard = styled.article`
  padding: 13px 14px 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid ${theme.colors.borderLight};
`;

const TopicTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TopicLabel = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 700;
  border: 1px solid #e8e8e8;
`;

const TopicStats = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.textMuted};
  font-size: 9px;

  svg {
    font-size: 12px;
  }
`;

const TopicTitle = styled.h3`
  margin: 7px 0 5px;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 900;
  line-height: 1.35;
`;

const TopicBody = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  line-height: 1.45;
`;

function PopularPosts() {
  return (
    <FeedSection>
      <SectionHeader>
        <SectionTitle>
          인기글 <span>TOP</span>
        </SectionTitle>
        <MoreButton href="/community">
          전체보기
          <ChevronRightIcon aria-hidden />
        </MoreButton>
      </SectionHeader>
      <PopularList>
        {POPULAR_POSTS.map((post) => (
          <PopularItem key={post.title}>
            <div>
              <PostBoard $ownerTalk={post.board === "사장님톡"}>
                {post.hot && <LocalFireDepartmentRoundedIcon aria-hidden />}
                {post.board}
              </PostBoard>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>{post.meta}</PostMeta>
            </div>
            {post.hot && (
              <HotBadge>
                <LocalFireDepartmentRoundedIcon aria-hidden />
                HOT
              </HotBadge>
            )}
          </PopularItem>
        ))}
      </PopularList>
    </FeedSection>
  );
}

function CommunityPreview() {
  return (
    <FeedSection>
      <SectionHeader>
        <SectionTitle>
          동네 <span>게시판</span>
        </SectionTitle>
        <MoreButton href="/community">
          더보기
          <ChevronRightIcon aria-hidden />
        </MoreButton>
      </SectionHeader>
      <TopicGrid>
        {COMMUNITY_TOPICS.map((topic) => (
          <TopicCard key={topic.title}>
            <TopicTop>
              <TopicLabel>{topic.category}</TopicLabel>
              <TopicStats>
                <ChatRoundedIcon aria-hidden />
                {topic.comments}
                <VisibilityRoundedIcon aria-hidden />
                {topic.views}
              </TopicStats>
            </TopicTop>
            <TopicTitle>{topic.title}</TopicTitle>
            <TopicBody>{topic.body}</TopicBody>
          </TopicCard>
        ))}
      </TopicGrid>
    </FeedSection>
  );
}

export default function HomeFeedSections() {
  return (
    <>
      <PopularPosts />
      <CommunityPreview />
    </>
  );
}
