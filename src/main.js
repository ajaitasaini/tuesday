/* eslint-disable vue/multi-word-component-names */
import { createApp } from "vue";
import Login from "./components/LoginView.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Tree from "primevue/tree";
import Card from "primevue/card";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Chip from "primevue/chip";
import Fieldset from "primevue/fieldset";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
import Badge from "primevue/badge";

const app = createApp(Login);

// PrimeVue
app.use(PrimeVue);
app.use(ToastService);
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.component("InputText", InputText);
app.component("Tree", Tree);
app.component("Card", Card);
app.component("Toast", Toast);
app.component("Chip", Chip);
app.component("Fieldset", Fieldset);
app.component("Divider", Divider);
app.component("Tag", Tag);
app.component("Badge", Badge);

app.mount("#app");
