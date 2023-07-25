import { AppLayoutsEnum } from "@/helpers";

const AppLayoutToFileMap = {
  default: "AppLayoutDefault.vue",
  auth: "AppLayoutAuth.vue",
  error: "AppLayoutError.vue",
}

export async function loadLayoutMiddleware(route) {
  const layout = route.meta?.layout;
  const normalizedLayoutName = layout || AppLayoutsEnum.default;
  console.log('Layout:', normalizedLayoutName)
  const fileName = AppLayoutToFileMap[normalizedLayoutName];
  const fileNameWithoutExtension = fileName.split(".vue")[0];

  const component = await import(`../layouts/${fileNameWithoutExtension}.vue`);
  route.meta.layoutComponent = component.default;
}
