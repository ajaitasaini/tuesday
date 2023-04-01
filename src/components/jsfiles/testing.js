/* eslint-disable no-unused-vars */
import { DataCache } from "./script.js";

export class UnitTests {
  constructor() {
    this.CreateAdmin();
  }
  Assert(exp, desc) {
    if (exp) {
      console.log(`Success -- ${desc}`);
    } else {
      console.error(`Failure -- ${desc}`);
    }
  }
  CreateAdmin() {
    DataCache.AddMember("B007", "Bond007", "Project Manager");
    DataCache.AuthenticateMember("B007");
  }
  RunTests() {
    this.TestTeamMembers();
    this.TestTasks();
  }
  TestTeamMembers() {
    try {
      console.log(
        "BEGIN TestTeamMembers() =============================================="
      );

      //B007 is already created in CreateAdmin() above which is called from the constructor.
      this.Assert(
        DataCache.GetAllMembers().length == 1,
        "DataCache.GetAllMembers().length == 1"
      );

      //create 4 new Team Members -- PM102 will be delete later.
      console.log("Adding 4 new members -- ");
      DataCache.AddMember("PM101", "ProjManager101", "Project Manager");
      DataCache.AddMember("PM102", "ProjManager101", "Project Manager");
      DataCache.AddMember("M101", "Manager101", "Manager");
      DataCache.AddMember("D101", "Designer101", "Designer");

      //verify that total team-members are 5 including admin B007
      this.Assert(
        DataCache.GetAllMembers().length == 4 + 1,
        "DataCache.GetAllMembers().length == 4+1 (+1 for existing member)"
      );

      //print all team-members into console logs
      console.log("Listing new members -- ");
      console.log(DataCache.GetAllMembers());

      //verify PM101 is a member
      this.Assert(DataCache.IsMember("PM101"), 'DataCache.IsMember("PM101")');

      // Print M101 member data into console-logs
      console.log("Printing -- M101");
      console.log(DataCache.GetMember("PM101"));

      // delete PM102
      console.log("Removing members -- PM102");
      DataCache.RemoveMember("PM102");

      // Print all remaining team-members into the console logs
      console.log(DataCache.GetAllMembers());

      // verify PM102 is not a member anymore -- both IsMember and GetMember should return false.
      this.Assert(!DataCache.IsMember("PM102"), '!DataCache.IsMember("PM102")');
      this.Assert(
        !DataCache.GetMember("PM102"),
        '!DataCache.GetMember("PM102")'
      );

      // verify current logged in user is admin B007
      this.Assert(
        DataCache.LoggedUserId == "B007",
        'DataCache.LoggedUserId == "B007"'
      );

      // authenticate another user M101
      this.Assert(
        DataCache.AuthenticateMember("M101"),
        'DataCache.AuthenticateMember("M101")'
      );
      this.Assert(
        DataCache.LoggedUserId == "M101",
        'DataCache.LoggedUserId == "M101"'
      );

      // try authenticaing a non-existent user PM102
      this.Assert(
        !DataCache.AuthenticateMember("PM102"),
        '!DataCache.AuthenticateMember("PM102")'
      );
      this.Assert(DataCache.LoggedUserId == "", 'DataCache.LoggedUserId == ""');

      // try adding a duplicate team-member which should throw the exception
      try {
        console.log("Try adding an existing member B007 -- ");
        DataCache.AddMember("B007", "Bond007", "ProjectManager");
      } catch (error) {
        console.error(error);
      }

      // authenticate back to admin B007
      this.Assert(
        DataCache.AuthenticateMember("B007"),
        'DataCache.AuthenticateMember("B007")'
      );
      this.Assert(
        DataCache.LoggedUserId == "B007",
        'DataCache.LoggedUserId == "B007"'
      );
      console.log(
        "END TestTeamMembers()   =============================================="
      );
    } catch (error) {
      console.error(error);
    }
  }

  TestTasks() {
    try {
      console.log(
        "BEGIN TestTasks() =============================================="
      );

      // add 3 new project tasks
      console.log("Adding 3 new proj tasks --");
      let proj1 = DataCache.AddTask(
        "Project",
        "P101",
        "Proj101",
        "Project 101 Desc."
      );
      let proj2 = DataCache.AddTask(
        "Project",
        "P102",
        "Proj101",
        "Project 102 Desc."
      );
      let proj3 = DataCache.AddTask(
        "Project",
        "P103",
        "Proj101",
        "Project 103 Desc."
      );

      // total task count should be 3
      this.Assert(
        DataCache.GetAllTasks().length == 3,
        "DataCache.GetAllTasks().length == 3"
      );

      // Print all tasks data into console logs
      console.log("Listing new tasks -- ");
      console.log(DataCache.GetAllTasks());

      // add 3 new component tasks
      let comp1 = DataCache.AddTask(
        "Task",
        "C101",
        "Comp101",
        "Component 101 Desc."
      );
      let comp2 = DataCache.AddTask(
        "Task",
        "C102",
        "Comp102",
        "Component 102 Desc."
      );
      let comp3 = DataCache.AddTask(
        "Task",
        "C103",
        "Comp103",
        "Component 103 Desc."
      );

      // total task count should be 6
      this.Assert(
        DataCache.GetAllTasks().length == 6,
        "DataCache.GetAllTasks().length == 6"
      );

      // Print all tasks data into console logs
      console.log("Listing new tasks -- ");
      console.log(DataCache.GetAllTasks());

      // add 3 new tasks
      let task1 = DataCache.AddTask(
        "Task",
        "T101",
        "Task101",
        "Task 101 Desc."
      );
      let task2 = DataCache.AddTask(
        "Task",
        "T102",
        "Task101",
        "Task 102 Desc."
      );
      let task3 = DataCache.AddTask(
        "Task",
        "T103",
        "Task101",
        "Task 103 Desc."
      );

      // total task count should be 9
      this.Assert(
        DataCache.GetAllTasks().length == 9,
        "DataCache.GetAllTasks().length == 9"
      );

      // Print all tasks data into console logs
      console.log("Listing new tasks -- ");
      console.log(DataCache.GetAllTasks());

      // link proj1 -> comp1 -> task1
      this.Assert(proj1.AddSubTask(comp1.Id), "proj1.AddSubTask(comp1.Id)");
      this.Assert(comp1.AddSubTask(task1.Id), "comp1.AddSubTask(task1.Id)");

      // link proj2 -> comp2 -> task2
      this.Assert(proj2.AddSubTask(comp2.Id), "proj2.AddSubTask(comp2.Id)");
      this.Assert(comp2.AddSubTask(task2.Id), "comp2.AddSubTask(task2.Id)");

      // link proj3 -> comp3 -> task3
      this.Assert(proj3.AddSubTask(comp3.Id), "proj3.AddSubTask(comp3.Id)");
      this.Assert(comp3.AddSubTask(task3.Id), "comp3.AddSubTask(task3.Id)");

      // trying to add task comp3 to itself should return false.
      this.Assert(!comp3.AddSubTask(comp3.Id), "!comp3.AddSubTask(comp3.Id)");

      // trying to add parent task proj3 to child task3 should return false.
      this.Assert(!task3.AddSubTask(proj3.Id), "!task3.AddSubTask(proj3.Id)");

      // verify proj2 exists
      this.Assert(DataCache.IsTask(proj2.Id), "DataCache.IsTask(proj2.Id)");

      // verify link-chain  P102 -> C102 -> T102
      this.Assert(
        DataCache.GetTask("P102").subTasks.includes("C102"),
        'DataCache.GetTask("P102").subTasks.includes("C102")'
      );
      this.Assert(
        DataCache.GetTask("C102").subTasks.includes("T102"),
        'DataCache.GetTask("C102").subTasks.includes("T102")'
      );

      // create a new task JUNK
      DataCache.AddTask("Task", "JUNK", "JunkTask", "Junk Task Desc.");
      this.Assert(DataCache.IsTask("JUNK"), 'DataCache.IsTask("JUNK")');

      // add JUNK to proj3 as well as task3 -- so that JUNK has 2 parents
      this.Assert(proj3.AddSubTask("JUNK"), 'proj3.AddSubTask("JUNK")');
      this.Assert(task3.AddSubTask("JUNK"), 'task3.AddSubTask("JUNK")');

      // verify links P103->JUNK and T103->JUNK
      this.Assert(
        DataCache.GetTask("P103").subTasks.includes("JUNK"),
        'DataCache.GetTask("P103").subTasks.includes("JUNK")'
      );
      this.Assert(
        DataCache.GetTask("T103").subTasks.includes("JUNK"),
        'DataCache.GetTask("T103").subTasks.includes("JUNK")'
      );

      // link C103->JUNK should not exist because it was never created.
      this.Assert(
        !DataCache.GetTask("C103").subTasks.includes("JUNK"),
        '!DataCache.GetTask("C103").subTasks.includes("JUNK")'
      );

      // now delete JUNK task
      this.Assert(DataCache.RemoveTask("JUNK"), 'DataCache.RemoveTask("JUNK")');

      // verify that links P103->JUNK and T103->JUNK do not exist anymore because JUNK task has been deleted.
      this.Assert(
        !DataCache.GetTask("P103").subTasks.includes("JUNK"),
        '!DataCache.GetTask("P103").subTasks.includes("JUNK")'
      );
      this.Assert(
        !DataCache.GetTask("T103").subTasks.includes("JUNK"),
        '!DataCache.GetTask("T103").subTasks.includes("JUNK")'
      );

      // link C103->JUNK should not exist because it was never created.
      this.Assert(
        !DataCache.GetTask("C103").subTasks.includes("JUNK"),
        '!DataCache.GetTask("C103").subTasks.includes("JUNK")'
      );

      // should not able to close C103 because its child T103 is still open
      this.Assert(
        !DataCache.GetTask("C103").UpdateStatus(DataCache.StatusClosed),
        '!DataCache.GetTask("C103").UpdateStatus(DataCache.StatusClosed)'
      );

      // CLOSE T103 and then close C103
      this.Assert(
        DataCache.GetTask("T103").UpdateStatus(DataCache.StatusClosed),
        'DataCache.GetTask("T103").UpdateStatus(DataCache.StatusClosed)'
      );
      this.Assert(
        DataCache.GetTask("C103").UpdateStatus(DataCache.StatusClosed),
        'DataCache.GetTask("C103").UpdateStatus(DataCache.StatusClosed)'
      );

      // should not be able to reopen T103 because its parent C103 is closed
      this.Assert(
        !DataCache.GetTask("T103").UpdateStatus(DataCache.StatusExecution),
        '!DataCache.GetTask("T103").UpdateStatus(DataCache.StatusExecution)'
      );

      // Add 3 required roles to C103
      this.Assert(
        DataCache.GetTask("C103").AddReqRole("Engineer"),
        'DataCache.GetTask("C103").AddReqRole("Engineer")'
      );
      this.Assert(
        DataCache.GetTask("C103").AddReqRole("Designer"),
        'DataCache.GetTask("C103").AddReqRole("Designer")'
      );
      this.Assert(
        DataCache.GetTask("C103").AddReqRole("UX Researcher"),
        'DataCache.GetTask("C103").AddReqRole("UX Researcher")'
      );

      // should not be able to add role "Developer", which does not exists
      this.Assert(
        !DataCache.GetTask("C103").AddReqRole("Developer"),
        '!DataCache.GetTask("C103").AddReqRole("Developer")'
      );

      // remove "Designer" role
      this.Assert(
        DataCache.GetTask("C103").RemoveReqRole("Designer"),
        'DataCache.GetTask("C103").RemoveReqRole("Designer")'
      );

      // add 3 required approvals PM101, M101, D101
      this.Assert(
        DataCache.GetTask("C103").AddReqApproval("PM101"),
        'DataCache.GetTask("C103").AddReqApproval("PM101")'
      );
      this.Assert(
        DataCache.GetTask("C103").AddReqApproval("M101"),
        'DataCache.GetTask("C103").AddReqApproval("M101")'
      );
      this.Assert(
        DataCache.GetTask("C103").AddReqApproval("D101"),
        'DataCache.GetTask("C103").AddReqApproval("D101")'
      );

      // add 1 endoresement D101
      this.Assert(
        DataCache.GetTask("C103").AddEndorsement("D101"),
        'DataCache.GetTask("C103").AddEndorsement("D101")'
      );

      // add 1 approver M101 -- now PM101 and D101 are pending approvals
      this.Assert(
        DataCache.GetTask("C103").AddApprover("M101"),
        'DataCache.GetTask("C103").AddApprover("M101")'
      );

      // verify that M101 is not a pending approval
      this.Assert(
        !DataCache.GetTask("C103").GetPendingApprovals().includes("M101"),
        '!DataCache.GetTask("C103").GetPendingApprovals().includes("M101")'
      );

      // verify that PM101 and D101 are pending approvals
      this.Assert(
        DataCache.GetTask("C103").GetPendingApprovals().includes("PM101"),
        'DataCache.GetTask("C103").GetPendingApprovals().includes("PM101")'
      );
      this.Assert(
        DataCache.GetTask("C103").GetPendingApprovals().includes("D101"),
        'DataCache.GetTask("C103").GetPendingApprovals().includes("D101")'
      );

      console.log(
        "END TestTasks()   =============================================="
      );
    } catch (error) {
      console.log(error);
    }
  }
}
