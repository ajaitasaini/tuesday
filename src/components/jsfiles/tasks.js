/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import { DataCache } from "./script.js";

export class Task {
  constructor(taskType, id, name, desc) {
    this.reqRoles = new Array();
    this.parentTasks = new Array();
    this.subTasks = new Array();
    this.endorsers = new Array();
    this.reqApproval = new Array();
    this.approvers = new Array();
    this.creator = null;
    try {
      if (!DataCache.ifExist(taskType)) throw "Task Type cannot be empty.";
      if (!DataCache.ifExist(name)) throw "Task Name cannot be empty.";
      if (!DataCache.ifExist(id)) throw "Task Id cannot be empty.";
      if (!DataCache.ifExist(desc)) throw "Task Description cannot be empty.";
      this.name = name.trim();
      this.id = id.trim();
      this.desc = desc.trim();
      if (DataCache.IsTaskType(taskType)) {
        this.taskType = taskType;
      } else {
        console.error(`Invalid task type - ${taskType}`);
      }
      this.status = DataCache.StatusAnalysis;
    } catch (error) {
      throw error;
    }
  }
  get Id() {
    return this.id;
  }
  get Name() {
    return this.name;
  }
  get Desc() {
    return this.desc;
  }
  get TaskType() {
    return this.taskType;
  }

  // finding the minimum status value of all the task's children
  OverallChildStatusValue() {
    let minStatus = DataCache.TaskStatusValue(DataCache.StatusClosed);
    for (let i = 0; i < this.subTasks.length; ++i) {
      let subTask = DataCache.GetTask(this.subTasks[i]);
      if (subTask) {
        if (minStatus > DataCache.TaskStatusValue(subTask.status)) {
          minStatus = DataCache.TaskStatusValue(subTask.status);
        }
        let childStatusValue = subTask.OverallChildStatusValue();
        if (minStatus > childStatusValue) {
          minStatus = childStatusValue;
        }
      }
    }
    console.log(`OverallChildStatus: ${DataCache.TaskStatusName(minStatus)}`);
    return minStatus;
  }

  // calculates "actual status" of task
  OverallStatus() {
    let overallChildStatusValue = this.OverallChildStatusValue();
    if (DataCache.TaskStatusValue(this.status) > overallChildStatusValue) {
      return DataCache.TaskStatusName(overallChildStatusValue);
    }
    return this.status;
  }
  get Status() {
    return this.status;
  }
  UpdateStatus(status) {
    if (
      DataCache.ifExist(status) &&
      this.Creator.Id == DataCache.LoggedUserId
    ) {
      if (DataCache.TaskStatusNames.includes(status)) {
        if (status == DataCache.StatusClosed) {
          if (
            DataCache.TaskStatusName(this.OverallChildStatusValue()) ==
            DataCache.StatusClosed
          ) {
            this.status = status;
            return true;
          } else {
            console.error(
              "Failure -- Cannot close the status -- sub-tasks are not closed yet."
            );
            return false;
          }
        } else {
          for (let i = 0; i < this.parentTasks.length; ++i) {
            let parentTask = DataCache.GetTask(this.parentTasks[i]);
            if (parentTask && parentTask.Status == DataCache.StatusClosed) {
              console.error(
                `Failure - ParentTask ${parentTask.Name} has been Closed.`
              );
              return false;
            }
          }
          this.status = status;
          return true;
        }
      }
    } else {
      console.error(
        `Failure -- Only creator ${this.Creator.Name} can change the status of the task.`
      );
    }
    return false;
  }
  set Creator(id) {
    if (DataCache.IsMember(id)) {
      this.creator = id;
    } else {
      console.error(`Member with Id ${id} not found.`);
    }
  }
  get Creator() {
    return DataCache.GetMember(this.creator);
  }
  AddReqRole(role) {
    try {
      if (DataCache.ifExist(role) && DataCache.IsRole(role)) {
        if (this.reqRoles.includes(role) == false) {
          this.reqRoles.push(role);
          return true;
        } else {
          console.error(`Failure -- inserting duplicate role ${role}`);
        }
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  AddMultipleReqApprovals(reqApprovals) {
    const myArray = reqApprovals.split(",");
    myArray.forEach((element) => {
      this.AddReqApproval(element.trim());
    });
  }
  RemoveReqRole(role) {
    try {
      if (DataCache.ifExist(role) && DataCache.IsRole(role)) {
        if (this.reqRoles.includes(role)) {
          DataCache.RemoveArrElement(this.reqRoles, role);
          return true;
        } else {
          console.error(`Failure - Role not found ${role}`);
        }
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  IsParent(taskId) {
    for (let i = 0; i < this.parentTasks.length; ++i) {
      if (
        this.parentTasks[i] == taskId ||
        DataCache.GetTask(this.parentTasks[i]).IsParent(taskId)
      ) {
        return true;
      }
    }
    return false;
  }
  AddSubTask(subTaskId) {
    try {
      if (this.Id == subTaskId.trim()) {
        console.error(`Failure - a task cannot be linked to itself.`);
        return false;
      }
      if (this.IsParent(subTaskId)) {
        console.error(
          `Failure - parent task ${subTaskId} cannot be added to child task ${this.Name}.`
        );
        return false;
      }
      if (DataCache.IsTask(subTaskId)) {
        if (!this.subTasks.includes(subTaskId)) {
          this.subTasks.push(subTaskId);
          let sub = DataCache.GetTask(subTaskId);
          if (sub != null) {
            sub.parentTasks.push(this.Id);
            return true;
          }
        } else {
          console.log(`SubTask ${subTaskId} already linked to ${this.Name}`);
        }
      } else {
        console.error(`Failure - Invalid SubTask Id - ${subTaskId}`);
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  RemoveSubTask(subTaskId) {
    try {
      if (DataCache.IsTask(subTaskId)) {
        if (this.subTasks.includes(subTaskId)) {
          DataCache.RemoveArrElement(this.subTasks, subTaskId);
          let sub = DataCache.GetTask(subTaskId);
          if (sub != null) {
            DataCache.RemoveArrElement(sub.parentTasks, this.Id);
            return true;
          }
        } else {
          console.log(`SubTask ${subTaskId} is not linked to ${this.Name}`);
        }
      } else {
        console.error(`Failure - Invalid SubTask Id - ${subTaskId}`);
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  UnlinkFromAllParents() {
    let localParents = new Array();
    this.parentTasks.forEach((element) => {
      localParents.push(element);
    });
    let result = true;
    for (let i = 0; i < localParents.length; ++i) {
      let parentTask = DataCache.GetTask(localParents[i]);
      if (parentTask != null) {
        if (!parentTask.RemoveSubTask(this.Id)) {
          result = false;
        }
      }
    }
    return result;
  }
  AddEndorsement(memberId) {
    try {
      if (DataCache.IsMember(memberId) /*&& memberId != this.Creator.Id*/) {
        if (!this.endorsers.includes(memberId)) {
          this.endorsers.push(memberId);
          return true;
        } else {
          console.log(`Task ${this.Name} is already endorsed by ${memberId}.`);
        }
      } else {
        console.error(`Invalid Endorsement Id - ${memberId}`);
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  RemoveEndorsement(memberId) {
    if (this.endorsers.includes(memberId)) {
      DataCache.RemoveArrElement(this.endorsers, memberId);
    }
  }
  AddReqApproval(memberId) {
    try {
      if (DataCache.IsMember(memberId)) {
        if (memberId != this.Creator.Id) {
          if (!this.reqApproval.includes(memberId)) {
            this.reqApproval.push(memberId);
            return true;
          }
        } else {
          console.error(
            `Task Creator cannot be Requested Approver - ${memberId}`
          );
        }
      } else {
        console.error(`Invalid Requested Approver Id - ${memberId}`);
      }
    } catch (error) {
      throw error;
    }
    return false;
  }

  RemoveReqApproval(memberId) {
    if (this.reqApproval.includes(memberId)) {
      DataCache.RemoveArrElement(this.reqApproval, memberId);
    }
  }
  AddApprover(memberId) {
    try {
      if (DataCache.IsMember(memberId)) {
        if (memberId != this.Creator.Id) {
          if (!this.approvers.includes(memberId)) {
            this.approvers.push(memberId);
            return true;
          } else {
            console.info(`Task ${this.Name} already approved by ${memberId}.`);
          }
        } else {
          console.error("Task Creator cannot be Approver.");
        }
      } else {
        console.error("Invalid Approver Id.");
      }
    } catch (error) {
      throw error;
    }
    return false;
  }
  RemoveApprover(memberId) {
    if (this.approvers.includes(memberId)) {
      DataCache.RemoveArrElement(this.approvers, memberId);
    }
  }
  GetPendingApprovals() {
    let pending = new Array();
    if (this.reqApproval.length > 0) {
      for (let i = 0; i < this.reqApproval.length; ++i) {
        if (!this.approvers.includes(this.reqApproval[i])) {
          pending.push(this.reqApproval[i]);
        }
      }
    }
    return pending;
  }
  GetMemberNames(arr) {
    let names = new Array();
    if (arr) {
      for (let i = 0; i < arr.length; ++i) {
        let member = DataCache.GetMember(arr[i]);
        if (member) {
          names.push(member.Name);
        }
      }
    }
    return names;
  }
  IsFullyApproved() {
    return this.GetPendingApprovals().length == 0;
  }
  GetObjectRoadMap() {
    let roadmap = new Object();
    roadmap["key"] = this.Id;
    roadmap["label"] = this.Name;
    let children = new Array();
    roadmap["children"] = children;

    children.push({
      key: `${this.Id}-01`,
      one: "one",
      status: `${this.status}`,
      taskType: `${this.TaskType}`,
      id: `${this.Id}`,
      descr: `${this.Desc}`,
    });

    if (this.Creator != null) {
      children.push({
        key: `${this.Id}-02`,
        two: "two",
        owner: `${this.Creator.Name}`,
      });
    }

    //Add Required Roles
    if (this.reqRoles.length > 0) {
      children.push({
        key: `${this.Id}-03`,
        three: "three",
        required: this.reqRoles,
      });
    }

    //Add Pending Approvers
    children.push({
      key: `${this.Id}-04`,
      four: "four",
      pending: this.GetMemberNames(this.GetPendingApprovals()),
    });

    //Add Approvers who approved
    children.push({
      key: `${this.Id}-05`,
      five: "five",
      approved: this.GetMemberNames(this.approvers),
    });

    //Add Endorsers
    if (this.endorsers.length > 0) {
      children.push({
        key: `${this.Id}-06`,
        six: "six",
        endorsed: this.GetMemberNames(this.endorsers),
      });
    }

    //Add subs
    if (this.subTasks.length > 0) {
      for (let i = 0; i < this.subTasks.length; ++i) {
        let task = DataCache.GetTask(this.subTasks[i]);
        if (task != null) {
          children.push(task.GetObjectRoadMap());
        }
      }
    }
    return roadmap;
  }
}