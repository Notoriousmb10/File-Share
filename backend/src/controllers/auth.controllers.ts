import { IUser } from "../models/user.model";
import * as authService from "../service/auth.service" 
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
    try{
         await authService.register(req.body as  unknown as IUser)
        .then((details)=> {
            return res.status(200).json({
                message: "User registered successfully",
                status: details.status,
                data: details,
                token: details.token
            })
        })
    }catch(error){
        throw new Error(error)
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        await authService.login(req.body)
        .then((details)=> {
            return res.status(200).json({
                message: "User logged in successfully",
                data: details
            })
        })
    }catch(error){
        throw new Error(error)
    }
}