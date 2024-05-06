const express = require("express");
const usersController = require("../../controllers/user.controller");
module.exports = router = express.Router();



router
    /***************
     * 
    * @api {get} / all user
    * @apiDescription get all user
    * @apiPermission only admin  access
    *
    * @apiHeader {string} => user's access token
    * @apiHeaderExample {json} Header-Example:
    *
    * @apiQuery {page}   [page=1] => List pages
    * @apiQuery {Number{1-100}}    [Limit=10] per page
    *
    *@apiSuccess {Object[]} Response=> all of users
    *
    *@apiError {Unauthorized 401} => only authorized users can access this
    *@apiError {forbidden 403} => only only can access this
    *
    *************/
    .get("/", usersController.getAllUser)


    /***************
     * 
    * @api {get} / single user Detail
    * @apiDescription get single user detail
    * @apiPermission only admin  access
    *
    * @apiHeader {string} => user's access token
    * @apiHeaderExample {json} Header-Example:
    *
    * @apiParam {page}   [page=1] => List pages
    * @apiParam {Number{1-100}}    [Limit=10]  User per page
    *
    *@apiSuccess {Object[]} Response=> get single user
    *
    *@apiError {Unauthorized 401} => only authorized users can access this
    *@apiError {forbidden 403} => only only can access this
    *
    *************/

    .get("/:id", usersController.getUserDetail)


    /***************
    * @api {post} / save a user
    * @apiDescription  user registration in database
    * @apiPermission public
    *
    * @apiHeader {string} => user's access token
    * @apiHeaderExample {json} Header-Example:
    *
    * @apiParam {Number{1-}}   [page=1] => List pages
    * @apiParam {Number{1-100}}    [Limit=10]  User per page
    *
    *@apiSuccess {Object[]} Response=> 
    *
    *@apiError {Unauthorized 401} => only authorized users can access this
    *@apiError {forbidden 403} => only only can access this
    *
    *************/
    .post("/registration", usersController.saveUser)


    /***************
    * @api {patch} / update a user info
    * @apiDescription  user info update in database
    * @apiPermission current user permissions
    *
    * @apiHeader {string} => user's access token
    * @apiHeaderExample {json} Header-Example:
    *
    * @apiParam {id}   [id=user_id]
    *
    *@apiSuccess {Object[]} Response=> 
    *
    *@apiError {Unauthorized 401} => only authorized users can access this
    *@apiError {forbidden 403} => only only can access this
    *
    *************/
    .patch("/:id", usersController.updateUser)


    /***************
    * @api {delete} / update a user info
    * @apiDescription  delete user in database
    * @apiPermission current user permissions
    *
    * @apiHeader {string} => user's access token
    * @apiHeaderExample {json} Header-Example:
    *
    * @apiParam {id}   [id=user_id]
    *
    *@apiSuccess {Object[]} Response=> 
    *
    *@apiError {Unauthorized 401} => only authorized users can access this
    *@apiError {forbidden 403} => only only can access this
    *
    *************/
    .delete("/:id", usersController.deleteUser);



