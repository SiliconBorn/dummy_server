const getAllUsers = async(req,res)=>{

    try {
        const users =  await require("../users.json")
        // console.log(users);
        console.log(req.username);

        return res.status(200).json({
            users,
            message:"SUCCESSFULLT FETCHED ALL USERS LIST"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error
        })
    }
}


module.exports = {
    getAllUsers
}