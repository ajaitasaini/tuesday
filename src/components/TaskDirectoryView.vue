<template>
  <div class="card">
    <Card class="mt-5 ml-5 mb-5 mr-2">
      <template #title> Project Task Directory </template>
      <template #content>
        <h3>Choose existing task</h3>
        <form class="formgroup-inline">
          <Dropdown
            v-model="selectedTask"
            v-on:change="taskSelected()"
            v-on:before-show="taskDropdownBeforeShow()"
            :options="allTasksArray"
            :disabled="disable == 1"
            placeholder="Select a Task"
            class="w-full md:w-14rem"
          />
        </form>
        <small class="p-error" id="text-error">{{
          errorMessage[0] || "&nbsp;"
        }}</small>

        <!-- Displaying task owner -->
        <Tag
          class="mt-3"
          severity="info"
          icon="pi pi-info-circle"
          v-if="selectedTaskOwner"
        >
          Task owner: {{ selectedTaskOwner }}
        </Tag>

        <h3 class="mb-5">Update Tasks</h3>
        <div class="formgroup-inline">
          <Dropdown
            v-model="selectedTaskType"
            class="mx-2"
            id="ddTaskType"
            :options="allTaskTypesArray"
            :disabled="disable == 1"
            placeholder="Task Type"
          />
        </div>
        <small class="p-error mx-2" id="text-error">{{
          errorMessage[1] || "&nbsp;"
        }}</small>
        <div class="grid mt-3">
          <div class="col">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model.lazy="newTaskId"
                :disabled="disable == 1"
                class="mx-2"
                id="taskId"
              />
              <label for="taskId">Task ID</label>
            </span>
            <small class="p-error mx-2" id="text-error">{{
              errorMessage[2] || "&nbsp;"
            }}</small>
          </div>

          <div class="col">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model.lazy="newTaskName"
                :disabled="disable == 1"
                class="mx-2"
                id="taskName"
              />
              <label for="taskName">Task Name</label>
            </span>
            <small class="p-error mx-2" id="text-error">{{
              errorMessage[3] || "&nbsp;"
            }}</small>
          </div>

          <div class="col">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model.lazy="newTaskDescr"
                :disabled="disable == 1"
                class="mx-2"
                id="taskDescr"
                placeholder="Task Description"
              />
              <label for="taskDescr">Task Description </label>
            </span>
            <small class="p-error mx-2" id="text-error">{{
              errorMessage[4] || "&nbsp;"
            }}</small>
          </div>
        </div>

        <!-- Basic Task Actions -->
        <h3>Actions</h3>
        <div class="form-inline">
          <Button
            id="btnClearTaskFields"
            class="mx-2"
            type="button"
            v-on:click="clearTaskFields()"
            :disabled="disable == 1"
            >Clear</Button
          >
          <Button
            id="btnAddTask"
            class="mx-2"
            type="button"
            v-on:click="addTask()"
            :disabled="disable == 1"
            >Add</Button
          >
          <Button
            id="btnDeleteTask"
            class="mx-2"
            type="button"
            v-on:click="deleteTask()"
            :disabled="disable == 1"
            >Delete</Button
          >
          <Button
            id="btnEndorseTask"
            class="mx-2"
            type="button"
            v-on:click="endorseTask()"
            :disabled="disable == 1"
            >Endorse</Button
          >
          <Button
            id="btnApproveTask"
            class="mx-2 mt-2"
            type="button"
            v-on:click="approveTask()"
            :disabled="disable == 1"
            >Approve</Button
          >
        </div>

        <!-- Advanced task actions -->
        <h3>Change Status</h3>
        <div class="form-group mx-sm-3 mb-2">
          <Dropdown
            v-model="selectedStatus"
            :options="allStatusArray"
            :disabled="disable == 1"
            placeholder="Select Status"
            class="w-full md:w-14rem"
          />
        </div>
        <form class="form-inline">
          <Button
            id="btnUpdateStatus"
            type="button"
            v-on:click="updateStatus()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-3"
            >Update Status</Button
          >
        </form>

        <h3>Add / Update Required Roles</h3>
        <div class="form-group mx-sm-3 mb-2">
          <Dropdown
            v-model="selectedRole"
            :options="allRolesArray"
            :disabled="disable == 1"
            placeholder="Select a Required Role"
            class="w-full md:w-14rem"
          />
        </div>
        <form class="form-inline">
          <Button
            id="btnAddRequiredRole"
            type="button"
            v-on:click="addRequiredRole()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-3"
            >Add Required Role</Button
          >
          <Button
            id="btnRemoveRequiredRole"
            type="button"
            v-on:click="removeRequiredRole()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-3"
            >Remove Required Role</Button
          >
        </form>

        <h3>Add / Update Approvers</h3>
        <div class="form-group mx-sm-3 mb-2">
          <Dropdown
            v-model="selectedApprover"
            v-on:before-show="memberDropdownBeforeShow()"
            :options="allMembersArray"
            placeholder="Select an Approver"
            :disabled="disable == 1"
            class="w-full md:w-14rem"
          />
        </div>
        <form class="form-inline">
          <Button
            id="btnRequestApprovers"
            type="button"
            v-on:click="requestTaskApprovers()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-3"
            >Request Approver</Button
          >
          <Button
            id="btnRemoveApprovers"
            type="button"
            v-on:click="removeTaskApprovers()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-3"
            >Remove Approver</Button
          >
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { store } from "./jsfiles/store.js";

export default {
  name: "TaskDirectoryView",
  props: ["disable"],
  data() {
    return {
      selectedTaskType: "",
      newTaskId: "",
      newTaskName: "",
      newTaskDescr: "",
      errorMessage: ["", "", "", "", ""],
      // newTaskApprovers: "",
      store,
      disablebuttons: !store.loggedIn,
      allTaskTypesArray: store.cache.TaskTypes,
      selectedTask: null,
      selectedTaskOwner: null,
      allTasksArray: store.cache.GetAllTasks(),
      allMembersArray: store.cache.GetAllMembers(),
      selectedApprover: null,
      selectedRole: null,
      allRolesArray: store.cache.Roles,
      allStatusArray: store.cache.TaskStatusNames,
      selectedStatus: null,
    };
  },
  methods: {
    memberDropdownBeforeShow() {
      this.allMembersArray = store.cache.GetAllMembers();
    },
    taskDropdownBeforeShow() {
      this.allTasksArray = store.cache.GetAllTasks();
    },
    taskSelected() {
      console.log("begin task selected - " + this.selectedTask);
      const myArray = this.selectedTask.split(":");
      if (myArray.length == 3) {
        this.selectedTaskType = myArray[0].trim();
        this.newTaskId = myArray[1].trim();
        this.newTaskName = myArray[2].trim();
        let task = this.store.cache.GetTask(this.newTaskId);
        if (task != null) {
          this.newTaskDescr = task.Desc;
          this.selectedStatus = task.Status;
          this.selectedTaskOwner = task.Creator.Name;
          console.log(
            `Task Creator: ${task.Creator.Id} -- ${task.Creator.Name}`
          );
          console.log(`Task Status: ${this.selectedStatus}`);
        }
      }
      console.log("Success.");
    },
    clearTaskFields() {
      console.log("begin clearing fields");
      this.selectedTaskType = "";
      this.newTaskId = "";
      this.newTaskName = "";
      this.newTaskDescr = "";
      this.errorMessage = ["", "", "", "", ""];
      //this.newTaskApprovers = "";
      this.selectedTask = null;
      this.selectedApprover = null;
      this.selectedRole = null;
      this.selectedStatus = null;
      console.log("Success.");
    },
    addTask() {
      console.log(
        "begin adding new task - " +
          this.selectedTaskType +
          "-" +
          this.newTaskId +
          "-" +
          this.newTaskName +
          "-" +
          this.newTaskDescr
      );
      if (
        store.ifExists(this.selectedTaskType) &&
        store.ifExists(this.newTaskId) &&
        store.ifExists(this.newTaskName) &&
        store.ifExists(this.newTaskDescr)
      ) {
        if (!store.cache.IsTask(this.newTaskId)) {
          store.cache.AddTask(
            this.selectedTaskType,
            this.newTaskId,
            this.newTaskName,
            this.newTaskDescr
          );
          this.$toast.add({
            severity: "success",
            summary: `${this.newTaskName} added`,
            life: 3000,
          });
          console.log("Success.");
          this.clearTaskFields();
        } else {
          this.errorMessage[2] = "Task id already exists.";
        }
      } else {
        for (let i = 0; i < 5; i++) {
          this.errorMessage[i] = "Field required.";
        }
      }
    },
    deleteTask() {
      console.log("begin deleting existing task - " + this.newTaskId);
      if (store.ifExists(this.newTaskId)) {
        if (store.cache.IsTask(this.newTaskId)) {
          store.cache.RemoveTask(this.newTaskId);
          this.$toast.add({
            severity: "success",
            summary: `${this.newTaskName} deleted`,
            life: 3000,
          });
          console.log("Success.");
          this.clearTaskFields();
        } else {
          this.errorMessage[2] = "Task id does not exist.";
        }
      } else {
        this.errorMessage[2] = "Field required.";
      }
    },
    requestTaskApprovers() {
      console.log(
        "begin adding approvers to existing task - " +
          this.newTaskId +
          " - " +
          this.selectedApprover
      );
      if (
        store.ifExists(this.newTaskId) &&
        store.ifExists(this.selectedApprover)
      ) {
        if (store.cache.IsTask(this.newTaskId)) {
          const myArray = this.selectedApprover.split(":");
          if (myArray.length == 3) {
            let approverId = myArray[0].trim();
            store.cache.AddMultipleReqApprovals(this.newTaskId, approverId);
            this.$toast.add({
              severity: "success",
              summary: `${this.selectedApprover} sent approval request`,
              life: 3000,
            });
            console.log("Success.");
          }
        } else {
          this.errorMessage = "Task id does not exists.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
    removeTaskApprovers() {
      console.log(
        "begin removing approvers to existing task - " +
          this.newTaskId +
          " - " +
          this.selectedApprover
      );
      if (
        store.ifExists(this.newTaskId) &&
        store.ifExists(this.selectedApprover)
      ) {
        if (store.cache.IsTask(this.newTaskId)) {
          const myArray = this.selectedApprover.split(":");
          if (myArray.length == 3) {
            let approverId = myArray[0].trim();
            let task = store.cache.GetTask(this.newTaskId);
            if (task != null) {
              task.RemoveReqApproval(approverId);
              this.$toast.add({
                severity: "success",
                summary: `${this.selectedApprover} removed from approvals`,
                life: 3000,
              });
              console.log("Success.");
            }
          }
        } else {
          this.errorMessage[2] = "Task id does not exists.";
        }
      } else {
        //this.errorMessage = "Field required.";
      }
    },
    endorseTask() {
      console.log("begin endorsing existing task - " + this.newTaskId);
      if (store.ifExists(this.newTaskId)) {
        if (store.cache.IsTask(this.newTaskId)) {
          store.cache.EndorseTask(this.newTaskId);
          this.$toast.add({
            severity: "success",
            summary: `${this.newTaskName} endorsed`,
            life: 3000,
          });
          console.log("Success.");
        } else {
          this.errorMessage[2] = "Task id does not exists.";
        }
      } else {
        this.errorMessage[2] = "Task required.";
      }
    },
    approveTask() {
      console.log("begin approving existing task - " + this.newTaskId);
      if (store.ifExists(this.newTaskId)) {
        if (store.cache.IsTask(this.newTaskId)) {
          if (store.cache.ApproveTask(this.newTaskId)) {
            this.$toast.add({
              severity: "success",
              summary: "Task approved",
              life: 3000,
            });
            console.log("Success.");
          } else {
            this.$toast.add({
              severity: "error",
              summary: "Task not approved",
              life: 3000,
            });
          }
        } else {
          this.errorMessage = "Task id does not exists.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
    addRequiredRole() {
      console.log(
        "begin adding required role - " +
          this.newTaskId +
          " - " +
          this.selectedRole
      );
      if (store.ifExists(this.newTaskId) && store.ifExists(this.selectedRole)) {
        if (store.cache.IsTask(this.newTaskId)) {
          let task = store.cache.GetTask(this.newTaskId);
          if (task) {
            if (task.AddReqRole(this.selectedRole)) {
              this.$toast.add({
                severity: "success",
                summary: "Role Added",
                life: 3000,
              });
              console.log("Success.");
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Role not added",
                life: 3000,
              });
            }
          }
        } else {
          this.errorMessage = "Task id does not exist.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
    removeRequiredRole() {
      console.log(
        "begin removing required role - " +
          this.newTaskId +
          " - " +
          this.selectedRole
      );
      if (store.ifExists(this.newTaskId) && store.ifExists(this.selectedRole)) {
        if (store.cache.IsTask(this.newTaskId)) {
          let task = store.cache.GetTask(this.newTaskId);
          if (task) {
            task.RemoveReqRole(this.selectedRole);
            console.log("Success.");
          }
        } else {
          this.errorMessage[2] = "Task id does not exists.";
        }
      } else {
        this.errorMessage[2] = "Field required.";
      }
    },
    updateStatus() {
      console.log(
        "begin updating task-status - " +
          this.newTaskId +
          " - " +
          this.selectedStatus
      );
      if (
        store.ifExists(this.newTaskId) &&
        store.ifExists(this.selectedStatus)
      ) {
        if (store.cache.IsTask(this.newTaskId)) {
          let task = store.cache.GetTask(this.newTaskId);
          if (task) {
            if (task.UpdateStatus(this.selectedStatus)) {
              this.$toast.add({
                severity: "success",
                summary: "Status updated",
                life: 3000,
              });
              console.log("Success.");
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Status not updated",
                life: 3000,
              });
            }
            this.selectedStatus = task.Status;
          }
        } else {
          this.errorMessage = "Task id does not exists.";
        }
      } else {
        this.errorMessage = "Field required.";
      }
    },
  },
};
</script>
