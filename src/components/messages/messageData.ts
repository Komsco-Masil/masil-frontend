export const MESSAGE_THREADS_STORAGE_KEY = "masil.message.threads";

export type ApiChatMessage = {
  id: number;
  thread_id: number;
  sender: "me" | "other";
  text: string;
  kind: string;
  created_at: string;
};

export type ApiMessageThread = {
  id: number;
  counterpart_name: string;
  store_name?: string | null;
  store_address?: string | null;
  store_image_url?: string | null;
  tag?: string | null;
  last_message: string;
  unread_count: number;
  muted: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
  messages?: Array<ApiChatMessage>;
};

export type ChatMessage = {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
};

export type MessageThread = {
  id: number;
  name: string;
  tag: string;
  time: string;
  message: string;
  unread: number;
  avatar: "cat" | "mascot";
  storeName: string;
  storeAddress: string;
  storeImageUrl?: string;
  muted?: boolean;
  blocked?: boolean;
  messages: Array<ChatMessage>;
};

export const CAT_IMAGE_URL =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=240&q=80";
export const DAZE_IMAGE_URL =
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=420&q=80";

export const FALLBACK_THREADS: Array<MessageThread> = [
  {
    id: 1,
    name: "데이즈",
    tag: "홍보왕",
    time: "5시간 전",
    message: "광고봤는데 진짜 쿠폰더 있나요? 라떼요 여쭤요.",
    unread: 0,
    avatar: "cat",
    storeName: "고양이카페 DAZE",
    storeAddress: "대전 유성구 · 마실 쿠폰 문의",
    storeImageUrl: DAZE_IMAGE_URL,
    messages: [
      { id: 1, from: "other", text: "안녕하세요. 고양이 카페 쿠폰 보고 연락드렸어요.", time: "오후 2:11" },
      { id: 2, from: "me", text: "네 안녕하세요. 오늘 방문하셔도 사용 가능합니다.", time: "오후 2:12" },
      { id: 3, from: "other", text: "라떼 메뉴도 쿠폰 적용되나요?", time: "오후 2:12" },
      { id: 4, from: "me", text: "가능해요. 마실 보고 왔다고 말씀해주시면 안내드릴게요.", time: "오후 2:13" },
    ],
  },
  {
    id: 2,
    name: "주먹펴고일어서",
    tag: "홍보왕",
    time: "7시간 전",
    message: "이 편지는 영국에서부터 시작되어...",
    unread: 1,
    avatar: "mascot",
    storeName: "주먹펴고일어서",
    storeAddress: "대전 · 서래갈매기",
    messages: [],
  },
];

export function formatMessageTime(dateText: string) {
  const created = new Date(dateText).getTime();
  if (Number.isNaN(created)) return "방금";

  const minutes = Math.max(0, Math.floor((Date.now() - created) / 60000));
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  return `${Math.floor(hours / 24)}일 전`;
}

export function formatChatClock(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "방금";

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;

  return `${period} ${displayHour}:${minutes}`;
}

export function mapApiThread(thread: ApiMessageThread): MessageThread {
  return {
    id: thread.id,
    name: thread.counterpart_name,
    tag: thread.tag ?? "동네톡",
    time: formatMessageTime(thread.updated_at),
    message: thread.last_message || "아직 메시지가 없어요.",
    unread: thread.unread_count,
    avatar: thread.store_image_url ? "cat" : "mascot",
    storeName: thread.store_name ?? thread.counterpart_name,
    storeAddress: thread.store_address ?? "대전 · 마실",
    storeImageUrl: thread.store_image_url ?? undefined,
    muted: thread.muted,
    blocked: thread.blocked,
    messages:
      thread.messages?.map((message) => ({
        id: message.id,
        from: message.sender,
        text: message.text,
        time: formatChatClock(message.created_at),
      })) ?? [],
  };
}

export function readStoredThreads() {
  if (typeof window === "undefined") return FALLBACK_THREADS;

  try {
    const stored = window.localStorage.getItem(MESSAGE_THREADS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Array<MessageThread>) : FALLBACK_THREADS;
  } catch {
    return FALLBACK_THREADS;
  }
}

export function writeStoredThreads(threads: Array<MessageThread>) {
  window.localStorage.setItem(MESSAGE_THREADS_STORAGE_KEY, JSON.stringify(threads));
}
