import { ActionPayload } from "../AppDispatcher";
import { Directories } from "../videos/Directory";

export interface ReceiveDirectoryPayload extends ActionPayload {
    directories: Directories
}