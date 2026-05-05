import { Schema, model } from "mongoose";

//create user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:[true,"Email already existed"]
    },
    password: {
      type: String,
      required: true,
    },
    todos: [
      {
        taskName: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, default: "pending" },
        createdAt: { type: Date, default: Date.now },
        dueDate: { type: Date },
        notificationSent: { type: Boolean, default: false }
      },
    ],
  },
  { versionKey: false, timestamps: true, strict: true }
);

//generate user model for the above user schema
export const UserModel = model("user", userSchema);
