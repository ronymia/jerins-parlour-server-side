const { ObjectId } = require("mongodb");
const { getDatabase } = require("../utils/dbConnect");

// Get all document to the collection
module.exports.getAllService = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const services = await db.collection("services").find({}).toArray();
        // console.log(services);
        res.status(200).json({
            status: true,
            message: "success",
            data: services,
            total: services?.length
        });
    } catch (error) {
        next(error); // send error to the global error handler
    };
};

// Get a document Details
module.exports.getServiceDetail = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        // id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Invalid service id",
            });
        };

        // getting data
        const service = await db.collection("services").findOne({ _id: new ObjectId(id) });
        // if service is not found
        if (!service) {
            return res.status(400).json({
                status: false,
                error: `Service with ID ${id} not found`,
            });
        };
        // if no error encountered
        res.status(200).json({
            status: true,
            message: "success",
            data: service
        });
    } catch (error) {
        next(error); // send error to the global error handler
    };
};

// save a new document to the collection
module.exports.saveService = async (req, res, next) => {
    try {
        const db = await getDatabase();
        // save data to the collection
        const result = await db.collection("services").insertOne(req.body);
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
            message: "Service created successfully",
            data: result
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// update a exist document to the collection
module.exports.updateService = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params; // user id

        // id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Not a valid service ID",
            });
        };

        // 
        const service = await db.collection("services").updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        // error while updating
        if (!service.modifiedCount) {
            return res.status(400).json({
                status: false,
                error: "Couldn't update the service",
            });
        };
        // if no errors are encountered
        res.status(200).json({
            status: true,
            message: "Successfully updated the service",
        });
    } catch (error) {
        next(error); // send error to global error handler
    };
};

// delete a  document to the collection
module.exports.deleteService = async (req, res, next) => {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        // id validation
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                error: "Not a valid service id",
            });
        };

        // 
        const result = await db.collection("services").deleteOne({ _id: new ObjectId(id) });
        // error while deleting
        if (!result.deleteCount) {
            return res.status(400).json({
                status: false,
                error: "Couldn't delete the service",
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