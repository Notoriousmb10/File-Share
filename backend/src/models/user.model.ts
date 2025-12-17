import {Schema, Document, model} from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser{
    name: string
    email: string
    password: string
}

interface IUserDocument extends IUser, Document{
    comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


UserSchema.pre('save', async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
})

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean>{
    return await bcrypt.compare(password, this.password)
}

const UserModel = model<IUserDocument>('User', UserSchema)
export default UserModel 