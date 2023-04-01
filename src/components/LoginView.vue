<template>
  <main class="grid bg-blue-50">
    <div class="col">
      <div class="card">
        <Card class="mt-5 ml-5 mb-5 mr-2">
          <template #title> Login </template>
          <template #content>
            <h3 class="mb-5">Enter login credentials</h3>
            <!-- onSubmit() is called when the SUBMIT button is pressed -->
            <form ref="loginForm" v-on:submit.prevent="onSubmit">
              <span class="p-float-label flex flex-inline">
                <InputText
                  type="text"
                  v-model.lazy="value"
                  :class="{ 'p-invalid': errorMessage }"
                  id="value"
                />
                <label for="employeeId">Enter employee ID</label>
                <Button
                  id="submit-login"
                  class="ml-3"
                  aria-label="Submit Login ID"
                  type="submit"
                  >SUBMIT</Button
                >

                <!-- Logged in tag persists on screen -->
                <Tag
                  class="mx-3"
                  severity="success"
                  icon="pi pi-check"
                  aria-label="successful login"
                  v-show="submitSuccess"
                  rounded
                >
                  Logged in
                </Tag>
              </span>

              <!-- Error message about login -- invalid or empty -->
              <small class="p-error" id="text-error">{{
                errorMessage || "&nbsp;"
              }}</small>
            </form>
          </template>
        </Card>
        <Toast />
      </div>
      <!-- Invalid login triggers disabling all input forms -->
      <MemberDirectoryView :disable="shouldDisable" />
      <TaskDirectoryView :disable="shouldDisable" />
      <TaskLinkView :disable="shouldDisable" />
    </div>

    <div class="col">
      <RoadmapView />
    </div>
  </main>
</template>

<script>
import { store } from "./jsfiles/store.js";
import MemberDirectoryView from "./MemberDirectoryView.vue";
import TaskDirectoryView from "./TaskDirectoryView.vue";
import TaskLinkView from "./TaskLinkView.vue";
import RoadmapView from "./RoadmapView.vue";

export default {
  name: "LoginView",
  components: {
    MemberDirectoryView,
    TaskDirectoryView,
    TaskLinkView,
    RoadmapView,
  },
  data() {
    return {
      value: "",
      errorMessage: "",
      store,
      submitSuccess: false,
      shouldDisable: 0,
    };
  },
  methods: {
    onSubmit() {
      console.log(`beginning authentication for user-id ${this.value}`);
      if (!store.ifExists(this.value)) {
        console.log("value doesn't exist");
        this.errorMessage = "Employee ID is required.";
        this.submitSuccess = false;
        this.shouldDisable = 1;
        this.$refs.loginForm.reset();
      } else if (store.cache.AuthenticateMember(this.value)) {
        this.$toast.add({
          severity: "success",
          summary: "Login succeeded",
          detail: "Welcome back :)",
          life: 3000,
        });
        this.submitSuccess = true;
        this.shouldDisable = 0;

        //this.$refs.loginForm.reset();
        this.errorMessage = "";
      } else {
        this.errorMessage = "User id is invalid.";
        this.submitSuccess = false;
        this.shouldDisable = 1;
        this.$refs.loginForm.reset();
      }
    },
  },
};
</script>
