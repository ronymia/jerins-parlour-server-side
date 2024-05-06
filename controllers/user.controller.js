const { ObjectId } = require("mongodb");
const { getDatabase } = require("../utils/dbConnect");

// Get all document to the collection
module.exports.getAllUser = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const users = await db.collection("users").find({}).toArray();
        // console.log(users);
        res.status(200).json({
            status: true,
            message: "success",
            data: users,
            total: users?.length // total users
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// Get a document detail
module.exports.getUserDetail = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params; // getting user id from request params

        // checking  user id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Not a valid User ID",
            });
        };
        // getting user by id
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        // not found user
        if (!user) {
            return res.status(400).json({
                status: false,
                error: `User with ID ${id} not found`,
            });
        }
        // if user get
        res.status(200).json({
            status: true,
            message: "success",
            data: user
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// Save a new document to the collection
module.exports.saveUser = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const user = req.body; // get the user data
        // checking is user already exist or not
        const existUser = await db.collection("users").findOne({ email: user.email });
        // if user exist then return
        if (existUser) {
            return res.status(400).json({
                status: false,
                message: "Email already exists",
            });
        };
        // save user to the collection
        const result = await db.collection("users").insertOne(user);
        // if any errors are encountered
        if (!result?.insertedId) {
            return res.status(400).json({
                status: false,
                message: "Bad request",
            });
        };
        // if no errors are encountered 
        res.status(201).json({
            status: true,
            message: "User created successfully",
            data: result
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// Update a exist document to the collection
module.exports.updateUser = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params; // user id

        // id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Not a valid User ID",
            });
        };

        // 
        const user = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        // error while updating
        if (!user.modifiedCount) {
            return res.status(400).json({
                status: false,
                error: "Couldn't update the user",
            });
        };
        // if no errors are encountered
        res.status(200).json({
            status: true,
            message: "Successfully updated the user",
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// Delete a document to the collection
module.exports.deleteUser = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        // id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Not a valid User ID",
            });
        };

        // 
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        // error while deleting
        if (!result.deleteCount) {
            return res.status(400).json({
                status: false,
                error: "Couldn't delete the user",
            });
        };
        // if no errors are encountered
        res.status(200).json({
            status: true,
            message: "Successfully deleted",
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};