import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app=express()

app.get("/server", (req, res)=>{
    return res.json(({
        status: 200,
        server: "dhakalserver"
    })) 
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running at port ${process.env.PORT}`)
})
