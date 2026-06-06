"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { theme } from "@/styles/theme";
import {
  DAZE_IMAGE_URL,
  type ApiChatMessage,
  type ApiMessageThread,
  type ChatMessage,
  type MessageThread,
  FALLBACK_THREADS,
  formatChatClock,
  mapApiThread,
  readStoredThreads,
  writeStoredThreads,
} from "./messageData";

const Page = styled.main`
  min-height: 100dvh;
  padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
  background: #f5f6f8;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.28);
`;

const BottomSheet = styled.section`
  width: 100%;
  padding: 9px 14px calc(18px + env(safe-area-inset-bottom, 0px));
  border-radius: 10px 10px 0 0;
  background: ${theme.colors.white};
`;

const SheetHandle = styled.span`
  display: block;
  width: 38px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 4px;
  background: #dddddd;
`;

const SheetTitle = styled.h2`
  margin: 0 2px 10px;
  color: ${theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
`;

const SheetAction = styled.button<{ $danger?: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: 0 4px;
  border: 0;
  border-top: 1px solid #f1f1f1;
  background: transparent;
  color: ${({ $danger }) => ($danger ? theme.colors.coralDark : theme.colors.textPrimary)};
  font-size: 14px;
  font-weight: 600;
  text-align: left;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  height: 88px;
  padding: 30px 14px 0;
  border-bottom: 1px solid #eeeeee;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 36px;
  height: 36px;
  color: ${theme.colors.black};

  svg {
    font-size: 20px;
  }
`;

const HeaderCenter = styled.div`
  min-width: 0;
  text-align: center;
`;

const Name = styled.h1`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
`;

const Status = styled.p`
  margin: 2px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 10px;
`;

const MoreButton = styled.button`
  justify-self: end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.black};

  svg {
    font-size: 24px;
  }
`;

const SummaryCard = styled.section`
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 11px;
  align-items: center;
  margin: 12px 12px 10px;
  padding: 11px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const StoreThumb = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 9px;
  overflow: hidden;
`;

const StoreThumbPhoto = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const SummaryText = styled.div`
  min-width: 0;
`;

const SummaryTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;

const SummaryMeta = styled.p`
  margin: 4px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 10px;
`;

const CouponBadge = styled.span`
  align-self: start;
  padding: 5px 8px;
  border-radius: 6px;
  background: #f6f6f6;
  color: ${theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 600;
  border: 1px solid #e8e8e8;
`;

const ChatDay = styled.div`
  display: flex;
  justify-content: center;
  margin: 18px 0 14px;
`;

const DayBadge = styled.span`
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.08);
  color: #777;
  font-size: 10px;
`;

const ChatList = styled.div`
  display: grid;
  gap: 10px;
  padding: 0 12px 96px;
`;

const MessageRow = styled.div<{ $mine?: boolean }>`
  display: flex;
  justify-content: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  align-items: flex-end;
  gap: 6px;
`;

const Bubble = styled.p<{ $mine?: boolean }>`
  max-width: min(74%, 310px);
  margin: 0;
  padding: 10px 12px;
  border-radius: ${({ $mine }) =>
    $mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px"};
  background: ${({ $mine }) => ($mine ? theme.colors.coral : theme.colors.white)};
  color: ${({ $mine }) => ($mine ? theme.colors.white : theme.colors.textPrimary)};
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  border: 1px solid ${({ $mine }) => ($mine ? "transparent" : "rgba(0, 0, 0, 0.04)")};
`;

const MessageTime = styled.span`
  color: #ababab;
  font-size: 9px;
  white-space: nowrap;
`;

const Composer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  gap: 8px;
  align-items: center;
  min-height: calc(64px + env(safe-area-inset-bottom, 0px));
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #eeeeee;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(10px);
`;

const AttachmentTray = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  z-index: 31;
  display: flex;
  gap: 8px;
  padding: 10px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  background: ${theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const AttachmentButton = styled.button`
  flex: 1;
  height: 36px;
  border: 0;
  border-radius: 7px;
  background: #f6f7f8;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;

const UtilityButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: #f1f2f4;
  color: #777;

  svg {
    font-size: 20px;
  }
`;

const MessageInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
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
  background: ${({ disabled }) => (disabled ? "#dedede" : theme.colors.coral)};
  color: ${theme.colors.white};

  svg {
    font-size: 19px;
  }
`;

function getCurrentChatTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;

  return `${period} ${displayHour}:${minutes}`;
}

function findThread(threadId: string) {
  const id = Number(threadId);
  return readStoredThreads().find((thread) => thread.id === id) ?? FALLBACK_THREADS[0];
}

function persistThread(nextThread: MessageThread) {
  const threads = readStoredThreads();
  const exists = threads.some((thread) => thread.id === nextThread.id);
  const nextThreads = exists
    ? threads.map((thread) => (thread.id === nextThread.id ? nextThread : thread))
    : [nextThread, ...threads];

  writeStoredThreads(nextThreads);
}

export default function MessageDetailPage({ threadId }: { threadId: string }) {
  const localMessageId = useRef(-1);
  const [thread, setThread] = useState<MessageThread>(() => FALLBACK_THREADS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const canSend = draft.trim().length > 0;
  const quickAttachments = useMemo(() => ["사진", "쿠폰", "위치"], []);

  const createLocalMessageId = () => {
    localMessageId.current -= 1;
    return localMessageId.current;
  };

  useEffect(() => {
    queueMicrotask(() => {
      const nextThread = findThread(threadId);
      setThread(nextThread);
      setMessages(nextThread.messages);
      setMuted(Boolean(nextThread.muted));
      setBlocked(Boolean(nextThread.blocked));
    });

    const token = window.localStorage.getItem("masil.accessToken");
    if (!token) return;

    void fetch(`/api/masil/messages/threads/${threadId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("message api unavailable");
        return response.json() as Promise<ApiMessageThread>;
      })
      .then((apiThread) => {
        const nextThread = mapApiThread(apiThread);
        setThread(nextThread);
        setMessages(nextThread.messages);
        setMuted(Boolean(nextThread.muted));
        setBlocked(Boolean(nextThread.blocked));
        persistThread(nextThread);
      })
      .catch(() => undefined);
  }, [threadId]);

  const appendMessage = (message: ChatMessage) => {
    const nextMessages = [...messages, message];
    const nextThread = {
      ...thread,
      message: message.text,
      time: "방금",
      unread: 0,
      messages: nextMessages,
    };

    setMessages(nextMessages);
    setThread(nextThread);
    persistThread(nextThread);
  };

  const patchThread = (patch: Partial<MessageThread>) => {
    const nextThread = { ...thread, ...patch };
    setThread(nextThread);
    persistThread(nextThread);

    const token = window.localStorage.getItem("masil.accessToken");
    if (!token) return;

    void fetch(`/api/masil/messages/threads/${thread.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        muted: patch.muted,
        blocked: patch.blocked,
        unread_count: patch.unread,
      }),
    }).catch(() => undefined);
  };

  const submitMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();

    if (!text) return;

    if (blocked) return;

    const optimisticMessage = {
      id: createLocalMessageId(),
      from: "me" as const,
      text,
      time: getCurrentChatTime(),
    };
    appendMessage(optimisticMessage);

    const token = window.localStorage.getItem("masil.accessToken");
    if (token) {
      void fetch(`/api/masil/messages/threads/${thread.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("message send failed");
          return response.json() as Promise<ApiChatMessage>;
        })
        .then((apiMessage) => {
          const savedMessage = {
            id: apiMessage.id,
            from: apiMessage.sender,
            text: apiMessage.text,
            time: formatChatClock(apiMessage.created_at),
          };
          setMessages((current) =>
            current.map((message) =>
              message.id === optimisticMessage.id ? savedMessage : message,
            ),
          );
        })
        .catch(() => undefined);
    }

    setDraft("");
    setAttachmentOpen(false);
  };

  const sendAttachment = (label: string) => {
    if (blocked) return;

    appendMessage({
      id: createLocalMessageId(),
      from: "me",
      text: `${label}을 보냈습니다.`,
      time: getCurrentChatTime(),
    });
    setAttachmentOpen(false);
  };

  return (
    <Page>
      <Header>
        <BackLink href="/messages" aria-label="뒤로가기">
          <ArrowBackIosNewRoundedIcon aria-hidden />
        </BackLink>
        <HeaderCenter>
          <Name>{thread.name}</Name>
          <Status>보통 10분 안에 응답해요</Status>
        </HeaderCenter>
        <MoreButton type="button" aria-label="더보기" onClick={() => setMenuOpen(true)}>
          <MoreHorizRoundedIcon aria-hidden />
        </MoreButton>
      </Header>
      <SummaryCard>
        <StoreThumb>
          <StoreThumbPhoto src={thread.storeImageUrl ?? DAZE_IMAGE_URL} alt={thread.storeName} loading="lazy" />
        </StoreThumb>
        <SummaryText>
          <SummaryTitle>{thread.storeName}</SummaryTitle>
          <SummaryMeta>{thread.storeAddress}</SummaryMeta>
        </SummaryText>
        <CouponBadge>쿠폰</CouponBadge>
      </SummaryCard>
      <ChatDay>
        <DayBadge>오늘</DayBadge>
      </ChatDay>
      <ChatList>
        {messages.map((message) => {
          const mine = message.from === "me";

          return (
            <MessageRow key={message.id} $mine={mine}>
              {mine && <MessageTime>{message.time}</MessageTime>}
              <Bubble $mine={mine}>{message.text}</Bubble>
              {!mine && <MessageTime>{message.time}</MessageTime>}
            </MessageRow>
          );
        })}
      </ChatList>
      {attachmentOpen && (
        <AttachmentTray aria-label="첨부 메뉴">
          {quickAttachments.map((label) => (
            <AttachmentButton
              key={label}
              type="button"
              onClick={() => sendAttachment(label)}
            >
              {label}
            </AttachmentButton>
          ))}
        </AttachmentTray>
      )}
      <Composer as="form" onSubmit={submitMessage}>
        <UtilityButton
          type="button"
          aria-label="첨부"
          aria-pressed={attachmentOpen}
          onClick={() => setAttachmentOpen((open) => !open)}
        >
          <AddRoundedIcon aria-hidden />
        </UtilityButton>
        <MessageInput
          placeholder="메시지를 입력하세요"
          aria-label="메시지 입력"
          disabled={blocked}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <SendButton type="submit" aria-label="전송" disabled={!canSend}>
          <SendRoundedIcon aria-hidden />
        </SendButton>
      </Composer>
      {menuOpen && (
        <ModalBackdrop role="presentation" onClick={() => setMenuOpen(false)}>
          <BottomSheet
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-menu-title"
            onClick={(event) => event.stopPropagation()}
          >
            <SheetHandle aria-hidden />
            <SheetTitle id="message-menu-title">대화 설정</SheetTitle>
            <SheetAction
              type="button"
              onClick={() => {
                const nextMuted = !muted;
                setMuted(nextMuted);
                patchThread({ muted: nextMuted });
                setMenuOpen(false);
              }}
            >
              {muted ? "알림 다시 켜기" : "이 대화 알림 끄기"}
            </SheetAction>
            <SheetAction
              type="button"
              onClick={() => {
                appendMessage({
                  id: createLocalMessageId(),
                  from: "me",
                  text: "쿠폰 사용 가능 시간을 다시 안내해주세요.",
                  time: getCurrentChatTime(),
                });
                setMenuOpen(false);
              }}
            >
              빠른 문의 보내기
            </SheetAction>
            <SheetAction
              type="button"
              $danger
              onClick={() => {
                setBlocked(true);
                patchThread({ blocked: true });
                setMenuOpen(false);
              }}
            >
              대화 상대 차단
            </SheetAction>
          </BottomSheet>
        </ModalBackdrop>
      )}
    </Page>
  );
}
