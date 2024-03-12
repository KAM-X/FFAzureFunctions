// example service class, modify if needed, otherwise extend

import axios from "axios";
import { IMessageRepository } from "../repositories/exampleFakeRepo";
import { TestMessage } from "../models/testMessage";

export class MsgService {
    private repository: IMessageRepository;

    constructor(stockDataRepo: IMessageRepository) {
        this.repository = stockDataRepo;
    }

    async saveMsg(msg: any): Promise<void> {
        try {
            await this.repository.save(msg);
        } catch (error) {
            console.error("Error saving message:", error);
            // Handle error appropriately
        }
    }

    async getAllMsgs(): Promise<TestMessage[]> {
      try {
        return await this.repository.getAll();
      }
      catch (error) {
        console.error("Error getting all messages:", error);
        // Handle error appropriately
      }
    }
}
