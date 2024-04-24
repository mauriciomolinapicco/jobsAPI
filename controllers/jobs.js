const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count:jobs.length})
}

const getJob = async (req,res) => {
    const jobId = req.params.id;
    const userId = req.user.userId
    //Can also do it like: 
    //const {user:{userId},params:{id:jobId}} = req

    const job = await Job.findOne({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError('No job with id',jobId)
    }
    res.status(StatusCodes.OK).json({ job })
} 

const createJob = async (req,res) => {
    
    const {company, position, status} = req.body
    const createdBy = req.user.userId;
    const newJob = {company, position, status, createdBy}

    const job = await Job.create(newJob)

    res.status(StatusCodes.CREATED).json({job})
} 

const updateJob = async (req,res) => {
    const userId = req.user.userId
    const jobId = req.params.id

    const {company, position} = req.body

    if(company==='' || position===''){
        throw new BadRequestError('Company and position fields cant be empty')
    }
    
    const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},
        req.body, { 
        //update job
        new:true,
        runValidators:true
    })
    if(!job){
        throw new NotFoundError('No job with that id')
    }


    res.status(StatusCodes.OK).json({job})
} 

const deleteJob = async (req,res) => {
    const 
        {user: {userId},
        params: {id:jobId},
    } = req
    
    const job = await Job.findOneAndRemove({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError('No error with id selected')
    }

    res.status(StatusCode.OK).send()
} 

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}