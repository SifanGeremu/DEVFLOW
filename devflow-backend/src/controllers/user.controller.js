const userProfile = async(req,res)=>{
    try {
        const userId = req.userId;
        const name = req.name;
        
    } catch (error) {
        console.log(error)
    }
}

const updateUserProfile = async (req,res)=>{
    try {
        const userId = req.userId;
        const {name} = req.body;

        if(!name){
            return res.status(400).json({message:"Name is required"});
        
    } catch (error) {
        console.log(err)
    }
}