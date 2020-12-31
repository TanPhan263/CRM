const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth')
const User = require("../models/user");


var { Employee } = require('../models/employee');

// => localhost:3000/employees/
router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user.id);

    Employee.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
    });

});

router.get('/:id', auth,async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', auth,async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.role == "1") {
        var emp = new Employee({
            name: req.body.name,
            position: req.body.position,
            office: req.body.office,
            salary: req.body.salary,
        });
        emp.save((err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
        });
    }
    else {
        res.send(" You don't have permission");
    }
});

router.put('/:id', auth,async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.role == "1") {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send(`No record with given id : ${req.params.id}`);

        var emp = {
            name: req.body.name,
            position: req.body.position,
            office: req.body.office,
            salary: req.body.salary,
        };
        Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
        });
    }
    else {
        res.send(" You don't have permission");
    }
});

router.delete('/:id', auth,async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.role == "1") {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send(`No record with given id : ${req.params.id}`);

        Employee.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
        });
    }
    else {
        res.send(" You don't have permission");
    }
});

module.exports = router;