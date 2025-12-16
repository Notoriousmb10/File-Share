import { Schema, model } from "mongoose";

export interface IFileMetaData{
    ownerId: string;
    uploadedAt: Date;
    sharedUsers: string[];
    fileType: string;
    fileSize: number;
    fileName: string;
    s3Key: string;
}


interface IFileMetaDataDocument extends IFileMetaData, Document{}

const FileMetaData = new Schema<IFileMetaDataDocument>({
    ownerId: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    sharedUsers: {
        type: [String],
        default: []
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    s3Key: {
        type: String,
        required: true
    }
})

export default model<IFileMetaDataDocument>('FileMetaData', FileMetaData)
