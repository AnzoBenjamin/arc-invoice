import { combineReducers } from "redux";

import invoices from "@/reducers/invoices";
import clients from "@/reducers/clients";
import auth from "@/reducers/auth";
import profiles from "@/reducers/profiles";
import inventory from "@/reducers/inventory";
import expenses from "@/reducers/expenses";
export default combineReducers({
  invoices,
  clients,
  auth,
  profiles,
  inventory,
  expenses
});
