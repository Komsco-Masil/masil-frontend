"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { theme } from "@/styles/theme";

const STORES = [
  {
    id: "1",
    name: "아빠손칼국수",
    location: "대전 유성구 덕명동",
    rating: 4.5,
    reviewCount: 38,
    tags: ["국물이 진함", "혼밥 가능", "상품권 결제"],
    giftCardVerified: true,
    publicDataSource: "한국조폐공사 지역사랑상품권 가맹점 기본정보",
    reviews: ["면이 부드럽고 국물이 자극적이지 않아요.", "점심 피크만 피하면 회전도 빠른 편입니다."],
    variant: "noodle",
    imageUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNTAyMTJfMTk4/MDAxNzM5MzM2ODYyODkw.v-P55RzFXNy9V25B8vf_ou0M8G-NJv8uiDaN8lq8tgcg.KeM9m9wCMOd6YBPd-asP5dDXAw9nTBT4G1PPHGwY42Ug.PNG/image.png?type=w800",
  },
  {
    id: "2",
    name: "서래갈매기",
    location: "대전 유성구 덕명동",
    rating: 4.3,
    reviewCount: 51,
    tags: ["저녁 모임", "단체석", "상품권 결제"],
    giftCardVerified: true,
    publicDataSource: "한국조폐공사 지역사랑상품권 가맹점 기본정보",
    reviews: ["갈매기살이 깔끔하고 직원분 응대가 빨라요.", "동네 모임 잡을 때 실패 확률이 낮은 곳."],
    variant: "grill",
    imageUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyNTA4MjJfMTY5/MDAxNzU1ODU5MDg2NjYx.WEVpy6uxw6xwkUrBM4ntHlcCrWZYXccRAvOKllNCxuIg.O6VmXy8csuJ6fuZD9zflPz63qkw4f-2xD7Xsum0EUbog.JPEG/20250822＿190023.jpg?type=w800",
  },
  {
    id: "3",
    name: "스모어사이트",
    location: "대전 유성구 덕명동",
    rating: 4.7,
    reviewCount: 24,
    tags: ["디저트", "작업하기 좋음", "상품권 결제"],
    giftCardVerified: true,
    publicDataSource: "한국조폐공사 지역사랑상품권 가맹점 기본정보",
    reviews: ["콘센트 자리가 많고 커피가 무난하게 맛있어요.", "창가 쪽 분위기가 좋아서 재방문했어요."],
    variant: "cafe",
    imageUrl:
      "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250923_56%2F1758611661698aofQY_JPEG%2FDSC00096-2.jpg",
  },
  {
    id: "4",
    name: "우리동네 세탁",
    location: "대전 유성구 궁동",
    rating: 4.2,
    reviewCount: 17,
    tags: ["빠른 수선", "친절함", "생활"],
    giftCardVerified: false,
    publicDataSource: "마실 리뷰 데이터",
    reviews: ["셔츠 맡겼는데 약속 시간보다 빨리 나왔어요.", "사장님이 얼룩 설명을 자세히 해주십니다."],
    variant: "life",
    imageUrl:
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: "5",
    name: "마실 영어교실",
    location: "대전 유성구 덕명동",
    rating: 4.6,
    reviewCount: 29,
    tags: ["초등 영어", "소수정예", "상담 친절"],
    giftCardVerified: false,
    publicDataSource: "마실 리뷰 데이터",
    reviews: ["아이 수준에 맞춰 숙제를 조절해줘서 좋아요.", "상담 때 수업 방향을 현실적으로 말해줍니다."],
    variant: "academy",
    imageUrl:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=640&q=80",
  },
] as const;

const CATEGORIES = ["전체", "식당", "카페", "생활", "학원"] as const;

type PublicDataSummary = {
  title: string;
  description: string;
  sources: Array<{
    name: string;
    provider: string;
    purpose: string;
    status: string;
  }>;
  stores: Array<{
    id: string;
    name: string;
    address: string;
    category: string;
    gift_card_verified: boolean;
    source: string;
  }>;
};

const Section = styled.section`
  margin-top: 17px;
  padding-bottom: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px 15px;
`;

const TitleBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: 0;

  .accent {
    color: ${theme.colors.coral};
  }
`;

const Subtitle = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 3px 0 0;
  font-size: 8px;
  color: #d3d3d3;
  line-height: 1.4;

  svg {
    font-size: 10px;
    flex-shrink: 0;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 7px;
  padding: 0 24px 12px;
  overflow-x: auto;
  scroll-padding-inline: 24px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PublicDataPanel = styled.section`
  display: grid;
  gap: 9px;
  margin: 0 24px 14px;
  padding: 12px 13px;
  border: 1px solid #e7f3ef;
  border-radius: 8px;
  background: #fbfefd;
`;

const PublicDataTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #17313a;
  font-size: 12px;
  font-weight: 800;

  svg {
    color: #37c9a2;
    font-size: 16px;
  }
`;

const PublicDataDesc = styled.p`
  margin: 0;
  color: #757575;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
`;

const SourceRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SourceChip = styled.span`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  background: #fff;
  color: #4f6962;
  font-size: 9px;
  font-weight: 700;
  border: 1px solid #e1eee9;
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  flex: 0 0 auto;
  height: 28px;
  padding: 0 12px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(17, 24, 39, 0.06)" : theme.colors.borderLight)};
  border-radius: 7px;
  background: ${theme.colors.white};
  color: ${({ $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
`;

const MoreLink = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin-top: 2px;
  padding: 0;
  border: none;
  background: none;
  color: ${theme.colors.textMuted};
  font-size: 11px;
  cursor: pointer;

  svg {
    font-size: 16px;
  }
`;

const ScrollTrack = styled.div`
  display: flex;
  gap: 18px;
  padding: 0 24px 4px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 24px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.button`
  flex: 0 0 193px;
  scroll-snap-align: start;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
`;

const CardImage = styled.div<{
  $variant: (typeof STORES)[number]["variant"];
  $hasImage?: boolean;
}>`
  position: relative;
  height: 193px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: ${({ $variant }) => {
    if ($variant === "grill") {
      return `
        linear-gradient(110deg, rgba(255,255,255,0.22) 0 10%, transparent 10% 100%),
        linear-gradient(180deg, rgba(255, 114, 137, 0.95) 0 33%, transparent 33%),
        linear-gradient(90deg, #2d3034 0 12%, transparent 12% 100%),
        linear-gradient(180deg, #d8d4cf 0 42%, #2d292b 42% 100%)
      `;
    }
    if ($variant === "cafe") {
      return `
        linear-gradient(110deg, rgba(255,255,255,0.22) 0 10%, transparent 10% 100%),
        linear-gradient(180deg, #a5b59c 0 32%, transparent 32%),
        linear-gradient(90deg, #1f2933 0 12%, transparent 12% 100%),
        linear-gradient(180deg, #d5c7ad 0 45%, #4a5b62 45% 100%)
      `;
    }
    if ($variant === "life") {
      return `
        linear-gradient(110deg, rgba(255,255,255,0.22) 0 10%, transparent 10% 100%),
        linear-gradient(180deg, #7aa39a 0 32%, transparent 32%),
        linear-gradient(90deg, #232b2f 0 12%, transparent 12% 100%),
        linear-gradient(180deg, #d9e4df 0 45%, #596466 45% 100%)
      `;
    }
    if ($variant === "academy") {
      return `
        linear-gradient(110deg, rgba(255,255,255,0.22) 0 10%, transparent 10% 100%),
        linear-gradient(180deg, #f2cf5c 0 32%, transparent 32%),
        linear-gradient(90deg, #27313a 0 12%, transparent 12% 100%),
        linear-gradient(180deg, #e6e1d5 0 45%, #354759 45% 100%)
      `;
    }
    return `
      linear-gradient(110deg, rgba(255,255,255,0.24) 0 10%, transparent 10% 100%),
      linear-gradient(180deg, rgba(180, 205, 190, 0.95) 0 34%, transparent 34%),
      linear-gradient(90deg, #20272b 0 12%, transparent 12% 100%),
      linear-gradient(180deg, #ccd6d0 0 42%, #2f3535 42% 100%)
    `;
  }};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 0 56%, rgba(247, 184, 84, 0.9) 56% 72%, transparent 72%),
      linear-gradient(90deg, transparent 0 12%, rgba(239, 238, 220, 0.86) 12% 38%, transparent 38% 44%, rgba(239, 238, 220, 0.84) 44% 66%, transparent 66% 100%),
      linear-gradient(90deg, transparent 0 48%, rgba(255,255,255,0.24) 48% 49%, transparent 49% 100%);
    opacity: ${({ $hasImage, $variant }) =>
      $hasImage ? 0 : $variant === "grill" ? 0.72 : 0.86};
  }

  &::after {
    content: "${({ $variant }) =>
      $variant === "grill"
        ? "서래갈매기"
        : $variant === "cafe"
          ? "COFFEE"
          : $variant === "life"
            ? "CLEAN"
            : $variant === "academy"
              ? "ENGLISH"
          : "아빠손칼국수"}";
    position: absolute;
    left: 50%;
    top: 43px;
    color: ${({ $variant }) => ($variant === "grill" ? "#ffffff" : "#496ba9")};
    font-size: ${({ $variant }) => ($variant === "cafe" ? "16px" : "17px")};
    font-weight: 900;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.55);
    white-space: nowrap;
    transform: ${({ $variant }) =>
      $variant === "grill" ? "translateX(-50%) rotate(-3deg)" : "translateX(-50%)"};
    opacity: ${({ $hasImage }) => ($hasImage ? 0 : 1)};
  }
`;

const StorePhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

const RatingBadge = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.72);
  color: ${theme.colors.white};
  font-size: 9px;
  font-weight: 600;

  svg {
    font-size: 10px;
    color: ${theme.colors.starGold};
  }
`;

const DataBadge = styled.span`
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 21px;
  padding: 0 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.92);
  color: #267761;
  font-size: 9px;
  font-weight: 800;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);

  svg {
    font-size: 12px;
  }
`;

const CardName = styled.h3`
  margin: 10px 0 4px;
  font-size: 12px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const CardLocation = styled.p`
  margin: 0;
  font-size: 8px;
  color: ${theme.colors.textMuted};
`;

const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.28);
`;

const StoreSheet = styled.section`
  width: 100%;
  max-height: 86dvh;
  overflow-y: auto;
  border-radius: 18px 18px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -8px 26px rgba(0, 0, 0, 0.14);
`;

const SheetGrabber = styled.span`
  display: block;
  width: 36px;
  height: 4px;
  margin: 9px auto 10px;
  border-radius: 999px;
  background: #dedede;
`;

const SheetPhoto = styled.div`
  position: relative;
  height: 210px;
  margin: 0 14px;
  border-radius: 10px;
  overflow: hidden;
  background: #f2f2f2;
`;

const SheetImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const SheetClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.textPrimary};
`;

const SheetBody = styled.div`
  padding: 17px 18px calc(22px + env(safe-area-inset-bottom, 0px));
`;

const SheetTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const SheetTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 21px;
  font-weight: 900;
  line-height: 1.25;
`;

const SheetRating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 800;

  svg {
    color: ${theme.colors.starGold};
    font-size: 15px;
  }
`;

const SheetLocation = styled.p`
  display: flex;
  align-items: center;
  gap: 3px;
  margin: 6px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 12px;

  svg {
    font-size: 14px;
  }
`;

const DataNotice = styled.div`
  display: grid;
  gap: 4px;
  margin: 14px 0 0;
  padding: 11px 12px;
  border-radius: 8px;
  background: #f6fbf9;
  border: 1px solid #e4f2ed;
  color: #2d6658;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45;

  span {
    color: #78918a;
    font-size: 10px;
    font-weight: 500;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 16px 0 17px;
`;

const ReviewTag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 27px;
  padding: 0 10px;
  border-radius: 999px;
  background: #f7f8f8;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 700;
`;

const ReviewList = styled.div`
  display: grid;
  gap: 8px;
`;

const ReviewItem = styled.article`
  padding: 12px 13px;
  border-radius: 9px;
  background: #fbfbfb;
  border: 1px solid #f0f0f0;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  color: ${theme.colors.textMuted};
  font-size: 10px;
`;

const ReviewText = styled.p`
  margin: 0;
  color: #303030;
  font-size: 12px;
  line-height: 1.55;
`;

const SheetActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 16px;
`;

const SheetAction = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 42px;
  border: 0;
  border-radius: 9px;
  background: ${({ $primary }) => ($primary ? "#37c9a2" : "#f3f5f5")};
  color: ${({ $primary }) => ($primary ? theme.colors.white : theme.colors.textPrimary)};
  font-size: 13px;
  font-weight: 800;

  svg {
    font-size: 17px;
  }
`;

export default function StoreSection() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const [selectedStore, setSelectedStore] = useState<(typeof STORES)[number] | null>(null);
  const [publicData, setPublicData] = useState<PublicDataSummary | null>(null);

  useEffect(() => {
    void fetch("/api/masil/stores/public-data/summary", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("public data unavailable");
        return response.json() as Promise<PublicDataSummary>;
      })
      .then(setPublicData)
      .catch(() => undefined);
  }, []);

  const visibleStores = useMemo(() => {
    if (activeCategory === "전체") return STORES;
    if (activeCategory === "식당") {
      return STORES.filter((store) => store.variant === "noodle" || store.variant === "grill");
    }
    if (activeCategory === "카페") {
      return STORES.filter((store) => store.variant === "cafe");
    }
    if (activeCategory === "생활") {
      return STORES.filter((store) => store.variant === "life");
    }

    return STORES.filter((store) => store.variant === "academy");
  }, [activeCategory]);

  return (
    <Section id="stores">
      <SectionHeader>
        <TitleBlock>
          <Title>
            <span className="accent">마실</span> 갈래유 ?
          </Title>
          <Subtitle>
            <InfoOutlinedIcon aria-hidden />
            이달의 홍보왕의 가게를 우선적으로 추천합니다
          </Subtitle>
        </TitleBlock>
        <MoreLink
          type="button"
          onClick={() => setActiveCategory("전체")}
        >
          더보기
          <ChevronRightIcon fontSize="small" aria-hidden />
        </MoreLink>
      </SectionHeader>
      <PublicDataPanel>
        <PublicDataTitle>
          <LocalOfferRoundedIcon aria-hidden />
          {publicData?.title ?? "공공데이터 기반 지역사랑상품권 가맹점"}
        </PublicDataTitle>
        <PublicDataDesc>
          {publicData?.description ??
            "국세청 사업자등록정보와 한국조폐공사 지역사랑상품권 가맹점 데이터를 함께 대조합니다."}
        </PublicDataDesc>
        <SourceRow>
          {(publicData?.sources ?? [
            { name: "사업자등록정보 진위확인", status: "인증 단계 적용" },
            { name: "지역사랑상품권 가맹점 기본정보", status: "추천 가게 표시 적용" },
          ]).map((source) => (
            <SourceChip key={source.name}>
              {source.name} · {source.status}
            </SourceChip>
          ))}
        </SourceRow>
      </PublicDataPanel>
      <CategoryTabs aria-label="추천 가게 카테고리">
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            type="button"
            $active={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryTabs>
      <ScrollTrack>
        {visibleStores.map((store) => (
          <Card key={store.id} type="button" onClick={() => setSelectedStore(store)}>
            <CardImage $variant={store.variant} $hasImage={"imageUrl" in store && Boolean(store.imageUrl)}>
              {"imageUrl" in store && store.imageUrl && (
                <StorePhoto src={store.imageUrl} alt={store.name} loading="lazy" />
              )}
              <RatingBadge>
                <StarIcon fontSize="inherit" aria-hidden />
                {store.rating}
              </RatingBadge>
              {store.giftCardVerified && (
                <DataBadge>
                  <LocalOfferRoundedIcon aria-hidden />
                  지역사랑상품권 가맹점
                </DataBadge>
              )}
            </CardImage>
            <CardName>{store.name}</CardName>
            <CardLocation>{store.location}</CardLocation>
          </Card>
        ))}
      </ScrollTrack>
      {selectedStore && (
        <SheetBackdrop role="presentation" onClick={() => setSelectedStore(null)}>
          <StoreSheet
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedStore.name} 리뷰`}
            onClick={(event) => event.stopPropagation()}
          >
            <SheetGrabber />
            <SheetPhoto>
              <SheetImage src={selectedStore.imageUrl} alt={selectedStore.name} />
              <SheetClose type="button" aria-label="닫기" onClick={() => setSelectedStore(null)}>
                <CloseRoundedIcon aria-hidden />
              </SheetClose>
            </SheetPhoto>
            <SheetBody>
              <SheetTitleRow>
                <div>
                  <SheetTitle>{selectedStore.name}</SheetTitle>
                  <SheetLocation>
                    <PlaceRoundedIcon aria-hidden />
                    {selectedStore.location}
                  </SheetLocation>
                </div>
                <SheetRating>
                  <StarIcon aria-hidden />
                  {selectedStore.rating}
                  <span>({selectedStore.reviewCount})</span>
                </SheetRating>
              </SheetTitleRow>
              {selectedStore.giftCardVerified && (
                <DataNotice>
                  지역사랑상품권 결제 가능 가맹점으로 확인됐어요.
                  <span>{selectedStore.publicDataSource}</span>
                </DataNotice>
              )}
              <TagRow>
                {selectedStore.tags.map((tag) => (
                  <ReviewTag key={tag}>{tag}</ReviewTag>
                ))}
              </TagRow>
              <ReviewList>
                {selectedStore.reviews.map((review, index) => (
                  <ReviewItem key={review}>
                    <ReviewMeta>
                      <span>동네 리뷰어 {index + 1}</span>
                      <span>최근 방문</span>
                    </ReviewMeta>
                    <ReviewText>{review}</ReviewText>
                  </ReviewItem>
                ))}
              </ReviewList>
              <SheetActions>
                <SheetAction type="button" $primary>
                  리뷰 쓰기
                </SheetAction>
                <SheetAction type="button">
                  <LocalOfferRoundedIcon aria-hidden />
                  상품권 확인
                </SheetAction>
              </SheetActions>
            </SheetBody>
          </StoreSheet>
        </SheetBackdrop>
      )}
    </Section>
  );
}
