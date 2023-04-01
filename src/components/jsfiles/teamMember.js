/* eslint-disable no-useless-catch */
import { DataCache } from "./script.js";

export class TeamMember {
  constructor(id, name, role) {
    this.role = "";
    try {
      if (!DataCache.ifExist(name)) throw "Member Name cannot be empty.";
      if (!DataCache.ifExist(id)) throw "Member Id cannot be empty.";
      if (!DataCache.ifExist(role)) throw "Role cannot be empty.";
      this.name = name.trim();
      this.id = id.trim();
      if (DataCache.IsRole(role)) {
        this.role = role;
      } else {
        console.error(`Invalid Role type - ${role}`);
      }
    } catch (error) {
      throw error;
    }
  }

  get Name() {
    return this.name;
  }
  get Id() {
    return this.id;
  }
  get Role() {
    return this.role;
  }
}
