import type { RouteLocationNormalized } from "vue-router";
import { AppLayoutsEnum } from "@/types";

export const AppLayoutToFileMap: Record<AppLayoutsEnum, string> = {
  default: "AppLayoutDefault.vue",
  auth: "AppLayoutAuth.vue",
  empty: "AppLayoutEmpty.vue",
};

export async function loadLayoutMiddleware(route: RouteLocationNormalized): Promise<void> {
  const { layout } = route.meta;
  const normalizedLayoutName = layout || AppLayoutsEnum.default;
  // console.log('Layout:', normalizedLayoutName)
  const fileName = AppLayoutToFileMap[normalizedLayoutName];
  const fileNameWithoutExtension = fileName.split(".vue")[0];

  const component = await import(`../layouts/${fileNameWithoutExtension}.vue`);
  route.meta.layoutComponent = component.default;
}
