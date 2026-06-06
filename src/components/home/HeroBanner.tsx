"use client";

import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import gsap from "gsap";
import { theme } from "@/styles/theme";

const BannerRoot = styled.section`
  position: relative;
  min-height: 243px;
  padding: 35px 15px 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 53% 36%, rgba(153, 61, 92, 0.42) 0 38%, transparent 39%),
    radial-gradient(circle at 72% 42%, rgba(22, 76, 148, 0.72) 0 28%, transparent 45%),
    linear-gradient(154deg, #7a5660 0%, #26327e 67%, #004b9a 100%);

  &::before {
    content: "";
    position: absolute;
    inset: auto -22px -6px 62px;
    height: 52px;
    background: linear-gradient(97deg, transparent 0%, rgba(85, 46, 255, 0.88) 42%, rgba(0, 168, 255, 0.5) 100%);
    filter: blur(7px);
    transform: rotate(-4deg);
  }
`;

const BannerInner = styled.div`
  position: relative;
  min-height: 184px;
`;

const CoinWrap = styled.div`
  position: absolute;
  left: -20px;
  top: 8px;
  width: 155px;
  height: 155px;

  img {
    width: 155px;
    height: 169px;
    object-fit: contain;
    filter: drop-shadow(0 14px 18px rgba(79, 27, 30, 0.24));
  }
`;

const TextBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
`;

const Headline = styled.p`
  margin: 0;
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 900;
  line-height: 1.34;
  letter-spacing: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.16);
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 41px;
  padding: 0 5px 0 17px;
  border: none;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const CtaIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #484848;
  color: ${theme.colors.white};

  svg {
    font-size: 15px;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: -8px;
`;

const Dot = styled.span<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)"};
`;

export default function HeroBanner() {
  const coinRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const coin = coinRef.current;
    const banner = bannerRef.current;
    if (!coin || !banner) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        coin,
        { y: 8, rotation: -6, scale: 0.92, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "back.out(1.6)",
        },
      );

      gsap.to(coin, {
        y: -10,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.fromTo(
        banner,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }, banner);

    return () => ctx.revert();
  }, []);

  const findStores = () => {
    document.getElementById("stores")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <BannerRoot ref={bannerRef}>
      <BannerInner>
        <CoinWrap ref={coinRef}>
          <Image
            src="/images/dollar-front-color.png"
            alt=""
            width={155}
            height={169}
            priority
            aria-hidden
          />
        </CoinWrap>
        <TextBlock>
          <Headline>
            지역사랑상품권으로 결제하고,
            <br />
            지역경제 살리고!
          </Headline>
          <ActionRow>
            <CtaButton type="button" onClick={findStores}>
              사용처 찾아보기
              <CtaIcon>
                <ArrowForwardIcon fontSize="small" />
              </CtaIcon>
            </CtaButton>
          </ActionRow>
        </TextBlock>
      </BannerInner>
      <Dots aria-hidden>
        <Dot $active />
        <Dot />
        <Dot />
      </Dots>
    </BannerRoot>
  );
}
