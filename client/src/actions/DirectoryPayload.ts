import { ActionPayload } from "../AppDispatcher";
import { Directories } from "../directories/Directory";

export interface ReceiveDirectoryPayload extends ActionPayload {
    directories: Directories
}