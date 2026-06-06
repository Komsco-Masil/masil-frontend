"use client";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { theme } from "@/styles/theme";

const CAT_IMAGE_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=240&q=80";
const DAZE_IMAGE_URL =
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=420&q=80";

const THREADS = [
  {
    id: 1,
    name: "데이즈",
    tag: "홍보왕",
    time: "5시간 전",
    message: "광고봤는데 진짜 쿠폰더 있나요? 라떼요 여쭤요.",
    unread: 0,
    avatar: "cat",
  },
  {
    id: 2,
    name: "주먹펴고일어서",
    tag: "홍보왕",
    time: "7시간 전",
    message: "이 편지는 영국에서부터 시작되어...",
    unread: 1,
    avatar: "mascot",
  },
  {
    id: 3,
    name: "주먹펴고일어서",
    tag: "홍보왕",
    time: "7시간 전",
    message: "이 편지는 영국에서부터 시작되어...",
    unread: 1,
    avatar: "mascot",
  },
  {
    id: 4,
    name: "주먹펴고일어서",
    tag: "홍보왕",
    time: "7시간 전",
    message: "이 편지는 영국에서부터 시작되어...",
    unread: 1,
    avatar: "mascot",
  },
  {
    id: 5,
    name: "주먹펴고일어서",
    tag: "홍보왕",
    time: "7시간 전",
    message: "이 편지는 영국에서부터 시작되어...",
    unread: 1,
    avatar: "mascot",
  },
] as const;

const Page = styled.main`
  min-height: 100dvh;
  padding-bottom: ${theme.layout.bottomNavHeight}px;
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

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  padding: 5px 15px 13px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  min-width: 80px;
  height: 36px;
  padding: 0 20px;
  border: 1px solid ${({ $active }) => ($active ? "#173f49" : "rgba(0, 0, 0, 0.04)")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#173f49" : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : "#a5a5a5")};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
`;

const PromoCard = styled.article`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 12px;
  min-height: 70px;
  margin: 0 15px 14px;
  padding: 12px 12px 12px 16px;
  border-radius: 8px;
  background: #666666;
  color: ${theme.colors.white};
  overflow: hidden;
`;

const PromoText = styled.div`
  min-width: 0;
`;

const PromoLabel = styled.span`
  display: inline-flex;
  align-items: center;
  height: 15px;
  padding: 0 8px;
  border-radius: 4px;
  background: ${theme.colors.white};
  color: #6d6d6d;
  font-size: 8px;
  font-weight: 600;
`;

const PromoTitle = styled.h2`
  margin: 6px 0 2px;
  color: ${theme.colors.white};
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
`;

const PromoDesc = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 9px;
  line-height: 1.35;
`;

const PromoRating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
  color: #ffcf64;
  font-size: 10px;

  span {
    color: ${theme.colors.white};
  }

  svg {
    font-size: 12px;
  }
`;

const PromoImage = styled.div`
  position: relative;
  align-self: center;
  height: 58px;
  border-radius: 8px;
  overflow: hidden;
`;

const PromoPhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const ThreadList = styled.div`
  display: grid;
`;

const ThreadItem = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 10px;
  align-items: center;
  min-height: 73px;
  padding: 9px 15px;
  background: ${theme.colors.white};
`;

const Avatar = styled.div<{ $kind: (typeof THREADS)[number]["avatar"] }>`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: ${({ $kind }) => ($kind === "cat" ? "10px" : "0")};
  background: #eeeeee;
  clip-path: ${({ $kind }) =>
    $kind === "cat" ? "none" : "polygon(14% 22%, 26% 4%, 38% 20%, 62% 20%, 74% 4%, 86% 22%, 92% 88%, 8% 88%)"};
  overflow: hidden;
`;

const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const ThreadContent = styled.div`
  min-width: 0;
`;

const ThreadTop = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
`;

const ThreadName = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 700;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 14px;
  padding: 0 6px;
  border-radius: 30px;
  background: linear-gradient(90deg, #0091ee 0%, #00bfb2 100%);
  color: #fff;
  font-family: Pretendard, sans-serif;
  font-size: 7px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.14px;
  white-space: nowrap;
`;

const Time = styled.span`
  color: #b8b8b8;
  font-size: 10px;
`;

const MessagePreview = styled.p`
  margin: 4px 0 0;
  color: #5d5d5d;
  font-size: 10px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UnreadBadge = styled.span`
  display: grid;
  place-items: center;
  justify-self: end;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: ${theme.colors.coral};
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

type MessageFilter = "all" | "unread";

export default function MessagesPage() {
  const [filter, setFilter] = useState<MessageFilter>("all");
  const visibleThreads = useMemo(
    () => THREADS.filter((thread) => filter === "all" || thread.unread > 0),
    [filter],
  );

  return (
    <Page>
      <Header>
        <Title>채팅</Title>
      </Header>
      <Tabs aria-label="쪽지 필터">
        <TabButton
          type="button"
          $active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          전체
        </TabButton>
        <TabButton
          type="button"
          $active={filter === "unread"}
          onClick={() => setFilter("unread")}
        >
          안읽음
        </TabButton>
      </Tabs>
      <PromoCard>
        <PromoText>
          <PromoLabel>이달의 홍보</PromoLabel>
          <PromoTitle>귀여운 고양이 카페 구경하실분</PromoTitle>
          <PromoDesc>분위기 좋은 공간에서 달달한 커피 한 잔</PromoDesc>
          <PromoRating>
            <StarRoundedIcon aria-hidden />
            4.5 <span>고양이카페 DAZE</span>
          </PromoRating>
        </PromoText>
        <PromoImage>
          <PromoPhoto src={DAZE_IMAGE_URL} alt="고양이카페 DAZE" loading="lazy" />
        </PromoImage>
      </PromoCard>
      <ThreadList>
        {visibleThreads.map((thread) => (
          <ThreadItem key={thread.id} href={`/messages/${thread.id}`}>
            <Avatar $kind={thread.avatar}>
              <AvatarPhoto src={CAT_IMAGE_URL} alt="" loading="lazy" />
            </Avatar>
            <ThreadContent>
              <ThreadTop>
                <ThreadName>{thread.name}</ThreadName>
                <Tag>{thread.tag}</Tag>
                <Time>{thread.time}</Time>
              </ThreadTop>
              <MessagePreview>{thread.message}</MessagePreview>
            </ThreadContent>
            {thread.unread > 0 && <UnreadBadge>{thread.unread}</UnreadBadge>}
          </ThreadItem>
        ))}
      </ThreadList>
    </Page>
  );
}
