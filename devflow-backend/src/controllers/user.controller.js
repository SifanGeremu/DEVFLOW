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

const updateQuery = "UPDATE users SET name = ? WHERE id = ?";
    const [result] = await pool.execute(updateQuery, [name, userId]);
        if(result.affectedRows === 0){
            return res.status(404).json({message:"User not found"});
        }   