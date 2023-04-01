<template>
  <div class="card">
    <Card class="mt-5 mr-5 mb-5 ml-2">
      <template #title> Roadmap </template>
      <template #content>
        <div class="dropdown">
          <Dropdown
            v-model="selectedTask"
            v-on:change="taskSelected()"
            v-on:before-show="taskDropdownBeforeShow()"
            aria-label="Road map"
            :options="allTasksArray"
          />
        </div>
        <Tree :value="nodes" class="w-full">
          <!-- Using slot props to handle customizations for each type of data in roadmap -->
          <!-- Corresponding info slotProps uses is set up in tasks.js -->
          <template #default="slotProps">
            <div v-if="slotProps.node.label" class="flex flex-inline">
              <h2>{{ slotProps.node.label }}</h2>
            </div>

            <!-- Overview -->
            <div v-if="slotProps.node.one">
              <h3>Overview</h3>
              <Badge
                size="large"
                class="mr-3 pl-3 pr-3"
                severity="warning"
                aria-label="Task status"
              >
                {{ slotProps.node.status }}
              </Badge>
              <Badge
                size="large"
                class="mr-3"
                severity="info"
                aria-label="Task ID"
              >
                {{ slotProps.node.id }}
              </Badge>
              <p>{{ slotProps.node.descr }}</p>
            </div>

            <!-- Roles involved -->
            <div v-if="slotProps.node.two" class="block">
              <h3>Team Roles Involved</h3>
              <h4>Task Owner</h4>
              <Badge
                size="large"
                class="mr-3"
                severity="info"
                aria-label="Task owner"
              >
                {{ slotProps.node.owner }}
              </Badge>
            </div>

            <div v-if="slotProps.node.three" class="block">
              <h4>Required Roles</h4>
              <Badge
                size="large"
                class="mr-3 mt-3"
                severity="info"
                v-for="item in slotProps.node.required"
                aria-label="Required roles"
                :key="item"
              >
                {{ item }}
              </Badge>
            </div>

            <!-- Approvals and endorsements -->
            <div v-if="slotProps.node.four" class="block">
              <h3>Approvals & Endorsements</h3>
              <h4>Pending Approval</h4>
              <Badge
                size="large"
                class="mr-3 mt-3"
                severity="danger"
                v-for="item in slotProps.node.pending"
                aria-label="Pending approvals by"
                :key="item"
              >
                {{ item }}
              </Badge>
            </div>

            <div v-if="slotProps.node.five" class="block">
              <h4>Approved by</h4>
              <Badge
                size="large"
                class="mr-3 mt-3"
                severity="success"
                v-for="item in slotProps.node.approved"
                aria-label="Approved by"
                :key="item"
              >
                {{ item }}
              </Badge>
            </div>

            <div v-if="slotProps.node.six" class="block">
              <h4>Endorsements</h4>
              <Badge
                size="large"
                class="mr-3 mt-3"
                severity="success"
                v-for="item in slotProps.node.endorsed"
                aria-label="Endorsements"
                :key="item"
              >
                {{ item }}
              </Badge>
            </div>
          </template>
        </Tree>
      </template>
    </Card>
  </div>
</template>

<script>
import { store } from "./jsfiles/store.js";

export default {
  name: "RoadmapView",
  data() {
    return {
      store,
      selectedTask: null,
      allTasksArray: store.cache.GetAllTasks(),
      nodes: [],
    };
  },
  methods: {
    taskDropdownBeforeShow() {
      this.allTasksArray = store.cache.GetAllTasks();
    },
    taskSelected() {
      console.log("begin task selected - " + this.selectedTask);
      const myArray = this.selectedTask.split(":");
      if (myArray.length == 3) {
        let taskId = myArray[1];
        let roadmap = this.store.cache.GetObjectRoadMap(taskId.trim());
        this.nodes = roadmap;
      }
      console.log("Success.");
    },
  },
};
</script>
