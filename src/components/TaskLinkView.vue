<template>
  <div class="card">
    <Card class="mt-5 ml-5 mb-5 mr-2">
      <template #title> Link Task to Roadmap </template>
      <template #content>
        <form class="form-inline">
          <div class="form-group mx-sm-3 mb-2">
            <Dropdown
              v-model="selectedParentTask"
              v-on:before-show="taskDropdownBeforeShow()"
              :options="allTasksArray"
              :disabled="disable == 1"
              placeholder="Parent Task"
              class="w-full md:w-14rem"
            />
          </div>

          <div class="form-group mx-sm-3 mb-2">
            <Dropdown
              v-model="selectedSubTask"
              v-on:before-show="taskDropdownBeforeShow()"
              :options="allTasksArray"
              :disabled="disable == 1"
              placeholder="Sub Task"
              class="w-full md:w-14rem"
            />
          </div>
          <Button
            id="btnLinkTasks"
            type="button"
            v-on:click.prevent="linkTasks()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-2"
            >Link</Button
          >
          <Button
            id="btnUnLinkTasks"
            type="button"
            v-on:click.prevent="unlinkTasks()"
            :disabled="disable == 1"
            class="mt-3 mr-3 mb-2"
            >UnLink</Button
          >
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { store } from "./jsfiles/store.js";

export default {
  name: "TaskLinkView",
  props: ["disable"],
  data() {
    return {
      selectedSubTask: "",
      selectedParentTask: "",
      store,
      allTasksArray: store.cache.GetAllTasks(),
    };
  },
  methods: {
    taskDropdownBeforeShow() {
      this.allTasksArray = store.cache.GetAllTasks();
    },
    linkTasks() {
      console.log(
        `begin task linking - ${this.selectedSubTask} <> ${this.selectedParentTask}.`
      );
      if (
        store.ifExists(this.selectedSubTask) &&
        store.ifExists(this.selectedParentTask)
      ) {
        let subTask = null;
        {
          const myArray = this.selectedSubTask.split(":");
          if (myArray.length == 3) {
            let subTaskId = myArray[1].trim();
            subTask = this.store.cache.GetTask(subTaskId);
          }
        }
        if (subTask == null) {
          console.error(`SubTask ${this.selectedSubTask} not found.`);
        }
        let parentTask = null;
        {
          const myArray = this.selectedParentTask.split(":");
          if (myArray.length == 3) {
            let parentTaskId = myArray[1].trim();
            parentTask = this.store.cache.GetTask(parentTaskId);
          }
        }
        if (parentTask == null) {
          console.error(`ParentTask ${this.selectedParentTask} not found.`);
        }
        if (subTask.Id != parentTask.Id) {
          if (parentTask.AddSubTask(subTask.Id)) {
            console.log("Success");
          }
        } else {
          console.error(
            `Failure - SubTask ${subTask.Name} is same as ParentTask ${parentTask.Name}.`
          );
        }
      } else {
        console.error("Failure -- SubTask & ParentTask must be selected.");
      }
    },
    unlinkTasks() {
      console.log(
        `begin task unlinking - ${this.selectedSubTask} <> ${this.selectedParentTask}.`
      );
      if (
        store.ifExists(this.selectedSubTask) &&
        store.ifExists(this.selectedParentTask)
      ) {
        let subTask = null;
        {
          const myArray = this.selectedSubTask.split(":");
          if (myArray.length == 3) {
            let subTaskId = myArray[1].trim();
            subTask = this.store.cache.GetTask(subTaskId);
          }
        }
        if (subTask == null) {
          console.error(`SubTask ${this.selectedSubTask} not found.`);
        }
        let parentTask = null;
        {
          const myArray = this.selectedParentTask.split(":");
          if (myArray.length == 3) {
            let parentTaskId = myArray[1].trim();
            parentTask = this.store.cache.GetTask(parentTaskId);
          }
        }
        if (parentTask == null) {
          console.error(`ParentTask ${this.selectedParentTask} not found.`);
        }
        if (subTask.Id != parentTask.Id) {
          if (parentTask.RemoveSubTask(subTask.Id)) {
            console.log("Success");
          }
        } else {
          console.error(
            `Failure - SubTask ${subTask.Name} is same as ParentTask ${parentTask.Name}.`
          );
        }
      } else {
        console.error("Failure -- SubTask & ParentTask must be selected.");
      }
    },
  },
};
</script>
