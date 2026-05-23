import { Outlet } from "react-router";
import { Layout } from "./Layout";

export function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
