export const USER_ROLE_STORAGE_KEY = "masil.currentUserRole";
export const COMMUNITY_POSTS_STORAGE_KEY = "masil.community.posts";
export const COMMUNITY_COMMENTS_STORAGE_KEY = "masil.community.comments";
export const COMMUNITY_LIKED_POSTS_STORAGE_KEY = "masil.community.likedPostIds";

export type UserRole = "guest" | "owner" | "staff";
export type BoardValue = "hot" | "local" | "promo" | "owner" | "meet";
export type PromoCategory = "세일" | "신메뉴" | "이벤트" | "매장 소식";
export type MeetingStatus = "모집중" | "모집 마감" | "모임 완료";

export type CommunityPost = {
  id: number;
  avatar: "blue" | "mono" | "line";
  board: Exclude<BoardValue, "hot">;
  name: string;
  anonymous?: boolean;
  time: string;
  createdAt: string;
  location: string;
  badge?: string;
  title: string;
  body: string;
  ps: string;
  likes: number;
  comments: number;
  views: number;
  promoCategory?: PromoCategory;
  giftCertificate?: boolean;
  meetingAt?: string;
  meetingPlace?: string;
  meetingMaxPeople?: number;
  meetingApplicants?: number;
  meetingStatus?: MeetingStatus;
  reports?: number;
  blinded?: boolean;
};

export type ApiCommunityPost = {
  id: number;
  board: Exclude<BoardValue, "hot">;
  title: string;
  body: string;
  ps?: string;
  anonymous?: boolean;
  author_name: string;
  location: string;
  badge?: string | null;
  avatar?: "blue" | "mono" | "line";
  likes: number;
  views: number;
  comments_count: number;
  promo_category?: PromoCategory | null;
  gift_certificate?: boolean;
  meeting_at?: string | null;
  meeting_place?: string | null;
  meeting_max_people?: number | null;
  meeting_applicants?: number | null;
  meeting_status?: MeetingStatus | null;
  reports?: number;
  blinded?: boolean;
  created_at: string;
};

export const BOARDS: Array<{
  label: string;
  value: BoardValue;
  lockedFor?: Array<UserRole>;
}> = [
  { label: "핫게", value: "hot" },
  { label: "동네 게시판", value: "local" },
  { label: "가게 홍보게시판", value: "promo" },
  { label: "소상공인 익명 게시판", value: "owner", lockedFor: ["guest"] },
  { label: "유저모임 게시판", value: "meet" },
];

export const PROMO_CATEGORIES: Array<PromoCategory> = [
  "세일",
  "신메뉴",
  "이벤트",
  "매장 소식",
];

export const SEED_POSTS: Array<CommunityPost> = [
  {
    id: 1,
    avatar: "blue",
    board: "promo",
    name: "주먹펴고일어서",
    time: "7시간 전",
    createdAt: "2026-06-05T05:40:00.000Z",
    location: "대전 · 서래갈매기",
    badge: "이달의 홍보왕",
    title: "지역사랑상품권 결제 가능 매장입니다",
    body: "오늘 저녁 방문하시는 분들은 지역사랑상품권으로 결제 가능해요. 단체석도 조금 남아 있습니다.",
    ps: "마실 보고 왔다고 말씀하시면 음료 하나 챙겨드릴게요.",
    likes: 18,
    comments: 9,
    views: 320,
    promoCategory: "이벤트",
    giftCertificate: true,
  },
  {
    id: 2,
    avatar: "mono",
    board: "meet",
    name: "데이즈",
    time: "1시간 전",
    createdAt: "2026-06-05T11:45:00.000Z",
    location: "대전 · 유저모임",
    badge: "모집중",
    title: "상품권 되는 카페 같이 가실 분",
    body: "궁동 쪽 카페에서 각자 할 일 하면서 2시간 정도 같이 있을 분 구해요.",
    ps: "처음 오시는 분도 편하게 오셔도 됩니다.",
    likes: 7,
    comments: 5,
    views: 132,
    meetingAt: "오늘 오후 7:30",
    meetingPlace: "고양이카페 DAZE",
    meetingMaxPeople: 4,
    meetingApplicants: 2,
    meetingStatus: "모집중",
    giftCertificate: true,
  },
  {
    id: 3,
    avatar: "line",
    board: "owner",
    name: "익명 사장님",
    time: "12분 전",
    createdAt: "2026-06-05T12:45:00.000Z",
    location: "대전 · 소상공인 익명",
    title: "배달앱 수수료 때문에 고민입니다",
    body: "매출은 비슷한데 남는 게 줄어서 답답합니다. 다른 사장님들은 배달앱 비중 어떻게 조정하고 계세요?",
    ps: "지원금이나 정책 정보 아시는 분 있으면 공유 부탁드려요.",
    likes: 21,
    comments: 14,
    views: 420,
  },
];

export function getBoardLabel(board: BoardValue) {
  return BOARDS.find((item) => item.value === board)?.label ?? "커뮤니티";
}

export function canAccessBoard(board: BoardValue, role: UserRole) {
  const policy = BOARDS.find((item) => item.value === board);
  return !policy?.lockedFor?.includes(role);
}

export function getHotScore(post: CommunityPost) {
  return post.views * 0.2 + post.comments * 0.3 + post.likes * 0.5;
}

export function isRecentSevenDays(post: CommunityPost) {
  const createdAt = new Date(post.createdAt).getTime();
  if (Number.isNaN(createdAt)) return true;

  return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
}

export function formatPostTime(createdAt: string) {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return "방금";

  const minutes = Math.max(0, Math.floor((Date.now() - created) / 60000));
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  return `${Math.floor(hours / 24)}일 전`;
}

export function mapApiPost(post: ApiCommunityPost): CommunityPost {
  return {
    id: post.id,
    avatar: post.avatar ?? "mono",
    board: post.board,
    name: post.author_name,
    anonymous: post.anonymous,
    time: formatPostTime(post.created_at),
    createdAt: post.created_at,
    location: post.location,
    badge: post.badge ?? undefined,
    title: post.title,
    body: post.body,
    ps: post.ps ?? "",
    likes: post.likes,
    comments: post.comments_count,
    views: post.views,
    promoCategory: post.promo_category ?? undefined,
    giftCertificate: post.gift_certificate,
    meetingAt: post.meeting_at ?? undefined,
    meetingPlace: post.meeting_place ?? undefined,
    meetingMaxPeople: post.meeting_max_people ?? undefined,
    meetingApplicants: post.meeting_applicants ?? undefined,
    meetingStatus: post.meeting_status ?? undefined,
    reports: post.reports,
    blinded: post.blinded,
  };
}

export function readUserRole() {
  if (typeof window === "undefined") return "guest" satisfies UserRole;
  const stored = window.localStorage.getItem(USER_ROLE_STORAGE_KEY);

  if (stored === "owner" || stored === "staff") return stored;
  return "guest";
}
