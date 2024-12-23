import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div style={{ overflowY: "hidden" }}>
      <Outlet></Outlet>
    </div>
  );
}
