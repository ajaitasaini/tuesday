/* eslint-disable no-useless-catch */
import { UnitTests } from "./testing";
import { TeamMember } from "./teamMember";
import { Task } from "./tasks";

// DataCache class - storage structures
export class DataCache {
  // removes array elements via splice
  static RemoveArrElement(arr, ele) {
    const index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }

  // check if string value exists
  static ifExist(str) {
    return str && str.trim() !== "";
  }

  static allRoles = [
    "Content Strategist",
    "Data Scientist",
    "Designer",
    "Engineer",
    "Manager",
    "Policy Analyst",
    "Project Manager",
    "QA",
    "UX Researcher",
  ];
  static get Roles() {
    return DataCache.allRoles;
  }
  static IsRole(role) {
    return this.allRoles.includes(role.trim());
  }

  // two possible task types you can currently add to roadmap
  static theTaskTypes = ["Project", "Task"];
  static get TaskTypes() {
    return DataCache.theTaskTypes;
  }
  static IsTaskType(type) {
    return this.theTaskTypes.includes(type.trim());
  }

  // status of each task
  static StatusAnalysis = "Analysis";
  static StatusExecution = "Execution";
  static StatusClosed = "Closed";
  static theTaskStatuses = { Analysis: 0, Execution: 1, Closed: 2 };
  static get TaskStatuses() {
    return DataCache.theTaskStatuses;
  }
  static get TaskStatusNames() {
    return Object.keys(this.theTaskStatuses);
  }

  // is valid task status
  static IsTaskStatus(status) {
    if (status) {
      return this.TaskStatusNames.includes(status.trim());
    }
    return false;
  }

  // 0, 1, 2
  static TaskStatusValue(status) {
    if (this.IsTaskStatus(status)) {
      return this.theTaskStatuses[status.trim()];
    }
    return -1;
  }

  // returns key based on value
  static TaskStatusName(value) {
    return Object.keys(this.theTaskStatuses).find(
      (key) => this.theTaskStatuses[key] === value
    );
  }

  static theMembers = new Map();
  static get Members() {
    return DataCache.theMembers;
  }
  static set Members(value) {
    DataCache.theMembers = value;
  }

  static theTasks = new Map();
  static get Tasks() {
    return DataCache.theTasks;
  }
  static set Tasks(value) {
    DataCache.theTasks = value;
  }

  static LoggedUserId = "";
  static AuthenticateMember(id) {
    this.LoggedUserId = "";
    if (this.IsMember(id.trim())) {
      this.LoggedUserId = id.trim();
      return true;
    }
    return false;
  }

  static AddMember(id, name, role) {
    if (this.theMembers.has(id) == false) {
      let mem = new TeamMember(id, name, role);
      this.theMembers.set(id, mem);
      return mem;
    }
    console.error("Member with Id=" + id + " already defined.");
    return null;
  }
  static IsMember(id) {
    return this.theMembers.has(id);
  }
  static GetMember(id) {
    if (this.theMembers.has(id)) {
      return this.theMembers.get(id);
    }
    return null;
  }
  static GetAllMembers() {
    let allMembers = new Array();
    this.theMembers.forEach((element) => {
      allMembers.push(`${element.Id} : ${element.Name} : ${element.Role}`);
    });
    return allMembers.sort();
  }
  static RemoveMember(id) {
    if (this.theMembers.has(id)) {
      this.theMembers.delete(id);
    }
  }

  static AddTask(taskType, id, name, desc) {
    if (this.theTasks.has(id) == false) {
      let task = new Task(taskType, id, name, desc);
      task.creator = this.LoggedUserId;
      this.theTasks.set(id, task);
      return task;
    }
    console.error(`Task with Id=${id} already defined.`);
    return null;
  }
  static IsTask(id) {
    return this.theTasks.has(id);
  }
  static GetTask(id) {
    if (this.theTasks.has(id)) {
      return this.theTasks.get(id);
    }
    return null;
  }
  static GetAllTasks() {
    let allTasks = new Array();
    this.theTasks.forEach((element) => {
      allTasks.push(`${element.TaskType} : ${element.Id} : ${element.Name}`);
    });
    return allTasks.sort();
  }

  static RemoveTask(id) {
    let result = true;
    if (this.theTasks.has(id)) {
      let task = this.GetTask(id);
      if (task != null) {
        result = task.UnlinkFromAllParents();
      }
      this.theTasks.delete(id);
    }
    return result;
  }
  static EndorseTask(id) {
    let task = this.GetTask(id);
    if (task != null) {
      task.AddEndorsement(this.LoggedUserId);
    }
  }
  static ApproveTask(id) {
    let task = this.GetTask(id);
    if (task != null) {
      return task.AddApprover(this.LoggedUserId);
    }
    return false;
  }
  static AddMultipleReqApprovals(taskId, reqApprovals) {
    let task = this.GetTask(taskId);
    if (task != null) {
      task.AddMultipleReqApprovals(reqApprovals);
    }
  }
  static GetObjectRoadMap(taskId) {
    let task = this.GetTask(taskId);
    if (task != null) {
      return [task.GetObjectRoadMap()];
    }
    return [];
  }
}

class Prototype {
  constructor() {}

  PrepareData() {
    DataCache.AddMember("PM101", "Henry Haber", "Project Manager");

    DataCache.AddMember("M101", "Louise Belcher", "Manager");
    DataCache.AddMember("M102", "Millie Frock", "Manager");

    DataCache.AddMember("D101", "Bob Belcher", "Designer");
    DataCache.AddMember("D102", "Teddy", "Designer");

    DataCache.AddMember("CS101", "Phillip Frond", "Content Strategist");

    DataCache.AddMember("UXR101", "Tina Belcher", "UX Researcher");
    DataCache.AddMember("UXR102", "Tammy Larson", "UX Researcher");

    DataCache.AddMember("E101", "Ajaita Saini", "Engineer");
    DataCache.AddMember("E102", "Jimmy Pesto", "Engineer");
    DataCache.AddMember("E103", "Zeke", "Engineer");

    DataCache.AddMember("DS101", "Regular-sized Rudy", "Data Scientist");
    DataCache.AddMember("DS102", "Darryl", "Data Scientist");

    DataCache.AddMember("PA101", "Ollie Pesto", "Policy Analyst");
    DataCache.AddMember("PA102", "Andy Pesto", "Policy Analyst");

    DataCache.AddMember("QA101", "Linda Belcher", "QA");
    DataCache.AddMember("QA102", "Calvin Fishoeder", "QA");

    DataCache.AuthenticateMember("E101");

    let proj = DataCache.AddTask(
      "Project",
      "PROJ101",
      "Child Safety in Calling",
      "This is a project about reducing harms to minors that use audio and video calls on Messenger. Team will work to increase transparency to minors about who they're coming in contact with and connect them to services if harm is inflicted via the app."
    );
    //proj.Creator = "PM102";
    proj.AddReqRole("Manager");
    proj.AddReqRole("Designer");
    proj.AddReqRole("Content Strategist");
    proj.AddReqRole("Engineer");
    proj.AddReqRole("Project Manager");
    proj.AddReqRole("UX Researcher");
    proj.AddReqRole("Policy Analyst");

    let task101 = DataCache.AddTask(
      "Task",
      "Task101",
      "Identify/Research",
      "Conduct research audit to identify pain points in current design and where children are most vulnerable/ susceptible to harm."
    );

    task101.AddReqRole("UX Researcher");

    let task102 = DataCache.AddTask(
      "Task",
      "Task102",
      "Design new user interface",
      "Design a Figma prototype and populate content that is safe and transparent to minors."
    );

    task102.AddReqRole("Designer");
    task102.AddReqRole("Content Strategist");

    let task103 = DataCache.AddTask(
      "Task",
      "Task103",
      "Policy Approval",
      "Get child safety experts to approve design."
    );

    task103.AddReqRole("Policy Analyst");
    task103.AddReqRole("Designer");
    task103.AddReqRole("Content Strategist");
    task103.AddReqRole("Engineer");

    let task104 = DataCache.AddTask(
      "Task",
      "Task104",
      "Build prototype",
      "Develop working prototype of mockups."
    );

    task104.AddReqRole("Engineer");

    proj.AddSubTask(task101.Id);
    proj.AddSubTask(task102.Id);
    task102.AddSubTask(task103.Id);
    proj.AddSubTask(task104.Id);
    proj.AddReqApproval("PA101");
    proj.AddReqApproval("M101");
    proj.AddApprover("M101");
    proj.AddEndorsement("D102");
    proj.AddEndorsement("CS101");
    proj.AddEndorsement("E103");

    console.log(proj.GetPendingApprovals());
    console.log(proj.IsFullyApproved());
  }

  DumpLog() {
    console.log(DataCache.GetTask("PROJ101"));
    console.log(DataCache.GetObjectRoadMap("PROJ101"));
  }
}

class Main {
  constructor() {
    this.protoType = true;
  }
  run() {
    if (this.protoType) {
      const proto = new Prototype();
      proto.PrepareData();
      proto.DumpLog();
    } else {
      const tester = new UnitTests();
      tester.RunTests();
    }
  }
}

let main = new Main();
main.run();
