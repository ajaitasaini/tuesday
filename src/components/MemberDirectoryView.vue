<template>
  <div class="card">
    <Card class="mt-5 ml-5 mb-5 mr-2">
      <template #title> Team Member Directory </template>
      <template #content>
        <form ref="loginForm">
          <h3>Choose existing member</h3>
          <div class="formgroup-inline">
            <div class="dropdown formgroup-inline">
              <Dropdown
                v-model="selectedMember"
                v-on:change="memberSelected()"
                v-on:before-show="memberDropdownBeforeShow()"
                :options="allMembersArray"
                :disabled="disable == 1"
                aria-label="Existing members"
                placeholder="Select a Member"
                class="mx-2"
                :class="{ 'p-invalid': errorMessage }"
              />
            </div>
          </div>
          <small class="p-error mx-2" id="text-error">{{
            errorMessage || "&nbsp;"
          }}</small>

          <h3 class="mb-5">Update Team Members</h3>
          <div class="grid">
            <div class="col">
              <span class="p-float-label">
                <InputText
                  type="text"
                  v-model.lazy="newMemberId"
                  :disabled="disable == 1"
                  class="mx-2"
                  id="employeeId"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <label for="employeeId"> Employee ID</label>
              </span>
              <small class="p-error mx-2" id="text-error">{{
                errorMessage || "&nbsp;"
              }}</small>
            </div>
            <div class="col">
              <span class="p-float-label">
                <InputText
                  type="text"
                  v-model.lazy="newMemberName"
                  :disabled="disable == 1"
                  class="mx-2"
                  id="name"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <label for="name">Full Name</label>
              </span>
              <small class="p-error mx-2" id="text-error">{{
                errorMessage || "&nbsp;"
              }}</small>
            </div>
            <div class="col">
              <span class="p-float-label">
                <Dropdown
                  id="ddRole"
                  v-model.lazy="selectedRole"
                  v-on:change="roleSelected()"
                  :options="allRolesArray"
                  :disabled="disable == 1"
                  aria-label="Select Role"
                  placeholder="Select a Role"
                  class="mx-2"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <label for="employeeRole">Employee Role</label>
              </span>
              <small class="p-error mx-2" id="text-error">{{
                errorMessage || "&nbsp;"
              }}</small>
            </div>
          </div>

          <h3 class="mt-3">Actions</h3>
          <div class="formgroup-inline">
            <Button
              id="btnClearMemberFields"
              type="button"
              v-on:click.prevent="clearFields()"
              :disabled="disable == 1"
              aria-label="Clear fields"
              class="mx-2"
              >Clear</Button
            >
            <Button
              id="btnAddMember"
              type="button"
              v-on:click.prevent="addMember()"
              :disabled="disable == 1"
              aria-label="Add Team member"
              class="mx-2"
              >Add</Button
            >
            <Button
              id="btnDeleteMember"
              type="button"
              v-on:click.prevent="deleteMember()"
              :disabled="disable == 1"
              aria-label="Delete Team member"
              class="mx-2"
              >Delete</Button
            >
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { store } from "./jsfiles/store.js";

export default {
  name: "MemberDirectoryView",
  props: ["disable"],
  data() {
    return {
      newMemberId: "",
      newMemberName: "",
      selectedRole: "",
      errorMessage: "",
      allRolesArray: store.cache.Roles,
      store,
      selectedMember: null,
      allMembersArray: store.cache.GetAllMembers(),
    };
  },
  methods: {
    roleSelected() {},
    memberDropdownBeforeShow() {
      this.allMembersArray = store.cache.GetAllMembers();
    },
    memberSelected() {
      console.log("begin member selected - " + this.selectedMember);
      const myArray = this.selectedMember.split(":");
      if (myArray.length == 3) {
        this.newMemberId = myArray[0].trim();
        this.newMemberName = myArray[1].trim();
        this.selectedRole = myArray[2].trim();
      }
      console.log("Success.");
    },
    clearFields() {
      console.log("begin clearing fields");
      this.newMemberId = "";
      this.newMemberName = "";
      this.selectedRole = "";
      this.errorMessage = "";
      this.selectedMember = null;
      console.log("Success.");
    },
    addMember() {
      console.log(
        "begin adding new member - " +
          this.newMemberId +
          "-" +
          this.newMemberName +
          "-" +
          this.selectedRole
      );
      if (
        store.ifExists(this.newMemberId) &&
        store.ifExists(this.newMemberName) &&
        store.ifExists(this.selectedRole)
      ) {
        if (!store.cache.IsMember(this.newMemberId)) {
          store.cache.AddMember(
            this.newMemberId,
            this.newMemberName,
            this.selectedRole
          );
          this.$toast.add({
            severity: "success",
            summary: `${this.newMemberName} added`,
            life: 3000,
          });
          this.$refs.loginForm.reset();
          console.log("Success.");
          this.clearFields();
        } else {
          this.errorMessage = "Member id already exists.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
    deleteMember() {
      console.log("begin deleting existing member - " + this.newMemberId);
      if (store.ifExists(this.newMemberId)) {
        if (store.cache.IsMember(this.newMemberId)) {
          store.cache.RemoveMember(this.newMemberId);
          this.$toast.add({
            severity: "success",
            summary: `${this.newMemberName} deleted`,
            life: 3000,
          });
          this.$refs.loginForm.reset();
          console.log("Success.");
          this.clearFields();
        } else {
          this.errorMessage = "Member id does not exists.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
  },
};
</script>
