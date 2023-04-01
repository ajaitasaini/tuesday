/* eslint-disable no-useless-catch */
import { reactive } from "vue";
import { DataCache } from "./script";

export const store = reactive({
  cache: DataCache,
  ifExists(str) {
    return DataCache.ifExist(str);
  },
});
