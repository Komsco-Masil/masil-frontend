"use client";

import styled from "@emotion/styled";
const Shell = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;
  background: #ffffff;
  overflow-x: hidden;
  padding-bottom: calc(
    72px + env(safe-area-inset-bottom, 0px)
  );
`;

const Main = styled.main`
  flex: 1;
`;

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell>
      <Main>{children}</Main>
    </Shell>
  );
}
