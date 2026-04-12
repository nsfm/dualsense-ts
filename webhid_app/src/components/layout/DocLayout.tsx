import React from "react";
import styled from "styled-components";
import { Outlet, useRouteError, isRouteErrorResponse, Link, useLocation } from "react-router";
import { Dualsense } from "dualsense-ts";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ControllerContext, manager, hasWebHID } from "../../controller";
import { useManagerState } from "../../hooks/useManagerState";

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ContentInner = styled.div`
  max-width: 900px;
`;

const ErrorPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  gap: 16px;
  padding: 32px;
  text-align: center;
`;

const ErrorCode = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 13px;
  max-width: 600px;
  overflow-x: auto;
  color: rgba(255, 255, 255, 0.6);
`;

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPage>
        <h1>{error.status === 404 ? "Page Not Found" : `Error ${error.status}`}</h1>
        <p style={{ opacity: 0.6, maxWidth: 480 }}>
          {error.status === 404
            ? "This page doesn't exist. It may have been moved or removed."
            : error.statusText}
        </p>
        <Link to="/" style={{ color: "#48aff0" }}>
          Back to home
        </Link>
      </ErrorPage>
    );
  }

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <ErrorPage>
      <h1>Something went wrong</h1>
      <p style={{ opacity: 0.6, maxWidth: 480 }}>
        An error occurred while rendering this page.
      </p>
      <ErrorCode>{message}</ErrorCode>
      <Link to="/" style={{ color: "#48aff0" }}>
        Back to home
      </Link>
    </ErrorPage>
  );
};

export const DocLayout: React.FC = () => {
  const { controllers } = useManagerState();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const selected: Dualsense | undefined = controllers[selectedIndex];

  React.useEffect(() => {
    if (!selected && controllers.length > 0) {
      setSelectedIndex(0);
    }
  }, [controllers.length, selected]);

  const controller = selected ?? new Dualsense({ hid: null });

  return (
    <ControllerContext.Provider key={selectedIndex} value={controller}>
      <Shell>
        <TopBar
          controllers={controllers}
          selectedIndex={selectedIndex}
          onSelectController={setSelectedIndex}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <Body>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Content>
            <ContentInner>
              <Outlet />
            </ContentInner>
          </Content>
        </Body>
      </Shell>
    </ControllerContext.Provider>
  );
};
