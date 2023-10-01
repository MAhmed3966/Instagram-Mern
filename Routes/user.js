
import express from "express";
import {getAll, getUserFriends,addRemoveFriend} from "../Controllers/usersControllers.js"
import { verifyToken } from "../Middleware/auth.js";

const userRouter  = express.Router();

// Read Route
userRouter.get("/:id", verifyToken ,getAll);
userRouter.get("/:id/friends", verifyToken ,getUserFriends);


// Update Route
userRouter.patch("/:id/friendId", verifyToken, addRemoveFriend)

export default userRouter;