import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/marking-rubric", "routes/marking-rubric.tsx")
] satisfies RouteConfig;
